// 核心像素化算法引擎

import type { PixelationOptions, ColorRGBA, ProcessingProgress } from '@/types/image';

export class PixelationEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private onProgress?: (progress: ProcessingProgress) => void;

  constructor(canvas: HTMLCanvasElement, onProgress?: (progress: ProcessingProgress) => void) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('无法获取 Canvas 2D 上下文');
    }
    this.ctx = context;
    this.onProgress = onProgress;
  }

  /**
   * 主要的像素化处理方法
   */
  async pixelate(imageData: ImageData, options: PixelationOptions): Promise<ImageData> {
    const { pixelSize, colorMode, edgeMode } = options;
    
    // 1. 降采样
    this.reportProgress('downsample', 0);
    const downsampled = await this.downsample(imageData, pixelSize);
    this.reportProgress('downsample', 100);
    
    // 2. 颜色处理
    this.reportProgress('color', 0);
    const colorProcessed = await this.processColors(downsampled, colorMode);
    this.reportProgress('color', 100);
    
    // 3. 边缘处理
    this.reportProgress('edge', 0);
    const edgeProcessed = await this.processEdges(colorProcessed, edgeMode);
    this.reportProgress('edge', 100);
    
    // 4. 上采样回原尺寸
    this.reportProgress('upsample', 0);
    const result = await this.upsample(edgeProcessed, imageData.width, imageData.height, pixelSize);
    this.reportProgress('upsample', 100);

    return result;
  }

  /**
   * 降采样算法 - 将图像缩小到指定像素块大小
   */
  private async downsample(imageData: ImageData, pixelSize: number): Promise<ImageData> {
    const { width, height, data } = imageData;
    const newWidth = Math.floor(width / pixelSize);
    const newHeight = Math.floor(height / pixelSize);
    const newImageData = new ImageData(newWidth, newHeight);

    for (let y = 0; y < newHeight; y++) {
      for (let x = 0; x < newWidth; x++) {
        // 计算当前像素块的平均颜色
        const avgColor = this.getAverageColor(
          data, width, height,
          x * pixelSize, y * pixelSize,
          pixelSize, pixelSize
        );
        
        const newIndex = (y * newWidth + x) * 4;
        newImageData.data[newIndex] = avgColor.r;
        newImageData.data[newIndex + 1] = avgColor.g;
        newImageData.data[newIndex + 2] = avgColor.b;
        newImageData.data[newIndex + 3] = avgColor.a;
      }

      // 每完成一行就让出控制权，避免阻塞UI
      if (y % 10 === 0) {
        await this.yieldControl();
      }
    }

    return newImageData;
  }

  /**
   * 计算指定区域的平均颜色
   */
  private getAverageColor(
    data: Uint8ClampedArray,
    width: number, height: number,
    startX: number, startY: number,
    blockWidth: number, blockHeight: number
  ): ColorRGBA {
    let r = 0, g = 0, b = 0, a = 0, count = 0;

    for (let y = startY; y < Math.min(startY + blockHeight, height); y++) {
      for (let x = startX; x < Math.min(startX + blockWidth, width); x++) {
        const index = (y * width + x) * 4;
        r += data[index];
        g += data[index + 1];
        b += data[index + 2];
        a += data[index + 3];
        count++;
      }
    }

    return {
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count),
      a: Math.round(a / count)
    };
  }

  /**
   * 颜色模式处理
   */
  private async processColors(imageData: ImageData, colorMode: string): Promise<ImageData> {
    const newImageData = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    );

    switch (colorMode) {
      case 'retro':
        return await this.applyRetroPalette(newImageData);
      case 'grayscale':
        return await this.applyGrayscale(newImageData);
      case 'sepia':
        return await this.applySepia(newImageData);
      case 'vibrant':
        return await this.applyVibrant(newImageData);
      default:
        return newImageData;
    }
  }

  /**
   * 应用复古8位调色板
   */
  private async applyRetroPalette(imageData: ImageData): Promise<ImageData> {
    // NES调色板 - 经典的16色调色板
    const palette = [
      [0, 0, 0], [29, 43, 83], [126, 37, 83], [0, 135, 81],
      [171, 82, 54], [95, 87, 79], [194, 195, 199], [255, 241, 232],
      [255, 0, 77], [255, 163, 0], [255, 236, 39], [0, 228, 54],
      [41, 173, 255], [131, 118, 156], [255, 119, 168], [255, 204, 170]
    ];

    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const closest = this.findClosestColor(
        [data[i], data[i + 1], data[i + 2]],
        palette
      );
      data[i] = closest[0];
      data[i + 1] = closest[1];
      data[i + 2] = closest[2];

      // 每处理1000个像素就让出控制权
      if (i % 4000 === 0) {
        await this.yieldControl();
      }
    }

    return imageData;
  }

  /**
   * 查找调色板中最接近的颜色
   */
  private findClosestColor(color: number[], palette: number[][]): number[] {
    let minDistance = Infinity;
    let closest = palette[0];

    for (const paletteColor of palette) {
      // 使用欧几里得距离计算颜色差异
      const distance = Math.sqrt(
        Math.pow(color[0] - paletteColor[0], 2) +
        Math.pow(color[1] - paletteColor[1], 2) +
        Math.pow(color[2] - paletteColor[2], 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closest = paletteColor;
      }
    }

    return closest;
  }

  /**
   * 应用灰度效果
   */
  private async applyGrayscale(imageData: ImageData): Promise<ImageData> {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // 使用标准的灰度转换公式
      const gray = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;

      if (i % 4000 === 0) {
        await this.yieldControl();
      }
    }
    return imageData;
  }

  /**
   * 应用棕褐色调效果
   */
  private async applySepia(imageData: ImageData): Promise<ImageData> {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = Math.min(255, Math.round((r * 0.393) + (g * 0.769) + (b * 0.189)));
      data[i + 1] = Math.min(255, Math.round((r * 0.349) + (g * 0.686) + (b * 0.168)));
      data[i + 2] = Math.min(255, Math.round((r * 0.272) + (g * 0.534) + (b * 0.131)));

      if (i % 4000 === 0) {
        await this.yieldControl();
      }
    }
    return imageData;
  }

  /**
   * 应用鲜艳色彩效果
   */
  private async applyVibrant(imageData: ImageData): Promise<ImageData> {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // 增强饱和度
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      const min = Math.min(data[i], data[i + 1], data[i + 2]);
      const delta = max - min;
      
      if (delta > 0) {
        const factor = 1.5; // 饱和度增强因子
        data[i] = Math.min(255, Math.round(min + (data[i] - min) * factor));
        data[i + 1] = Math.min(255, Math.round(min + (data[i + 1] - min) * factor));
        data[i + 2] = Math.min(255, Math.round(min + (data[i + 2] - min) * factor));
      }

      if (i % 4000 === 0) {
        await this.yieldControl();
      }
    }
    return imageData;
  }

  /**
   * 边缘处理
   */
  private async processEdges(imageData: ImageData, edgeMode: string): Promise<ImageData> {
    if (edgeMode === 'soft') {
      return await this.applySoftEdges(imageData);
    }
    return imageData; // hard edges 是默认状态，不需要额外处理
  }

  /**
   * 应用软边缘处理（轻微模糊）
   */
  private async applySoftEdges(imageData: ImageData): Promise<ImageData> {
    // 简单的3x3高斯模糊核
    const kernel = [
      1/16, 2/16, 1/16,
      2/16, 4/16, 2/16,
      1/16, 2/16, 1/16
    ];
    
    return await this.applyConvolution(imageData, kernel, 3);
  }

  /**
   * 应用卷积操作
   */
  private async applyConvolution(imageData: ImageData, kernel: number[], kernelSize: number): Promise<ImageData> {
    const { width, height, data } = imageData;
    const newData = new Uint8ClampedArray(data.length);
    const half = Math.floor(kernelSize / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0;

        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const py = Math.min(height - 1, Math.max(0, y + ky - half));
            const px = Math.min(width - 1, Math.max(0, x + kx - half));
            const pi = (py * width + px) * 4;
            const ki = ky * kernelSize + kx;

            r += data[pi] * kernel[ki];
            g += data[pi + 1] * kernel[ki];
            b += data[pi + 2] * kernel[ki];
          }
        }

        const i = (y * width + x) * 4;
        newData[i] = Math.min(255, Math.max(0, Math.round(r)));
        newData[i + 1] = Math.min(255, Math.max(0, Math.round(g)));
        newData[i + 2] = Math.min(255, Math.max(0, Math.round(b)));
        newData[i + 3] = data[i + 3]; // 保持 alpha 不变
      }

      // 每完成一行就让出控制权
      if (y % 5 === 0) {
        await this.yieldControl();
      }
    }

    return new ImageData(newData, width, height);
  }

  /**
   * 上采样回原尺寸
   */
  private async upsample(
    imageData: ImageData,
    targetWidth: number,
    targetHeight: number,
    pixelSize: number
  ): Promise<ImageData> {
    const newImageData = new ImageData(targetWidth, targetHeight);
    const { width, height, data } = imageData;

    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const sourceX = Math.floor(x / pixelSize);
        const sourceY = Math.floor(y / pixelSize);
        
        if (sourceX < width && sourceY < height) {
          const sourceIndex = (sourceY * width + sourceX) * 4;
          const targetIndex = (y * targetWidth + x) * 4;

          newImageData.data[targetIndex] = data[sourceIndex];
          newImageData.data[targetIndex + 1] = data[sourceIndex + 1];
          newImageData.data[targetIndex + 2] = data[sourceIndex + 2];
          newImageData.data[targetIndex + 3] = data[sourceIndex + 3];
        }
      }

      // 每完成一行就让出控制权
      if (y % 20 === 0) {
        await this.yieldControl();
      }
    }

    return newImageData;
  }

  /**
   * 让出控制权，避免阻塞UI线程
   */
  private async yieldControl(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  /**
   * 报告处理进度
   */
  private reportProgress(stage: ProcessingProgress['stage'], progress: number): void {
    if (this.onProgress) {
      this.onProgress({ stage, progress });
    }
  }
}
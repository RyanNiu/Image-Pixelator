// 图像下载工具类

export type DownloadFormat = 'png' | 'jpg' | 'webp';

export interface DownloadOptions {
  format: DownloadFormat;
  quality?: number; // 0-1，仅用于 JPG 和 WebP
  filename?: string;
  addTimestamp?: boolean;
}

export interface FormatInfo {
  mimeType: string;
  extension: string;
  supportsQuality: boolean;
  isSupported: boolean;
}

/**
 * 图像下载管理器
 */
export class ImageDownloader {
  /**
   * 下载Canvas内容
   */
  static async downloadCanvas(
    canvas: HTMLCanvasElement,
    options: DownloadOptions = { format: 'png' }
  ): Promise<void> {
    const { format, quality = 0.9, filename, addTimestamp = true } = options;
    
    // 检查格式支持
    if (!this.isFormatSupported(format)) {
      throw new Error(`Format ${format} is not supported by this browser`);
    }

    // 生成文件名
    const finalFilename = this.generateFilename(format, filename, addTimestamp);

    // 转换为 Blob
    const blob = await this.canvasToBlob(canvas, format, quality);
    
    // 执行下载
    this.downloadBlob(blob, finalFilename);
  }

  /**
   * 下载ImageData
   */
  static async downloadImageData(
    imageData: ImageData,
    options: DownloadOptions = { format: 'png' }
  ): Promise<void> {
    // 创建临时Canvas
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    await this.downloadCanvas(canvas, options);
  }

  /**
   * 将Canvas转换为Blob
   */
  private static async canvasToBlob(
    canvas: HTMLCanvasElement,
    format: DownloadFormat,
    quality: number
  ): Promise<Blob> {
    const formatInfo = this.getFormatInfo(format);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        formatInfo.mimeType,
        formatInfo.supportsQuality ? quality : undefined
      );
    });
  }

  /**
   * 执行文件下载
   */
  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // 添加到DOM，触发下载，然后移除
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 清理URL对象
    URL.revokeObjectURL(url);
  }

  /**
   * 生成文件名
   */
  private static generateFilename(
    format: DownloadFormat,
    customFilename?: string,
    addTimestamp: boolean = true
  ): string {
    if (customFilename) {
      return customFilename.endsWith(`.${format}`) 
        ? customFilename 
        : `${customFilename}.${format}`;
    }

    const base = 'pixelated-image';
    const timestamp = addTimestamp 
      ? `-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}`
      : '';
    
    return `${base}${timestamp}.${format}`;
  }

  /**
   * 获取格式信息
   */
  private static getFormatInfo(format: DownloadFormat): FormatInfo {
    switch (format) {
      case 'png':
        return {
          mimeType: 'image/png',
          extension: 'png',
          supportsQuality: false,
          isSupported: true
        };
      case 'jpg':
        return {
          mimeType: 'image/jpeg',
          extension: 'jpg',
          supportsQuality: true,
          isSupported: this.checkJpegSupport()
        };
      case 'webp':
        return {
          mimeType: 'image/webp',
          extension: 'webp',
          supportsQuality: true,
          isSupported: this.checkWebpSupport()
        };
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }

  /**
   * 检查JPEG支持
   */
  private static checkJpegSupport(): boolean {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/jpeg').startsWith('data:image/jpeg');
  }

  /**
   * 检查WebP支持
   */
  private static checkWebpSupport(): boolean {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  }

  /**
   * 检查格式是否支持
   */
  static isFormatSupported(format: DownloadFormat): boolean {
    try {
      return this.getFormatInfo(format).isSupported;
    } catch {
      return false;
    }
  }

  /**
   * 获取所有支持的格式
   */
  static getSupportedFormats(): DownloadFormat[] {
    const allFormats: DownloadFormat[] = ['png', 'jpg', 'webp'];
    return allFormats.filter(format => this.isFormatSupported(format));
  }

  /**
   * 估算文件大小
   */
  static async estimateFileSize(
    canvas: HTMLCanvasElement,
    format: DownloadFormat,
    quality: number = 0.9
  ): Promise<number> {
    try {
      const blob = await this.canvasToBlob(canvas, format, quality);
      return blob.size;
    } catch {
      return 0;
    }
  }

  /**
   * 批量下载（如果需要下载多个处理结果）
   */
  static async batchDownload(
    downloads: Array<{
      canvas: HTMLCanvasElement;
      options: DownloadOptions;
    }>
  ): Promise<void> {
    for (const { canvas, options } of downloads) {
      await this.downloadCanvas(canvas, options);
      // 在批量下载之间添加小延迟，避免浏览器阻止多个下载
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * 格式化文件大小显示
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 获取推荐的下载选项
   */
  static getRecommendedOptions(imageData: ImageData): DownloadOptions {
    const pixelCount = imageData.width * imageData.height;
    
    // 根据图像大小推荐格式和质量
    if (pixelCount > 2000000) { // 大图像
      return {
        format: 'jpg',
        quality: 0.8,
        addTimestamp: true
      };
    } else if (pixelCount > 500000) { // 中等图像
      return {
        format: 'webp',
        quality: 0.9,
        addTimestamp: true
      };
    } else { // 小图像
      return {
        format: 'png',
        addTimestamp: true
      };
    }
  }
}
// 图像处理相关类型定义

export interface PixelationOptions {
  pixelSize: number;
  colorMode: 'original' | 'retro' | 'grayscale' | 'sepia' | 'vibrant';
  edgeMode: 'hard' | 'soft';
}

export interface ProcessedImage {
  originalImageData: ImageData;
  processedImageData: ImageData;
  options: PixelationOptions;
  timestamp: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ColorRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface ProcessingProgress {
  stage: 'downsample' | 'color' | 'edge' | 'upsample';
  progress: number; // 0-100
}

export interface ImageProcessorState {
  originalImage: HTMLImageElement | null;
  processedImageData: ImageData | null;
  isProcessing: boolean;
  error: string | null;
  progress: ProcessingProgress | null;
}
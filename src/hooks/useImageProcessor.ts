// 图像处理核心Hook

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { PixelationEngine } from '@/lib/pixelation';
import { ImageDownloader, type DownloadFormat, type DownloadOptions } from '@/lib/downloadUtils';
import { useHistory } from '@/hooks/useHistory';
import type { 
  PixelationOptions, 
  ImageProcessorState, 
  ProcessingProgress 
} from '@/types/image';

export interface UseImageProcessorReturn extends ImageProcessorState {
  // 历史相关
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  
  // 方法
  handleFileUpload: (file: File) => void;
  handleImageLoad: (image: HTMLImageElement) => void;
  processImage: (options: PixelationOptions) => Promise<void>;
  downloadImage: (options?: DownloadOptions) => Promise<void>;
  handleUndo: () => void;
  handleRedo: () => void;
  clearHistory: () => void;
  resetProcessor: () => void;
  
  // Canvas refs
  originalCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  processedCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  
  // 文件输入ref
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * 图像处理Hook
 * 整合所有图像处理相关功能
 */
export function useImageProcessor(): UseImageProcessorReturn {
  // 状态管理
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedImageData, setProcessedImageData] = useState<ImageData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PixelationEngine | null>(null);

  // 历史管理
  const history = useHistory();

  // 初始化像素化引擎
  useEffect(() => {
    // 延迟初始化，确保组件已完全挂载
    const initEngine = () => {
      if (processedCanvasRef.current && !engineRef.current) {
        console.log('初始化 PixelationEngine');
        engineRef.current = new PixelationEngine(
          processedCanvasRef.current,
          setProgress
        );
        console.log('PixelationEngine 初始化完成');
      }
    };
    
    // 如果canvas已经存在，立即初始化
    if (processedCanvasRef.current) {
      initEngine();
    } else {
      // 否则延迟一点再尝试
      const timer = setTimeout(initEngine, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  /**
   * 处理文件上传
   */
  const handleFileUpload = useCallback((file: File) => {
    console.log('开始处理文件上传:', file.name, file.type, file.size);
    
    if (!file.type.startsWith('image/')) {
      console.error('文件类型错误:', file.type);
      setError('请选择有效的图像文件');
      return;
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB限制
      console.error('文件过大:', file.size);
      setError('文件大小不能超过20MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('文件读取完成');
      const img = new Image();
      img.onload = () => {
        console.log('图像加载完成:', img.width, 'x', img.height);
        handleImageLoad(img);
      };
      img.onerror = () => {
        console.error('图像加载失败');
        setError('图像加载失败');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      console.error('文件读取失败');
      setError('文件读取失败');
    };
    reader.readAsDataURL(file);
  }, []);

  /**
   * 处理图像加载
   */
  const handleImageLoad = useCallback((img: HTMLImageElement) => {
    console.log('开始处理图像加载:', img.width, 'x', img.height);
    setOriginalImage(img);
    setError(null);
    setProcessedImageData(null);
    history.clear();
    
    // 延迟执行，确保组件已完全挂载
    const processImageWithRetry = (retryCount = 0) => {
      console.log(`尝试处理图像，第 ${retryCount + 1} 次`);
      
      if (originalCanvasRef.current) {
        console.log('originalCanvasRef 存在，开始绘制原始图像');
        const canvas = originalCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          console.log('获取到canvas上下文，设置尺寸:', img.width, 'x', img.height);
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          console.log('原始图像绘制完成');
          
          // 自动进行默认像素化处理
          setTimeout(async () => {
            console.log('开始自动像素化处理');
            const defaultOptions: PixelationOptions = {
              pixelSize: 8,
              colorMode: 'original',
              edgeMode: 'hard'
            };
            
            // 内联像素化处理逻辑
            const initializeEngineAndProcess = (engineRetryCount = 0) => {
              // 先检查并初始化引擎
              if (!engineRef.current) {
                console.warn(`engineRef.current 为空，尝试初始化，第 ${engineRetryCount + 1} 次`);
                
                if (processedCanvasRef.current) {
                  console.log('初始化 PixelationEngine');
                  engineRef.current = new PixelationEngine(
                    processedCanvasRef.current,
                    setProgress
                  );
                  console.log('PixelationEngine 初始化完成');
                } else {
                  console.warn('processedCanvasRef.current 也为空，等待重试');
                  
                  if (engineRetryCount < 10) { // 增加重试次数
                    setTimeout(() => initializeEngineAndProcess(engineRetryCount + 1), 200); // 增加延迟
                    return;
                  } else {
                    console.error('无法初始化 PixelationEngine，processedCanvasRef 不可用');
                    setError('像素化引擎初始化失败，请检查页面是否正确加载');
                    return;
                  }
                }
              }
              
              // 现在引擎已经准备好，开始处理图像
              if (!engineRef.current) {
                console.error('引擎初始化后仍为空');
                setError('引擎初始化失败');
                return;
              }
              
              setIsProcessing(true);
              setError(null);
              
              (async () => {
                try {
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  console.log('获取图像数据成功，像素数据长度:', imageData.data.length);
                  
                  const processed = await engineRef.current!.pixelate(imageData, defaultOptions);
                  console.log('像素化处理完成，结果尺寸:', processed.width, 'x', processed.height);
                  setProcessedImageData(processed);
                  
                  // 绘制处理后的图像
                  if (processedCanvasRef.current) {
                    console.log('绘制处理后的图像到processedCanvas');
                    const processedCanvas = processedCanvasRef.current;
                    const processedCtx = processedCanvas.getContext('2d');
                    if (processedCtx) {
                      processedCanvas.width = processed.width;
                      processedCanvas.height = processed.height;
                      processedCtx.putImageData(processed, 0, 0);
                      console.log('处理后的图像绘制完成');
                    }
                  }
                  
                  // 保存到历史记录
                  history.pushState({ imageData: processed, options: defaultOptions });
                  console.log('历史记录已保存');
                  
                } catch (err) {
                  console.error('自动像素化失败:', err);
                  setError('初始化处理失败: ' + (err as Error).message);
                } finally {
                  setIsProcessing(false);
                  setProgress(null);
                }
              })();
            };
            
            // 开始初始化和处理
            initializeEngineAndProcess();
          }, 300); // 增加延迟确保canvas已经准备好
        } else {
          console.error('无法获取原始canvas的2D上下文');
        }
      } else {
        console.warn(`originalCanvasRef.current 为空，重试次数: ${retryCount}`);
        // 如果ref还没准备好，最多重试10次，每次间隔100ms
        if (retryCount < 10) {
          setTimeout(() => processImageWithRetry(retryCount + 1), 100);
        } else {
          console.error('originalCanvasRef 在多次重试后仍为空，可能存在组件挂载问题');
          setError('Canvas初始化失败，请刷新页面重试');
        }
      }
    };
    
    // 立即开始尝试，不延迟
    processImageWithRetry();
  }, []);

  /**
   * 处理图像像素化
   */
  const processImage = useCallback(async (options: PixelationOptions) => {
    console.log('processImage 被调用，参数:', options);
    
    if (!originalImage) {
      setError('请先上传图像');
      return;
    }
    
    if (!engineRef.current) {
      console.error('engineRef.current 为空');
      return;
    }
    if (!originalCanvasRef.current) {
      console.error('originalCanvasRef.current 为空');
      return;
    }

    console.log('开始图像处理...');
    setIsProcessing(true);
    setError(null);

    try {
      // 获取原始图像数据
      const canvas = originalCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('无法获取Canvas上下文');
      }

      console.log('获取图像数据，尺寸:', canvas.width, 'x', canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      console.log('图像数据获取成功，像素数据长度:', imageData.data.length);
      
      // 处理图像
      console.log('开始像素化处理...');
      const processed = await engineRef.current.pixelate(imageData, options);
      console.log('像素化处理完成，结果尺寸:', processed.width, 'x', processed.height);
      setProcessedImageData(processed);
      
      // 绘制处理后的图像
      if (processedCanvasRef.current) {
        console.log('绘制处理后的图像到processedCanvas');
        const processedCanvas = processedCanvasRef.current;
        const processedCtx = processedCanvas.getContext('2d');
        if (processedCtx) {
          processedCanvas.width = processed.width;
          processedCanvas.height = processed.height;
          processedCtx.putImageData(processed, 0, 0);
          console.log('处理后的图像绘制完成');
        } else {
          console.error('无法获取processedCanvas的2D上下文');
        }
      } else {
        console.error('processedCanvasRef.current 为空');
      }

      // 保存到历史记录
      history.pushState({
        imageData: processed,
        options
      });
      console.log('历史记录已保存');

    } catch (err) {
      console.error('图像处理失败:', err);
      setError('处理失败: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
      setProgress(null);
      console.log('图像处理流程结束');
    }
  }, [originalImage, history]);

  /**
   * 下载处理后的图像
   */
  const downloadImage = useCallback(async (options?: DownloadOptions) => {
    if (!processedCanvasRef.current || !processedImageData) {
      setError('没有可下载的图像');
      return;
    }

    try {
      const downloadOptions = options || 
        ImageDownloader.getRecommendedOptions(processedImageData);
      
      await ImageDownloader.downloadCanvas(
        processedCanvasRef.current, 
        downloadOptions
      );
    } catch (err) {
      setError('下载失败: ' + (err as Error).message);
    }
  }, [processedImageData]);

  /**
   * 撤销操作
   */
  const handleUndo = useCallback(() => {
    const state = history.undo();
    if (state && processedCanvasRef.current) {
      const canvas = processedCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = state.imageData.width;
        canvas.height = state.imageData.height;
        ctx.putImageData(state.imageData, 0, 0);
        setProcessedImageData(state.imageData);
      }
    }
  }, [history]);

  /**
   * 重做操作
   */
  const handleRedo = useCallback(() => {
    const state = history.redo();
    if (state && processedCanvasRef.current) {
      const canvas = processedCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = state.imageData.width;
        canvas.height = state.imageData.height;
        ctx.putImageData(state.imageData, 0, 0);
        setProcessedImageData(state.imageData);
      }
    }
  }, [history]);

  /**
   * 清空历史记录
   */
  const clearHistory = useCallback(() => {
    history.clear();
  }, [history]);

  /**
   * 重置处理器
   */
  const resetProcessor = useCallback(() => {
    setOriginalImage(null);
    setProcessedImageData(null);
    setIsProcessing(false);
    setError(null);
    setProgress(null);
    history.clear();
    
    // 清空canvas
    if (originalCanvasRef.current) {
      const ctx = originalCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, originalCanvasRef.current.width, originalCanvasRef.current.height);
      }
    }
    
    if (processedCanvasRef.current) {
      const ctx = processedCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, processedCanvasRef.current.width, processedCanvasRef.current.height);
      }
    }
    
    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [history]);

  return {
    // 状态
    originalImage,
    processedImageData,
    isProcessing,
    error,
    progress,
    
    // 历史状态
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    historyLength: history.historyLength,
    
    // 方法
    handleFileUpload,
    handleImageLoad,
    processImage,
    downloadImage,
    handleUndo,
    handleRedo,
    clearHistory,
    resetProcessor,
    
    // Refs
    originalCanvasRef,
    processedCanvasRef,
    fileInputRef
  };
}
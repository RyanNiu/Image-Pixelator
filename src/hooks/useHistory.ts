// 历史管理Hook - 支持撤销/重做功能

'use client';

import { useState, useCallback, useRef } from 'react';
import type { PixelationOptions } from '@/types/image';

export interface HistoryState {
  imageData: ImageData;
  options: PixelationOptions;
  timestamp: number;
  id: string;
}

export interface UseHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  currentIndex: number;
  historyLength: number;
  undo: () => HistoryState | null;
  redo: () => HistoryState | null;
  pushState: (state: Omit<HistoryState, 'id' | 'timestamp'>) => void;
  clear: () => void;
  getState: (index: number) => HistoryState | null;
  getCurrentState: () => HistoryState | null;
  getHistoryPreview: () => HistoryState[];
}

const MAX_HISTORY_SIZE = 20; // 限制历史记录数量，避免内存过度使用

/**
 * 历史管理Hook
 * 提供撤销/重做功能，自动管理内存使用
 */
export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const nextIdRef = useRef(0);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  /**
   * 生成唯一ID
   */
  const generateId = useCallback((): string => {
    return `state_${++nextIdRef.current}_${Date.now()}`;
  }, []);

  /**
   * 克隆ImageData以避免引用问题
   */
  const cloneImageData = useCallback((imageData: ImageData): ImageData => {
    const clonedData = new Uint8ClampedArray(imageData.data);
    return new ImageData(clonedData, imageData.width, imageData.height);
  }, []);

  /**
   * 推入新的历史状态
   */
  const pushState = useCallback((state: Omit<HistoryState, 'id' | 'timestamp'>) => {
    const newState: HistoryState = {
      ...state,
      imageData: cloneImageData(state.imageData),
      id: generateId(),
      timestamp: Date.now()
    };

    setHistory(prev => {
      // 如果不是在最新状态，删除当前位置后面的所有历史
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // 添加新状态
      newHistory.push(newState);
      
      // 限制历史记录数量，移除最旧的记录
      if (newHistory.length > MAX_HISTORY_SIZE) {
        const removeCount = newHistory.length - MAX_HISTORY_SIZE;
        newHistory.splice(0, removeCount);
        
        // 调整当前索引
        setCurrentIndex(Math.max(0, newHistory.length - 1));
        return newHistory;
      }
      
      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentIndex, cloneImageData, generateId]);

  /**
   * 撤销操作
   */
  const undo = useCallback((): HistoryState | null => {
    if (!canUndo) return null;
    
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    
    // 返回克隆的数据以避免引用问题
    const state = history[newIndex];
    return {
      ...state,
      imageData: cloneImageData(state.imageData)
    };
  }, [canUndo, currentIndex, history, cloneImageData]);

  /**
   * 重做操作
   */
  const redo = useCallback((): HistoryState | null => {
    if (!canRedo) return null;
    
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    
    // 返回克隆的数据以避免引用问题
    const state = history[newIndex];
    return {
      ...state,
      imageData: cloneImageData(state.imageData)
    };
  }, [canRedo, currentIndex, history, cloneImageData]);

  /**
   * 清空历史记录
   */
  const clear = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    nextIdRef.current = 0;
  }, []);

  /**
   * 获取指定索引的状态
   */
  const getState = useCallback((index: number): HistoryState | null => {
    if (index < 0 || index >= history.length) return null;
    
    const state = history[index];
    return {
      ...state,
      imageData: cloneImageData(state.imageData)
    };
  }, [history, cloneImageData]);

  /**
   * 获取当前状态
   */
  const getCurrentState = useCallback((): HistoryState | null => {
    return getState(currentIndex);
  }, [getState, currentIndex]);

  /**
   * 获取历史记录预览（用于UI显示）
   */
  const getHistoryPreview = useCallback((): HistoryState[] => {
    return history.map(state => ({
      ...state,
      // 不克隆ImageData，仅用于预览
      imageData: state.imageData
    }));
  }, [history]);

  return {
    canUndo,
    canRedo,
    currentIndex,
    historyLength: history.length,
    undo,
    redo,
    pushState,
    clear,
    getState,
    getCurrentState,
    getHistoryPreview
  };
}
// 预设相关类型定义

import type { PixelationOptions } from './image';

export interface PixelationPreset {
  id: string;
  name: string;
  nameKey: string; // 用于国际化的键名
  pixelSize: number;
  colorMode: PixelationOptions['colorMode'];
  edgeMode: PixelationOptions['edgeMode'];
  description?: string;
  descriptionKey?: string; // 用于国际化的描述键名
}

export interface PresetCategory {
  id: string;
  name: string;
  nameKey: string;
  presets: PixelationPreset[];
}

export type PresetId = 'game' | 'arcade' | 'avatar' | 'minecraft' | 'mosaic' | 'vintage';
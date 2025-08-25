// 像素化预设系统

import type { PixelationPreset, PresetId } from '@/types/presets';
import type { PixelationOptions } from '@/types/image';

/**
 * 预定义的像素化预设配置
 */
export const PIXELATION_PRESETS: PixelationPreset[] = [
  {
    id: 'game',
    name: '8-bit Game',
    nameKey: 'preset-game',
    pixelSize: 12,
    colorMode: 'retro',
    edgeMode: 'hard',
    description: 'Perfect for creating game sprites and retro artwork',
    descriptionKey: 'preset-game-desc'
  },
  {
    id: 'arcade',
    name: 'Arcade',
    nameKey: 'preset-arcade',
    pixelSize: 8,
    colorMode: 'retro',
    edgeMode: 'hard',
    description: 'Classic arcade game style with small pixels',
    descriptionKey: 'preset-arcade-desc'
  },
  {
    id: 'avatar',
    name: 'Avatar',
    nameKey: 'preset-avatar',
    pixelSize: 6,
    colorMode: 'original',
    edgeMode: 'soft',
    description: 'Great for profile pictures and portraits',
    descriptionKey: 'preset-avatar-desc'
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    nameKey: 'preset-minecraft',
    pixelSize: 16,
    colorMode: 'retro',
    edgeMode: 'hard',
    description: 'Block-style textures perfect for Minecraft',
    descriptionKey: 'preset-minecraft-desc'
  },
  {
    id: 'mosaic',
    name: 'Mosaic',
    nameKey: 'preset-mosaic',
    pixelSize: 4,
    colorMode: 'original',
    edgeMode: 'soft',
    description: 'Beautiful mosaic-style artwork with soft edges',
    descriptionKey: 'preset-mosaic-desc'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    nameKey: 'preset-vintage',
    pixelSize: 10,
    colorMode: 'sepia',
    edgeMode: 'soft',
    description: 'Retro photo effect with sepia tones',
    descriptionKey: 'preset-vintage-desc'
  }
];

/**
 * 根据ID获取预设配置
 */
export function getPresetById(id: PresetId): PixelationPreset | undefined {
  return PIXELATION_PRESETS.find(preset => preset.id === id);
}

/**
 * 将预设转换为像素化选项
 */
export function applyPreset(preset: PixelationPreset): PixelationOptions {
  return {
    pixelSize: preset.pixelSize,
    colorMode: preset.colorMode,
    edgeMode: preset.edgeMode
  };
}

/**
 * 根据预设ID获取像素化选项
 */
export function getPresetOptions(presetId: PresetId): PixelationOptions | null {
  const preset = getPresetById(presetId);
  return preset ? applyPreset(preset) : null;
}

/**
 * 获取所有可用的预设
 */
export function getAllPresets(): PixelationPreset[] {
  return [...PIXELATION_PRESETS];
}

/**
   * 根据用途分类获取预设
   */
export function getPresetsByCategory(): { [key: string]: PixelationPreset[] } {
  return {
    gaming: PIXELATION_PRESETS.filter(p => ['game', 'arcade', 'minecraft'].includes(p.id)),
    artistic: PIXELATION_PRESETS.filter(p => ['avatar', 'mosaic', 'vintage'].includes(p.id))
  };
}

/**
 * 检查是否为有效的预设ID
 */
export function isValidPresetId(id: string): id is PresetId {
  return PIXELATION_PRESETS.some(preset => preset.id === id);
}

/**
 * 创建自定义预设
 */
export function createCustomPreset(
  id: string,
  name: string,
  options: PixelationOptions,
  description?: string
): PixelationPreset {
  return {
    id,
    name,
    nameKey: `custom-${id}`,
    pixelSize: options.pixelSize,
    colorMode: options.colorMode,
    edgeMode: options.edgeMode,
    description,
    descriptionKey: description ? `custom-${id}-desc` : undefined
  };
}

/**
 * 比较两个预设是否相同
 */
export function presetsEqual(a: PixelationPreset, b: PixelationPreset): boolean {
  return (
    a.pixelSize === b.pixelSize &&
    a.colorMode === b.colorMode &&
    a.edgeMode === b.edgeMode
  );
}

/**
 * 根据当前选项找到匹配的预设
 */
export function findMatchingPreset(options: PixelationOptions): PixelationPreset | null {
  return PIXELATION_PRESETS.find(preset => 
    preset.pixelSize === options.pixelSize &&
    preset.colorMode === options.colorMode &&
    preset.edgeMode === options.edgeMode
  ) || null;
}
// 国际化翻译统一入口文件
import type { Translation, SupportedLanguage, TranslationRecord } from './types'

// 导入所有语言翻译
import { en } from './locales/en'
import { zh } from './locales/zh' 
import { es } from './locales/es'
import { fr } from './locales/fr'
import { ru } from './locales/ru'
import { hi } from './locales/hi'
import { ko } from './locales/ko'

// 支持的语言列表
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'zh', 'es', 'fr', 'ru', 'hi', 'ko']

// 默认语言
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

// 翻译数据集合
export const translations: TranslationRecord = {
  en,
  zh,
  es,
  fr,
  ru,
  hi,
  ko
}

/**
 * 获取指定语言的翻译数据
 * @param lang 语言代码
 * @returns 翻译数据对象
 */
export function getTranslation(lang: string): Translation {
  if (lang in translations) {
    return translations[lang as SupportedLanguage]
  }
  console.warn(`Translation for language "${lang}" not found, falling back to default language "${DEFAULT_LANGUAGE}"`)
  return translations[DEFAULT_LANGUAGE]
}

/**
 * 检查是否支持指定语言
 * @param lang 语言代码
 * @returns 是否支持
 */
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
}

/**
 * 获取语言的显示名称
 * @param lang 语言代码
 * @returns 语言显示名称
 */
export function getLanguageDisplayName(lang: SupportedLanguage): string {
  const displayNames: Record<SupportedLanguage, string> = {
    en: '🇺🇸 English',
    zh: '🇨🇳 中文',
    es: '🇪🇸 Español',
    fr: '🇫🇷 Français',
    ru: '🇷🇺 Русский',
    hi: '🇮🇳 हिन्दी',
    ko: '🇰🇷 한국어'
  }
  return displayNames[lang] || displayNames[DEFAULT_LANGUAGE]
}

// 导出类型
export type { Translation, SupportedLanguage, TranslationRecord }
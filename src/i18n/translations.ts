// 重导出新的模块化国际化结构
// 重导出新的模块化国际化结构
// 为了保持向后兼容性，重导出主要接口

export {
  translations,
  getTranslation,
  isSupportedLanguage,
  getLanguageDisplayName,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE
} from './index'

export type {
  Translation,
  SupportedLanguage,
  TranslationRecord
} from './types'

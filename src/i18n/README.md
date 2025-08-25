# 国际化 (i18n) 文件结构

本项目已重构为模块化的国际化文件结构，每个语言拆分为独立文件，便于维护和扩展。

## 文件结构

```
src/i18n/
├── types.ts              # TypeScript 类型定义
├── index.ts              # 统一入口文件
├── translations.ts       # 兼容性重导出文件 
└── locales/             # 各语言翻译文件
    ├── en.ts            # 英语翻译
    ├── zh.ts            # 中文翻译
    ├── es.ts            # 西班牙语翻译
    ├── fr.ts            # 法语翻译
    ├── ru.ts            # 俄语翻译
    ├── hi.ts            # 印地语翻译（部分完成）
    └── ko.ts            # 韩语翻译（部分完成）
```

## 使用方法

### 1. 基本导入（推荐）

```typescript
import { translations, getTranslation, SUPPORTED_LANGUAGES } from '@/i18n'

// 获取特定语言翻译
const t = getTranslation('zh')
console.log(t.Home.title) // "图像像素化工具"

// 检查语言支持
import { isSupportedLanguage } from '@/i18n'
if (isSupportedLanguage('en')) {
  // 支持的语言
}
```

### 2. 兼容旧方式（向后兼容）

```typescript
import { translations } from '@/i18n/translations'

// 直接访问翻译对象
const t = translations['zh']?.Home || translations.en.Home
```

### 3. 在组件中使用

```typescript
import { getTranslation } from '@/i18n'

function MyComponent({ lang }: { lang: string }) {
  const t = getTranslation(lang)
  
  return (
    <div>
      <h1>{t.Home.title}</h1>
      <p>{t.Home.description}</p>
    </div>
  )
}
```

### 4. 获取语言显示名称

```typescript
import { getLanguageDisplayName, SUPPORTED_LANGUAGES } from '@/i18n'

// 获取语言选择器选项
const languageOptions = SUPPORTED_LANGUAGES.map(lang => ({
  value: lang,
  label: getLanguageDisplayName(lang)
}))
// 结果: [
//   { value: 'en', label: '🇺🇸 English' },
//   { value: 'zh', label: '🇨🇳 中文' },
//   ...
// ]
```

## 添加新语言

### 1. 创建新的语言文件

在 `locales/` 目录下创建新文件，例如 `ja.ts`：

```typescript
import type { Translation } from '../types'

export const ja: Translation = {
  Home: {
    title: 'Image Pixelator',
    description: '写真を美しいピクセルアートに変換',
    // ... 其他翻译
  }
}
```

### 2. 更新类型和入口文件

在 `types.ts` 中添加新语言：

```typescript
export type SupportedLanguage = 'en' | 'zh' | 'es' | 'fr' | 'ru' | 'hi' | 'ko' | 'ja'
```

在 `index.ts` 中导入并添加：

```typescript
import { ja } from './locales/ja'

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'zh', 'es', 'fr', 'ru', 'hi', 'ko', 'ja']

export const translations: TranslationRecord = {
  en, zh, es, fr, ru, hi, ko, ja
}
```

在 `index.ts` 的 `getLanguageDisplayName` 函数中添加显示名称：

```typescript
export function getLanguageDisplayName(lang: SupportedLanguage): string {
  const displayNames: Record<SupportedLanguage, string> = {
    en: '🇺🇸 English',
    zh: '🇨🇳 中文',
    es: '🇪🇸 Español',
    fr: '🇫🇷 Français',
    ru: '🇷🇺 Русский',
    hi: '🇮🇳 हिन्दी',
    ko: '🇰🇷 한국어',
    ja: '🇯🇵 日本語'  // 新增
  }
  return displayNames[lang] || displayNames[DEFAULT_LANGUAGE]
}
```

## 类型安全

所有翻译文件都必须符合 `Translation` 接口的定义，确保：

1. **完整性**：所有必需的字段都必须提供
2. **一致性**：所有语言文件具有相同的结构
3. **类型安全**：TypeScript 会检查拼写错误和缺失字段

## 最佳实践

1. **翻译键命名**：使用 kebab-case，如 `'nav-examples'`
2. **翻译内容**：保持简洁明确，避免过长的句子
3. **占位符语言**：对于未完成的翻译，可以使用英语作为后备
4. **文件组织**：将相关的翻译键分组，添加注释说明

## 注意事项

- 修改 `Translation` 接口后，所有语言文件都需要相应更新
- 建议使用专业翻译服务来完善非英语翻译
- 保持 `translations.ts` 文件作为兼容性入口，避免破坏现有代码
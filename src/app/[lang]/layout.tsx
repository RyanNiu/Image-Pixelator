import { notFound } from 'next/navigation'
import { translations } from '@/i18n/translations'
import LanguageProvider from '@/components/LanguageProvider'
import type { Metadata } from 'next'

const locales = Object.keys(translations)

// SEO配置
const getSEOConfig = (lang: string) => {
  const t = translations[lang as keyof typeof translations] || translations.en
  
  return {
    title: 'Image Pixelator - #1 100% Free Online Pixel Art Tool | Multi-language',
    description: 'Convert images to pixel art instantly in your browser! No upload required, pure frontend processing, free and privacy-friendly',
    keywords: 'Image Pixelator, Pixel Art Generator Online, Convert Image to Pixel Art Free, 像素化工具, 像素艺术生成器',
    author: 'Image Pixelator Team',
    robots: 'index, follow',
    canonical: `https://imagepixelator.pics/${lang}`
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { lang: string } 
}): Promise<Metadata> {
  const seo = getSEOConfig(params.lang)
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: seo.author }],
    robots: seo.robots,
    alternates: {
      canonical: seo.canonical,
      languages: {
        'en': 'https://imagepixelator.pics/en',
        'zh': 'https://imagepixelator.pics/zh',
        'es': 'https://imagepixelator.pics/es',
        'fr': 'https://imagepixelator.pics/fr',
        'ru': 'https://imagepixelator.pics/ru',
        'hi': 'https://imagepixelator.pics/hi',
        'ko': 'https://imagepixelator.pics/ko'
      }
    },
    openGraph: {
      type: 'website',
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      siteName: 'Image Pixelator',
      locale: params.lang,
      alternateLocale: ['en', 'zh', 'es', 'fr', 'ru', 'hi', 'ko'].filter(l => l !== params.lang),
      images: [
        {
          url: 'https://imagepixelator.pics/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Image Pixelator - Convert Images to Pixel Art'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: ['https://imagepixelator.pics/og-image.png']
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/LOGO.png'
    },
    manifest: '/manifest.json',
    verification: {
      google: 'google-site-verification-code' // 需要实际的验证码
    },
    other: {
      'msapplication-TileColor': '#2563eb',
      'theme-color': '#2563eb'
    }
  }
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  if (!locales.includes(params.lang)) {
    notFound()
  }

  return (
    <LanguageProvider lang={params.lang}>
      <div data-lang={params.lang}>
        {children}
      </div>
    </LanguageProvider>
  )
}

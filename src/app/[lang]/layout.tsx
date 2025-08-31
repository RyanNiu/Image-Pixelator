import { notFound } from 'next/navigation'
import { translations } from '@/i18n/translations'
import LanguageProvider from '@/components/LanguageProvider'
import type { Metadata } from 'next'

const locales = Object.keys(translations)

// SEO配置
const getSEOConfig = (lang: string) => {
  const t = translations[lang as keyof typeof translations] || translations.en
  
  return {
    title: 'Image Pixelator - #1 FREE Online Pixel Art Tool | No Login Required | 100% Private',
    description: '🎯 100% FREE pixel art converter! ✨ No registration, no login required. Convert images to pixel art instantly in your browser. Private, secure, and completely free forever!',
    keywords: 'Free Image Pixelator, No Login Pixel Art, 100% Free Pixel Art Generator, Convert Image to Pixel Art Free, No Registration Required, Private Pixel Art Tool, Browser Pixel Art, 像素化工具, 免费像素艺术生成器, 无需注册',
    author: 'Image Pixelator Team',
    robots: 'index, follow',
    canonical: `https://imagepixelator.pics/${lang}`
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params
  const seo = getSEOConfig(lang)
  
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
      title: '🎯 Image Pixelator - FREE Pixel Art Tool | No Login Required',
      description: '✨ Convert images to pixel art instantly! 100% FREE forever, no registration needed. All processing in your browser - completely private and secure!',
      url: seo.canonical,
      siteName: 'Image Pixelator - Free Pixel Art Tool',
      locale: lang,
      alternateLocale: ['en', 'zh', 'es', 'fr', 'ru', 'hi', 'ko'].filter(l => l !== lang),
      images: [
        {
          url: 'https://imagepixelator.pics/og-image.png',
          width: 1200,
          height: 630,
          alt: '🎯 Image Pixelator - FREE Online Pixel Art Tool | No Login Required | 100% Private'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: '🎯 FREE Pixel Art Tool | No Login Required | Image Pixelator',
      description: '✨ Convert images to pixel art instantly! 100% FREE, no registration, completely private. All processing in your browser!',
      images: ['https://imagepixelator.pics/og-image.png'],
      site: '@ImagePixelator',
      creator: '@ImagePixelator'
    },
    icons: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon'
      },
      {
        url: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        url: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        rel: 'apple-touch-icon'
      }
    ],
    manifest: '/manifest.json',
    verification: {
      google: 'google-site-verification-code' // 需要实际的验证码
    },
    other: {
      'msapplication-TileColor': '#2563eb',
      'theme-color': '#2563eb',
      'msapplication-TileImage': '/icon-192.png',
      'application-name': 'Image Pixelator - Free Pixel Art Tool',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Image Pixelator'
    }
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!locales.includes(lang)) {
    notFound()
  }

  return (
    <LanguageProvider lang={lang}>
      <div data-lang={lang}>
        {children}
      </div>
    </LanguageProvider>
  )
}

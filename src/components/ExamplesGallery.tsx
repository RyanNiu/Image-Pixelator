'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Example {
  id: string
  title: string
  description: string
  image: string
  webp: string
  settings: string
  titleKey?: string
  descriptionKey?: string
}

interface ExamplesGalleryProps {
  title: string
  subtitle: string
  examples: Example[]
  lang: string
  viewAllText: string
  settingsText: string
}

export default function ExamplesGallery({ 
  title, 
  subtitle, 
  examples, 
  lang, 
  viewAllText,
  settingsText 
}: ExamplesGalleryProps) {
  return (
    <section id="examples" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example) => (
            <div 
              key={example.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-50 flex items-center justify-center bg-gray-100">
                <picture>
                  <source srcSet={`/asset/example/${example.webp}`} type="image/webp" />
                  <Image
                    src={`/asset/example/${example.image}`}
                    alt={example.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </picture>
              </div>
              <div className="p-6">
                <h3 className="text-gray-600 font-semibold mb-2">{example.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{example.description}</p>
                <div className="text-xs text-gray-500">
                  <span>{settingsText}:</span> {example.settings}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${lang}/examples`}
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors border"
          >
            {viewAllText} →
          </Link>
        </div>
      </div>
    </section>
  )
}

// 导出默认示例数据
export const DEFAULT_EXAMPLES: Example[] = [
  {
    id: 'retro-gaming',
    title: 'Retro Gaming',
    description: 'Perfect for creating game sprites and retro artwork',
    image: '8-bitGameStyle.png',
    webp: '8-bitGameStyle.webp',
    settings: '12px • Retro 8-bit • Hard edges',
    titleKey: 'example-1-title',
    descriptionKey: 'example-1-desc'
  },
  {
    id: 'block-art',
    title: 'Block Art', 
    description: 'Create textures that fit perfectly in Minecraft',
    image: 'MinecraftStyle.png',
    webp: 'MinecraftStyle.webp',
    settings: '16px • Retro 8-bit • Hard edges',
    titleKey: 'example-2-title',
    descriptionKey: 'example-2-desc'
  },
  {
    id: 'artistic-effect',
    title: 'Artistic Effect',
    description: 'Beautiful mosaic-style artwork with soft edges',
    image: 'MosaicArt.png', 
    webp: 'MosaicArt.webp',
    settings: '6px • Original • Soft edges',
    titleKey: 'example-3-title',
    descriptionKey: 'example-3-desc'
  }
]
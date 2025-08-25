'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { translations } from '@/i18n/translations'

interface ExamplesPageProps {
  lang: string
}

export default function ExamplesPage({ lang }: ExamplesPageProps) {
  const t = translations[lang as keyof typeof translations]?.Home || translations.en.Home

  // 示例数据
  const examples = [
    {
      id: 'game-style',
      titleKey: 'example-1-title',
      title: '8-bit Game Style',
      descriptionKey: 'example-1-description', 
      description: 'Classic retro gaming aesthetic with bold colors and sharp pixel edges. Perfect for game sprites and nostalgic artwork.',
      image: '8-bitGameStyle.png',
      webp: '8-bitGameStyle.webp',
      settings: {
        pixelSize: 12,
        colorMode: 'retro' as const,
        edgeMode: 'hard' as const
      },
      tags: [
        { key: 'pixel-size', value: 'Pixel Size: 12px' },
        { key: 'color-retro', value: 'Retro Color Mode' },
        { key: 'edge-hard', value: 'Hard Edges' }
      ]
    },
    {
      id: 'minecraft-style',
      titleKey: 'example-2-title',
      title: 'Minecraft Style',
      descriptionKey: 'example-2-description',
      description: 'Blocky aesthetic reminiscent of the popular sandbox game. Great for character designs and landscape art.',
      image: 'MinecraftStyle.png',
      webp: 'MinecraftStyle.webp',
      settings: {
        pixelSize: 16,
        colorMode: 'retro' as const,
        edgeMode: 'hard' as const
      },
      tags: [
        { key: 'pixel-size-16', value: 'Pixel Size: 16px' },
        { key: 'color-retro', value: 'Retro Color Mode' },
        { key: 'edge-hard', value: 'Hard Edges' }
      ]
    },
    {
      id: 'mosaic-art',
      titleKey: 'example-3-title',
      title: 'Mosaic Art',
      descriptionKey: 'example-3-description',
      description: 'Fine pixelation creating a mosaic effect. Ideal for artistic interpretations and abstract compositions.',
      image: 'MosaicArt.png',
      webp: 'MosaicArt.webp',
      settings: {
        pixelSize: 6,
        colorMode: 'original' as const,
        edgeMode: 'soft' as const
      },
      tags: [
        { key: 'pixel-size-6', value: 'Pixel Size: 6px' },
        { key: 'color-original', value: 'Original Colors' },
        { key: 'edge-soft', value: 'Soft Edges' }
      ]
    },
    {
      id: 'vintage-photo',
      titleKey: 'example-4-title', 
      title: 'Vintage Photo Effect',
      descriptionKey: 'example-4-description',
      description: 'Sepia-toned pixelation for a nostalgic feel. Perfect for creating retro-style portraits and vintage compositions.',
      image: 'VintagePhotoEffect.png',
      webp: 'VintagePhotoEffect.webp',
      settings: {
        pixelSize: 10,
        colorMode: 'sepia' as const,
        edgeMode: 'hard' as const
      },
      tags: [
        { key: 'pixel-size-10', value: 'Pixel Size: 10px' },
        { key: 'color-sepia', value: 'Sepia Tone' },
        { key: 'edge-hard', value: 'Hard Edges' }
      ]
    }
  ]

  const handleTryStyle = (image: string) => {
    // 回到主页并加载示例图片
    window.location.href = `/${lang}?image=${image}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              {t.title} - {t['nav-examples'] || 'Examples'}
            </h1>
            <div className="flex items-center space-x-4">
              <Link 
                href={`/${lang}`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← {t['back-to-tool'] || 'Back to Tool'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t['examples-title-main'] || 'Pixelation Examples'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t['examples-description'] || 'See how different settings create unique pixel art effects. All examples processed with our tool.'}
          </p>
        </div>

        {/* Examples */}
        {examples.map((example, index) => (
          <section key={example.id} className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`}>
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <h3 className="text-2xl font-semibold mb-4">
                  {(t[example.titleKey as keyof typeof t] as string) || example.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {(t[example.descriptionKey as keyof typeof t] as string) || example.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {example.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className={`px-3 py-1 rounded-full text-sm ${
                        tagIndex === 0 ? 'bg-blue-100 text-blue-800' :
                        tagIndex === 1 ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {(t[tag.key as keyof typeof t] as string) || tag.value}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleTryStyle(example.image)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t['try-this-style'] || 'Try This Style'}
                </button>
              </div>

              {/* Images */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
                index % 2 === 1 ? 'lg:order-1' : ''
              }`}>
                <div>
                  <p className="text-sm text-gray-500 mb-2 text-center">
                    {t.original || 'Original'}
                  </p>
                  <Image
                    src={`/asset/example/${example.image}`}
                    alt={`${example.title} Original`}
                    width={288}
                    height={288}
                    className="w-72 h-72 object-cover rounded"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2 text-center">
                    {t['pixelated-result'] || 'Pixelated Result'}
                  </p>
                  <Image
                    src={`/asset/example/${example.webp}`}
                    alt={`${example.title} Result`}
                    width={288}
                    height={288}
                    className="w-72 h-72 object-cover rounded"
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Call to Action */}
        <section className="bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-blue-900 mb-4">
            {t['cta-title'] || 'Ready to Create Your Own?'}
          </h3>
          <p className="text-blue-700 mb-6">
            {t['cta-description'] || 'Try our free image pixelator tool and create amazing pixel art from your photos!'}
          </p>
          <Link
            href={`/${lang}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t['start-pixelating'] || 'Start Pixelating'} →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 {t.title}. {t['footer-text'] || 'Free online pixel art tool.'}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
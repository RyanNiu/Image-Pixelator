'use client'

import { useState, useRef } from 'react'
import React from 'react'
import Image from 'next/image'
import { translations } from '@/i18n/translations'
import { useImageProcessor } from '@/hooks/useImageProcessor'
import { getAllPresets, getPresetOptions } from '@/lib/presets'
import type { PixelationPreset } from '@/types/presets'
import { ImageDownloader, type DownloadFormat } from '@/lib/downloadUtils'
import type { PixelationOptions } from '@/types/image'

// 导入新组件
import Navigation from '@/components/Navigation'
import HowItWorks, { DEFAULT_STEPS } from '@/components/HowItWorks'
import FeaturesList, { DEFAULT_FEATURES } from '@/components/FeaturesList'
import ExamplesGallery, { DEFAULT_EXAMPLES } from '@/components/ExamplesGallery'
import FAQ, { DEFAULT_FAQS } from '@/components/FAQ'
import PrivacyPolicy from '@/components/PrivacyPolicy'
import Footer, { DEFAULT_FOOTER_SECTIONS } from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import FaultyTerminal from '@/components/FaultyTerminal'
import PixelTrail from '@/components/PixelTrail'
import FormatSelector from '@/components/FormatSelector'

interface HomePageProps {
  lang: string
}

export default function HomePage({ lang }: HomePageProps) {
  const t = translations[lang as keyof typeof translations]?.Home || translations.en.Home
  
  // 使用新的图像处理Hook
  const imageProcessor = useImageProcessor()
  
  // 界面状态
  const [pixelSize, setPixelSize] = useState(8)
  const [colorMode, setColorMode] = useState<PixelationOptions['colorMode']>('original')
  const [edgeMode, setEdgeMode] = useState<PixelationOptions['edgeMode']>('hard')
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('png')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  
  // 获取所有预设
  const presets = getAllPresets()
  
  // 导航菜单配置
  const navItems = [
    { href: '#how-to-use', label: t['nav-how-to'], key: 'how-to-use' },
    { href: `/${lang}/examples`, label: t['nav-examples'], key: 'examples' },
    { href: '#privacy', label: t['nav-privacy'], key: 'privacy' }
  ]

  // 文件选择处理
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      imageProcessor.handleFileUpload(file)
    }
  }

  // 拖拽处理
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      imageProcessor.handleFileUpload(files[0])
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  // 应用预设
  const handlePresetSelect = (preset: PixelationPreset) => {
    setPixelSize(preset.pixelSize)
    setColorMode(preset.colorMode)
    setEdgeMode(preset.edgeMode)
    setSelectedPreset(preset.id)
    
    // 如果有图像，立即应用预设
    if (imageProcessor.originalImage) {
      const options = getPresetOptions(preset.id as any)
      if (options) {
        imageProcessor.processImage(options)
      }
    }
  }

  // 组件卸载时清理定时器
  React.useEffect(() => {
    return () => {
      if ((window as any).pixelSizeTimeout) {
        clearTimeout((window as any).pixelSizeTimeout)
      }
    }
  }, [])

  // 从 URL 参数加载图片
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const imageParam = urlParams.get('image')
      if (imageParam) {
        // 清除 URL 参数
        window.history.replaceState({}, '', window.location.pathname)
        // 加载示例图片
        handleExampleClick(imageParam)
      }
    }
  }, [])

  // 下载图像
  const handleDownload = () => {
    imageProcessor.downloadImage({
      format: downloadFormat,
      quality: downloadFormat === 'png' ? undefined : 0.9
    })
  }

  // 示例图片点击处理
  const handleExampleClick = (imageSrc: string) => {
    console.log('点击示例图片:', imageSrc)
    if (typeof window !== 'undefined') {
      const img = new window.Image()
      img.onload = () => {
        console.log('示例图片加载成功:', img.width, 'x', img.height)
        imageProcessor.handleImageLoad(img)
      }
      img.onerror = (error) => {
        console.error('示例图片加载失败:', error)
        console.error('图片路径:', img.src)
      }
      img.src = `/asset/example/${imageSrc}`
      console.log('开始加载图片:', img.src)
    }
  }

  return (
    <>
      {/* 结构化数据 */}
      <StructuredData lang={lang} />
      
      {/* 全屏终端背景 */}
      <div className="fixed inset-0 z-0">
        <FaultyTerminal
          scale={2.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={1}
          pause={false}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0.5}
          curvature={0}
          tint="#547850"
          mouseReact={true}
          mouseStrength={1.5}
          pageLoadAnimation={true}
          brightness={0.8}
        />
      </div>
      
      {/* 粒子轨迹效果 */}
      <div 
        className="fixed inset-0" 
        style={{ 
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      >
        <PixelTrail
          gridSize={60}
          trailSize={0.1}
          maxAge={300}
          interpolate={4}
          color="rgba(37, 187, 0, 0.27)"
          gooeyFilter={{ id: "custom-goo-filter", strength: 0.1 }}
        />
      </div>
      
      {/* 半透明遮罩 */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-20"></div>
      
      <div className="relative z-30 min-h-screen">
        {/* 新的导航组件 */}
        <Navigation 
          title={t.title}
          navItems={navItems}
          currentLang={lang}
        />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-6">{t.description}</p>
          
          {/* Privacy Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <div className="inline-flex items-center bg-green-600 bg-opacity-80 text-green-100 px-4 py-2 rounded-full text-sm font-medium">
              <span>🔒 {t.privacyBadge}</span>
            </div>
            <div className="inline-flex items-center bg-blue-600 bg-opacity-80 text-blue-100 px-4 py-2 rounded-full text-sm font-medium">
              <span>🎯 {t.freeBadge}</span>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="bg-white bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8">
          {/* Example Images */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              {t['nav-examples'] || '示例图片'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {t.exampleImages.map((example, index) => (
                <div 
                  key={index} 
                  className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 hover:shadow-md transition-all duration-200 group relative"
                  onClick={() => handleExampleClick(example.src)}
                  title={`${example.alt}`}
                >
                  <Image
                    src={`/asset/example/${example.src}`}
                    alt={example.alt}
                    width={128}
                    height={128}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                    {/* <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
                      点击加载
                    </span> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Preview Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Image */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">{t.originalImage}</h3>
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 aspect-square hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center relative"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => imageProcessor.fileInputRef.current?.click()}
              >
                {/* Canvas 始终渲染，但在没有图像时隐藏 */}
                <canvas
                  ref={imageProcessor.originalCanvasRef}
                  className={`max-w-full max-h-full object-contain ${
                    imageProcessor.originalImage ? 'block' : 'hidden'
                  }`}
                />
                {/* 占位符只在没有图像时显示 */}
                {!imageProcessor.originalImage && (
                  <div className="text-center text-gray-400">
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-2xl">📁</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">{t.uploadPrompt}</p>
                    <p className="text-xs text-gray-500">{t.uploadLimits}</p>
                  </div>
                )}
                <input
                  ref={imageProcessor.fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            {/* Pixelated Result */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">{t.pixelatedImage}</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 aspect-square flex items-center justify-center relative">
                {/* Canvas 始终渲染，但在没有处理结果时隐藏 */}
                <canvas
                  ref={imageProcessor.processedCanvasRef}
                  className={`max-w-full max-h-full object-contain ${
                    imageProcessor.processedImageData ? 'block' : 'hidden'
                  }`}
                />
                {/* 占位符只在没有处理结果时显示 */}
                {!imageProcessor.processedImageData && (
                  <div className="text-center text-gray-400">
                    <span className="text-2xl">🎨</span>
                    <p className="text-sm mt-2">{t.pixelatedPreview}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 bg-gray-50 rounded-lg p-6 text-gray-700">
            {/* Pixel Size */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.pixelSize}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={pixelSize}
                  onChange={(e) => {
                    const newPixelSize = Number(e.target.value)
                    setPixelSize(newPixelSize)
                    setSelectedPreset(null)
                    // 使用防抖处理来提高性能
                    clearTimeout((window as any).pixelSizeTimeout)
                    ;(window as any).pixelSizeTimeout = setTimeout(() => {
                      if (imageProcessor.originalImage && !imageProcessor.isProcessing) {
                        const options: PixelationOptions = {
                          pixelSize: newPixelSize,
                          colorMode,
                          edgeMode
                        }
                        imageProcessor.processImage(options)
                      }
                    }, 100) // 100ms 防抖
                  }}
                  className="flex-1"
                />
                <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                  {pixelSize}px
                </span>
              </div>
            </div>

            {/* Color Mode & Edge Processing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.colorMode}
                </label>
                <select
                  value={colorMode}
                  onChange={(e) => {
                    const newColorMode = e.target.value as PixelationOptions['colorMode']
                    setColorMode(newColorMode)
                    setSelectedPreset(null)
                    // 直接处理，不依赖状态更新
                    if (imageProcessor.originalImage && !imageProcessor.isProcessing) {
                      const options: PixelationOptions = {
                        pixelSize,
                        colorMode: newColorMode,
                        edgeMode
                      }
                      imageProcessor.processImage(options)
                    }
                  }}
                  className="w-full border rounded px-3 py-2 bg-white"
                >
                  <option value="original">{t.colorOriginal}</option>
                  <option value="retro">{t.colorRetro}</option>
                  <option value="grayscale">{t.colorGrayscale}</option>
                  <option value="sepia">{t.colorSepia}</option>
                  <option value="vibrant">{t.colorVibrant}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.edgeProcessing}
                </label>
                <select
                  value={edgeMode}
                  onChange={(e) => {
                    const newEdgeMode = e.target.value as PixelationOptions['edgeMode']
                    setEdgeMode(newEdgeMode)
                    setSelectedPreset(null)
                    // 直接处理，不依赖状态更新
                    if (imageProcessor.originalImage && !imageProcessor.isProcessing) {
                      const options: PixelationOptions = {
                        pixelSize,
                        colorMode,
                        edgeMode: newEdgeMode
                      }
                      imageProcessor.processImage(options)
                    }
                  }}
                  className="w-full border rounded px-3 py-2 bg-white"
                >
                  <option value="hard">{t.edgeHard}</option>
                  <option value="soft">{t.edgeSoft}</option>
                </select>
              </div>
            </div>

            {/* 预设 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.presets}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`px-2 py-1 text-xs border rounded hover:bg-white transition-colors ${
                      selectedPreset === preset.id ? 'bg-blue-100 border-blue-500' : ''
                    }`}
                    data-i18n={preset.nameKey}
                  >
                    {(t[preset.nameKey as keyof typeof t] as string) || preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 历史操作和下载 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.history || '历史操作'}
                </label>
                <div className="flex space-x-1">
                  <button
                    onClick={imageProcessor.handleUndo}
                    disabled={!imageProcessor.canUndo}
                    className="flex-1 px-2 py-1 text-xs border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← {t.undo || '撤销'}
                  </button>
                  <button
                    onClick={imageProcessor.handleRedo}
                    disabled={!imageProcessor.canRedo}
                    className="flex-1 px-2 py-1 text-xs border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    → {t.redo || '重做'}
                  </button>
                </div>
              </div>
              <FormatSelector
                value={downloadFormat}
                onChange={setDownloadFormat}
                className="w-full border rounded px-2 py-1 text-xs bg-white"
                label={t.downloadFormat || '下载格式'}
              />
            </div>

            <button
              onClick={handleDownload}
              disabled={!imageProcessor.processedImageData || imageProcessor.isProcessing}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {imageProcessor.isProcessing ? (
                <span>🔄 {t.processing || '处理中...'}</span>
              ) : (
                <span>{t.downloadBtn}</span>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {imageProcessor.originalImage ? 
                `${t.ready || '准备就绪'} • ${imageProcessor.historyLength} ${t.states || '步记录'}` : 
                t.uploadFirstHint
              }
            </p>
            
            {/* 处理进度 */}
            {imageProcessor.progress && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{(t[`progress-${imageProcessor.progress.stage}` as keyof typeof t] as string) || imageProcessor.progress.stage}</span>
                  <span>{imageProcessor.progress.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-200" 
                    style={{ width: `${imageProcessor.progress.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* 错误显示 */}
            {imageProcessor.error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                {imageProcessor.error}
              </div>
            )}
          </div>
        </section>

        {/* HowItWorks 组件 */}
        <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg mb-8">
          <HowItWorks 
            title={t['how-it-works']}
            subtitle={t['how-it-works-desc']}
            steps={DEFAULT_STEPS.map((step, index) => ({
              ...step,
              title: t[`step-${index + 1}-title` as keyof typeof t] as string || step.title,
              description: t[`step-${index + 1}-desc` as keyof typeof t] as string || step.description
            }))}
          />
        </div>

        {/* Features 组件 */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg mb-8">
          <FeaturesList 
            title={t['features-title']}
            subtitle={t['features-desc']}
            features={DEFAULT_FEATURES.map((feature, index) => ({
              ...feature,
              title: t[`feature-${index + 1}-title` as keyof typeof t] as string || feature.title,
              description: t[`feature-${index + 1}-desc` as keyof typeof t] as string || feature.description
            }))}
          />
        </div>

        {/* Examples 组件 */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg mb-8">
          <ExamplesGallery 
            title={t['examples-title']}
            subtitle={t['examples-desc']}
            examples={DEFAULT_EXAMPLES.map((example) => ({
              ...example,
              title: t[example.titleKey as keyof typeof t] as string || example.title,
              description: t[example.descriptionKey as keyof typeof t] as string || example.description
            }))}
            lang={lang}
            viewAllText={t['view-all-examples']}
            settingsText={t.settings}
          />
        </div>

        {/* FAQ 组件 */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg mb-8">
          <FAQ 
            title={t['faq-title']}
            subtitle={t['faq-subtitle']}
            faqs={[
              {
                id: 'what-is-pixelator',
                question: t['faq-q1'],
                answer: t['faq-a1'],
                category: 'general'
              },
              {
                id: 'how-it-works', 
                question: t['faq-q2'],
                answer: t['faq-a2'],
                category: 'technical'
              },
              {
                id: 'is-free',
                question: t['faq-q3'], 
                answer: t['faq-a3'],
                category: 'pricing'
              },
              {
                id: 'supported-formats',
                question: t['faq-q4'],
                answer: t['faq-a4'], 
                category: 'technical'
              },
              {
                id: 'privacy-protection',
                question: t['faq-q5'],
                answer: t['faq-a5'],
                category: 'privacy'
              }
            ]}
            contactText={t['faq-contact']}
            contactButtonText={t['faq-contact-btn']}
          />
        </div>

        {/* 隐私政策组件 */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg mb-8">
          <PrivacyPolicy 
            title={t['privacy-title']}
            subtitle={t['privacy-subtitle']}
            noDataTitle={t['privacy-no-data']}
            description={t['privacy-description']}
            localText={t['privacy-local']}
            noUploadText={t['privacy-no-upload']}
            noStorageText={t['privacy-no-storage']}
            secureText={t['privacy-secure']}
            dataTitle={t['privacy-data-title']}
            dataDesc={t['privacy-data-desc']}
            dataClient={t['privacy-data-client']}
            dataNoUpload={t['privacy-data-no-upload']}
            dataNoCollect={t['privacy-data-no-collect']}
            dataLocal={t['privacy-data-local']}
            analyticsTitle={t['privacy-analytics-title']}
            analyticsDesc={t['privacy-analytics-desc']}
            analyticsGA={t['privacy-analytics-ga']}
            analyticsClarity={t['privacy-analytics-clarity']}
            analyticsIP={t['privacy-analytics-ip']}
            rightsTitle={t['privacy-rights-title']}
            rightsDesc={t['privacy-rights-desc']}
            rightsNoData={t['privacy-rights-no-data']}
            rightsControl={t['privacy-rights-control']}
            rightsNoAccount={t['privacy-rights-no-account']}
            rightsClear={t['privacy-rights-clear']}
          />
        </div>
      </main>
      
      {/* 页脚组件 */}
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm">
        <Footer 
          description={t['footer-description']}
          sections={DEFAULT_FOOTER_SECTIONS.map(section => ({
            ...section,
            title: t[`footer-${section.title.toLowerCase()}` as keyof typeof t] as string || section.title,
            links: section.links.map(link => ({
              ...link,
              label: t[`footer-${link.label.toLowerCase().replace(/\s+/g, '-')}` as keyof typeof t] as string || link.label
            }))
          }))}
        />
      </div>
    </div>
    </>
  )
}
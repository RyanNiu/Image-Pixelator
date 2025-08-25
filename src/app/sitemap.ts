import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://imagepixelator.pics'
  const lastModified = new Date('2025-01-25')
  
  // 支持的语言
  const languages = ['en', 'zh', 'es', 'fr', 'ru', 'hi', 'ko']
  
  // 页面路径
  const paths = ['', '/examples']
  
  const sitemap: MetadataRoute.Sitemap = []
  
  // 添加根页面
  sitemap.push({
    url: baseUrl,
    lastModified,
    changeFrequency: 'daily',
    priority: 1.0,
  })
  
  // 为每种语言添加页面
  languages.forEach((lang) => {
    paths.forEach((path) => {
      const url = `${baseUrl}/${lang}${path}`
      
      // 根据页面类型设置优先级
      let priority = 0.8
      if (path === '') {
        // 主页面
        priority = lang === 'en' ? 1.0 : lang === 'zh' ? 0.9 : 0.8
      } else if (path === '/examples') {
        // 示例页面
        priority = lang === 'en' || lang === 'zh' ? 0.8 : 0.7
      }
      
      sitemap.push({
        url,
        lastModified,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority,
      })
    })
  })
  
  return sitemap
}
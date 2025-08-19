# 部署指南 | Deployment Guide

## 🚀 部署到静态托管平台

### Vercel 部署
1. 连接 GitHub 仓库到 Vercel
2. 构建设置：
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Netlify 部署
1. 连接 GitHub 仓库到 Netlify
2. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`

### GitHub Pages 部署
1. 启用 GitHub Actions
2. 创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔧 构建优化

### 生产环境构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 🌐 域名配置

### 自定义域名
1. 在域名提供商处设置 CNAME 记录
2. 在托管平台添加自定义域名
3. 启用 HTTPS

### SEO 配置
- 确保所有语言版本都可访问
- 提交 sitemap.xml 到搜索引擎
- 配置 Google Search Console

## 📊 性能监控

### 推荐工具
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

### 优化建议
- 启用 Gzip 压缩
- 设置适当的缓存头
- 使用 CDN 加速静态资源
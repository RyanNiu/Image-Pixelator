# Image Pixelator | 图像像素化工具

> 全球首款纯前端在线图像像素化工具，支持多语言，隐私友好

## 🌟 特性

- **🔒 隐私保护**: 所有处理均在浏览器内完成，图片不离开设备
- **🌍 多语言支持**: 支持英语、中文、西班牙语等多种语言
- **
  \*⚡ 实时处理**: Canvas API + WebAssembly 加速，实时预览效果
- **🎨 多种模式**: 原色保留、复古 8 位色、灰度像素等多种风格
- **📱 响应式设计**: 完美适配桌面端和移动端
- **🚀 零依赖**: 纯前端实现，无需服务器，可离线使用

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 📁 项目结构

```
image-pixelator/
├── src/
│   ├── utils/
│   │   ├── pixelator.js      # 核心像素化引擎
│   │   └── i18n.js           # 国际化管理器
│   ├── i18n/
│   │   └── translations.js   # 多语言翻译文件
│   ├── styles/
│   │   └── main.css          # 主样式文件
│   └── main.js               # 应用入口
├── en/                       # 英文版页面
├── zh/                       # 中文版页面
├── es/                       # 西班牙语版页面
├── index.html                # 主页面
├── sitemap.xml              # SEO站点地图
└── robots.txt               # 搜索引擎爬虫配置
```

## 🎯 核心功能

### 图像处理

- **像素大小调节**: 1px - 50px 可调节像素块大小
- **颜色模式**:
  - 原色保留：保持原图颜色
  - 复古 8 位色：经典游戏风格
  - 灰度像素：黑白效果
  - 怀旧棕褐色：复古照片效果
  - 鲜艳色彩：增强饱和度
- **边缘处理**: 硬边缘/软边缘可选
- **快速预设**: 8位游戏风格、街机复古风、低像素头像、我的世界风格、马赛克艺术、复古效果

### 增强功能

- **实时预览**: 双屏对比显示，实时查看效果
- **图片信息**: 显示图片尺寸和文件大小
- **前后对比**: 可切换的对比视图
- **示例展示**: 内置效果示例页面
- **缩放查看**: 点击图片可放大查看细节

### 文件支持

- **输入格式**: JPG, PNG, WebP
- **输出格式**: PNG (透明), JPG (压缩), WebP (高效)
- **文件限制**: ≤20MB, ≤5000×5000 像素

### 多语言

- **支持语言**: English, 中文, Español
- **自动检测**: 根据浏览器语言自动选择
- **SEO 优化**: 每种语言独立页面，完整 hreflang 支持

## 🛠️ 技术栈

- **前端框架**: 原生 JavaScript (ES6+)
- **样式**: Tailwind CSS
- **构建工具**: Vite
- **图像处理**: Canvas API
- **国际化**: 自定义 i18n 系统
- **SEO**: 静态多语言页面

## 🔧 开发指南

### 添加新语言

1. 在 `src/i18n/translations.js` 中添加新语言翻译：

```javascript
export const translations = {
  // 现有语言...
  fr: {
    title: "Pixeliseur d'Images",
    // 其他翻译...
  },
};
```

2. 创建对应语言的 HTML 页面：

```bash
mkdir fr
cp en/index.html fr/index.html
# 修改 fr/index.html 中的语言标识
```

3. 更新 `vite.config.js` 构建配置：

```javascript
input: {
  main: 'index.html',
  en: 'en/index.html',
  zh: 'zh/index.html',
  es: 'es/index.html',
  fr: 'fr/index.html'  // 新增
}
```

### 自定义像素化算法

在 `src/utils/pixelator.js` 中的 `applyColorMode` 方法添加新的颜色处理模式：

```javascript
applyColorMode(color, mode) {
  switch (mode) {
    case 'custom':
      // 自定义颜色处理逻辑
      return processedColor;
    // 其他模式...
  }
}
```

## 📊 性能优化

- **图像处理**: 使用 Canvas API 进行高效像素操作
- **内存管理**: 大图片自动缩放预览，下载时恢复原分辨率
- **加载优化**: CSS/JS 压缩，图片懒加载
- **缓存策略**: 静态资源长期缓存

## 🔒 隐私保护

- **本地处理**: 所有图像处理在用户浏览器内完成
- **无数据上传**: 图片文件不会发送到任何服务器
- **无历史记录**: 关闭页面后所有数据自动清除
- **无追踪**: 不使用任何分析或追踪脚本

## 🌐 SEO 优化

- **多语言页面**: 每种语言独立 HTML 页面
- **语义化标签**: 完整的 HTML5 语义化结构
- **Meta 标签**: 针对每种语言优化的标题和描述
- **Sitemap**: 完整的多语言站点地图
- **hreflang**: 正确的语言版本关联

## 📱 浏览器兼容性

- **现代浏览器**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **移动端**: iOS Safari 12+, Chrome Mobile 60+
- **核心 API**: Canvas API, File API, ES6+ 支持

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com/) - 优秀的 CSS 框架
- [Vite](https://vitejs.dev/) - 快速的构建工具
- Canvas API - 强大的图像处理能力

---

**🌟 如果这个项目对你有帮助，请给个 Star！**

### 一、核心定位调整

全球首款**纯前端在线图像像素化工具**，所有处理均在用户浏览器内完成（图片不离开设备），支持单张图像快速转像素风格，无历史记录存储，专注轻量化、隐私友好的全球用户体验。

### 二、核心功能优化（纯前端适配）

#### 1. 图像上传与输入（纯本地处理）

- **支持方式**：
  - 本地文件：通过`input[type="file"]`选择本地图片（JPG、PNG、WebP，静态图为主）；
  - 拖放上传：支持将本地图片拖入页面指定区域；
  - 设备相册：移动端通过`accept="image/*"`调用系统相册，选择后直接在本地加载（不涉及上传）。
- **限制说明**：
  - 文件大小上限：≤20MB（纯前端处理大文件易导致浏览器卡顿，需明确提示“建议处理 ≤10MB 图片以保证流畅度”）；
  - 分辨率上限：≤5000×5000 像素（超出则提示“图片过大，建议压缩后重试”，避免 Canvas 内存溢出）。

#### 2. 像素化参数自定义（前端实时计算）

- **核心参数**：
  - 像素块大小：1×1 至 50×50（滑块+数值输入，纯前端通过 Canvas 像素重绘实现，实时反馈）；
  - 颜色模式：可选“原色保留”（基于原图颜色压缩）、“复古 8 位色”（限制为 256 色）、“灰度像素”（黑白效果）；
  - 边缘处理：“硬边缘”（像素块边界清晰）、“软边缘”（轻微模糊过渡）。
- **预设模板**：保留“8 位游戏风”“街机复古风”“低像素头像”等模板（本质是预设参数组合，前端一键应用）。

#### 3. 实时预览与交互（无历史记录）

- **双屏对比**：左侧原图（可缩放）、右侧实时像素化效果（基于当前参数实时计算，无延迟）；
- **无历史存储**：不保留任何参数调整记录或处理历史，用户刷新/关闭页面后，所有数据（包括上传的图片）自动清除（仅在当前会话内存中临时存储，不写入 localStorage/sessionStorage）；
- **撤销/重做**：仅支持当前会话内的“单次撤销”（基于内存中最后一次参数状态，不持久化）。

#### 4. 输出与下载（纯前端生成）

- **格式支持**：
  - PNG（支持透明背景，适合设计素材）；
  - JPG（可调节压缩质量 0-100，适合分享）；
  - WebP（高效压缩，平衡质量与体积）。
- **下载方式**：通过 Canvas`toDataURL()`生成图片数据，前端触发下载（文件名格式：`pixelated-[原文件名]-size-[像素大小].png`，便于 SEO 和用户识别）；
- **无水印**：所有输出图片无水印（纯前端工具无服务器成本，降低用户门槛）。

### 三、页面结构
  1. header
    a. logo
    b. 导航菜单
    c. 语言切换
  2. 标题区域
    a. 主标题
    b. 副标题
    c. 功能简述
  3. 使用步骤
  4. 功能模块
    a. 原图上传
    b. 实时预览
    c. 功能区
      i. 像素化参数
      ii. 预设模板
      iii. 撤销/重做
      iv. 输出与下载
  5. 详细介绍
  6. 示例&使用技巧
  7. Privacy Policy（参考文案如下）
    We don't log data
    All conversions and calculations are done in your browser using JavaScript. We don't send a single bit about your input data to our servers. There is no server-side processing at all. We use Google Analytics for site usage analytics. Your IP address is saved on our web server for additional analytics. The free plan doesn't use cookies and don't store session information in cookies. The premium and team plans use cookies to store session information so that you are always logged in. We use your browser's local storage to save tools' input. It stays on your computer.

  8. Terms of Service（参考文案如下）
    The legal stuff
    By using Online Tools you agree to our Terms of Service. All tools are free for personal use but to use them for commercial purposes, you need to get a premium plan. You can't do illegal or shady things with our tools. We may block your access to tools, if we find out you're doing something bad. We're not liable for your actions and we offer no warranty. We may revise our terms at any time.
  9. footer

### 四、国际化支持（纯前端实现）

1. **多语言管理**：

   - 内置语言包：英语、中文（简/繁）、西班牙语、法语、日语、德语、俄语（通过前端 i18n 库如`i18next`管理，文本存储在 JS 变量中，无需后端接口）；
   - 切换机制：页面顶部固定语言选择器（国旗+语言名），切换时实时更新页面文本（无页面刷新，基于 DOM 替换）；
   - 自动识别：通过`navigator.language`检测用户浏览器语言，默认展示对应语言（用户可手动切换）。
   - 优先实现中英文，其他语言后续支持

2. **本地化细节**：
   - 单位适配：像素大小在所有语言中统一用“px”（行业通用）；
   - 提示文本：根据语言习惯调整（如英语“File too large”，中文“文件过大”），避免直译生硬。

### 五、SEO 优化（纯前端场景适配）

#### 1. 技术选型与页面结构

- **非 SPA 架构**：采用静态多语言页面（如`/en/index.html`、`/zh/index.html`），而非单页应用（SPA 对 SEO 不友好），每个语言版本为独立 HTML，便于搜索引擎抓取；
- **语义化标签**：
  - 首页 H1：`Image Pixelator - 纯前端免费图像像素化工具 | 支持多语言`（英文页对应`Image Pixelator - Free Online Pixel Art Tool | Multi-language`）；
  - 功能模块用`<section>`，步骤说明用`<ol>`，参数说明用`<dl>`，增强语义化。

#### 2. 关键词与 Meta 优化

- **核心关键词**（多语言对应）：  
  英语：Image Pixelator, Pixel Art Generator Online, Convert Image to Pixel Art Free；  
  中文：像素画生成器，在线图像转像素风格，免费像素化工具；  
  其他语言：对应直译+本地化常用词（如西班牙语“Generador de Arte Pixelado”）。
- **Meta 标签**：
  - 每个语言页独立 Meta Title：`[语言名] Image Pixelator - 免费在线像素化工具 | 纯前端处理`；
  - Meta Description：`无需上传图片，纯前端一键将照片转为像素艺术！支持自定义像素大小，免费无水印，[语言名]用户首选工具。`；
  - hreflang 标签：在每个页面添加指向其他语言版本的`<link rel="alternate" hreflang="xx" href="..." />`，帮助搜索引擎识别语言对应关系。

#### 3. 图片 SEO（前端可控部分）

- **工具生成图**：用户下载的图片文件名已优化（含关键词），页面内展示的示例图（如模板效果预览）添加 alt 文本（如“8 位游戏风格像素化效果示例”）；
- **教程/帮助图**：若有步骤说明图，alt 文本包含操作关键词（如“如何调整像素大小：拖动滑块至 20px”）；
- **图片格式**：网站自身配图（如 logo、按钮图标）采用 WebP 格式，压缩体积，提升加载速度（纯前端静态资源优化）。

#### 4. 性能与技术 SEO

- **加载速度**：
  - 压缩 CSS/JS（用`terser`压缩 JS，`csso`压缩 CSS）；
  - 非首屏图片（如案例展示）懒加载（`loading="lazy"`）；
  - WebAssembly 模块（图像处理核心）异步加载，不阻塞首屏渲染。
- **移动端适配**：响应式设计（通过 CSS Grid/Flexbox 实现），确保在手机端操作按钮、滑块大小适配触控（最小点击区域 ≥48px）；
- **索引优化**：
  - 静态页面无需动态 URL，sitemap.xml 包含所有语言版本静态 URL，提交至 Google/Bing 等搜索引擎；
  - robots.txt 允许抓取所有静态资源（`Allow: /`），无需要屏蔽的动态内容。

### 五、用户体验优化（纯前端特性）

1. **操作流程**：简化为“上传图片 → 选模板/调参数 → 下载”，3 步完成，无冗余步骤；
2. **实时反馈**：
   - 上传时显示本地加载进度（基于 FileReader 的`progress`事件）；
   - 像素化处理时显示“处理中...”动画（针对大图片，避免用户误以为卡顿）；
3. **隐私提示**：页面显著位置标注“所有处理均在您的设备上完成，图片不会上传至任何服务器，关闭页面后数据自动清除”，增强用户信任；
4. **帮助引导**：首次使用时显示“点击上传图片开始”浮层（可关闭），参数旁添加问号图标（hover 显示简短说明，如“像素块越大，风格越粗犷”）。

### 六、技术栈（纯前端）

- **基础**：HTML5（语义化标签、File API、Canvas API） + CSS3（Tailwind CSS 响应式） + JavaScript（原生，避免重框架影响加载速度）；
- **图像处理**：Canvas API（基础绘制） + WebAssembly（引入轻量 WASM 模块加速像素计算，比纯 JS 快 3-5 倍）；
- **多语言**：i18next（轻量前端国际化库，管理语言包）；
- **构建**：Vite（快速打包，压缩静态资源，生成多语言静态页面）。

# NIPAO 技术博客

基于 VitePress 的现代化技术博客系统，专注于技术分享与经验交流。

## ✨ 特性

- 🚀 **极速体验** - 基于 Vite 的快速构建和热重载
- 📱 **响应式设计** - 完美适配桌面、平板、手机等各种设备
- 🔍 **智能搜索** - 支持全文搜索和实时筛选
- 🏷️ **标签系统** - 便于内容分类和发现
- 📊 **阅读体验** - 显示字数、阅读时间、发布日期等信息
- 🌙 **深色模式** - 护眼的夜间阅读模式
- 🎨 **现代 UI** - 基于 Tailwind CSS 的美观界面
- 📝 **Markdown 支持** - 完整的 Markdown 写作体验
- 🔗 **SEO 友好** - 自动生成站点地图和 meta 信息

## 🛠️ 技术栈

- **前端框架**: [VitePress](https://vitepress.dev/) + [Vue 3](https://vuejs.org/)
- **样式方案**: [Tailwind CSS](https://tailwindcss.com/) + CSS Variables
- **开发语言**: TypeScript + JavaScript
- **构建工具**: [Vite](https://vitejs.dev/)
- **部署平台**: GitHub Pages / Vercel / Netlify
- **内容管理**: Markdown + Git

## 📦 安装与使用

### 环境要求

- Node.js 18.0.0 或更高版本
- npm / yarn / pnpm / bun

### 快速开始

1. **克隆项目**

   ```bash
   git clone https://github.com/yourusername/jue.github.io.git
   cd jue.github.io
   ```

2. **安装依赖**

   ```bash
   # 使用 npm
   npm install

   # 或使用 yarn
   yarn install

   # 或使用 pnpm
   pnpm install

   # 或使用 bun
   bun install
   ```

3. **启动开发服务器**

   ```bash
   npm run dev
   # 或
   npm run docs:dev
   ```

4. **构建生产版本**

   ```bash
   npm run build
   # 或
   npm run docs:build
   ```

5. **预览构建结果**
   ```bash
   npm run preview
   # 或
   npm run docs:preview
   ```

## 📝 写作指南

### 添加新文章

1. 在 `docs/posts/` 目录下创建新的 Markdown 文件
2. 使用以下格式的 frontmatter：

```yaml
---
title: 文章标题
description: 文章描述
date: 2024-01-15
category: 技术教程
tags:
  - Vue.js
  - VitePress
author: NIPAO
---
```

3. 在 frontmatter 后面编写文章内容

### 文章组织

- **文章存放**: `docs/posts/` 目录
- **图片资源**: `docs/public/` 目录
- **配置文件**: `docs/.vitepress/config.ts`

### 支持的分类

- **技术教程** - 系统配置、网络部署、服务优化等实用教程
- **开发相关** - 编程技巧、工具使用、开发经验分享

## 🎨 自定义配置

### 修改站点信息

编辑 `docs/.vitepress/config.ts` 文件：

```typescript
export default defineConfig({
  title: '你的博客标题',
  description: '你的博客描述'
  // ... 其他配置
})
```

### 自定义样式

编辑 `docs/.vitepress/theme/custom.css` 文件来自定义样式。

### 添加新页面

1. 在 `docs/` 目录下创建新的 Markdown 文件
2. 在 `docs/.vitepress/config.ts` 中添加导航链接

## 📁 项目结构

```
jue.github.io/
├── docs/                          # 文档目录
│   ├── .vitepress/                # VitePress 配置
│   │   ├── components/            # Vue 组件
│   │   │   ├── BlogPostCard.vue   # 文章卡片组件
│   │   │   └── BlogPagination.vue # 分页组件
│   │   ├── theme/                 # 主题配置
│   │   │   ├── index.ts           # 主题入口
│   │   │   └── custom.css         # 自定义样式
│   │   ├── utils/                 # 工具函数
│   │   │   └── sitemap.ts         # 站点地图生成
│   │   └── config.ts              # VitePress 配置
│   ├── posts/                     # 文章目录
│   │   ├── index.md               # 文章列表
│   │   └── *.md                   # 各篇文章
│   ├── public/                    # 静态资源
│   ├── index.md                   # 首页
│   ├── blog.md                    # 博客页面
│   ├── tags.md                    # 标签页面
│   ├── archive.md                 # 归档页面
│   └── about.md                   # 关于页面
├── package.json                   # 项目配置
├── vite.config.ts                # Vite 配置
└── README.md                      # 项目说明
```

## 🚀 部署

### GitHub Pages

1. 配置 GitHub Actions 工作流
2. 推送代码到 GitHub 仓库
3. 在仓库设置中启用 GitHub Pages

### Vercel

1. 连接 GitHub 仓库到 Vercel
2. 设置构建命令: `npm run docs:build`
3. 设置输出目录: `docs/.vitepress/dist`

### Netlify

1. 连接 GitHub 仓库到 Netlify
2. 设置构建命令: `npm run docs:build`
3. 设置发布目录: `docs/.vitepress/dist`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

感谢以下开源项目：

- [VitePress](https://vitepress.dev/) - 静态站点生成器
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！

---
layout: project
title: 示例项目
description: 这是一个使用自定义项目布局的示例项目
icon: 🚀
status: active
tech: Vue.js + VitePress
date: 2024-01-15
author: NIPAO
category: 前端开发
tags: [Vue.js, VitePress, 前端]

links:
  - name: 在线演示
    url: https://example.com
    external: true
  - name: GitHub 仓库
    url: https://github.com/example/project
    external: true
  - name: 文档
    url: /docs/project

features:
  - icon: ⚡
    title: 极速性能
    description: 基于 Vite 构建，提供极快的开发体验和构建速度
  - icon: 📱
    title: 响应式设计
    description: 完美适配桌面、平板、手机等各种设备
  - icon: 🎨
    title: 现代化UI
    description: 采用最新的设计趋势，提供优秀的用户体验
  - icon: 🔧
    title: 易于定制
    description: 模块化设计，支持灵活的定制和扩展

techStack:
  - icon: ⚛️
    name: React
  - icon: 🟢
    name: Node.js
  - icon: 🎨
    name: Tailwind CSS
  - icon: 🗄️
    name: PostgreSQL
  - icon: 🚀
    name: Vercel

screenshots:
  - src: /images/project-screenshot-1.png
    alt: 项目首页截图
    caption: 现代化的首页设计
  - src: /images/project-screenshot-2.png
    alt: 功能展示截图
    caption: 核心功能界面

stats:
  - value: 1000+
    label: 用户
  - value: 50+
    label: 功能
  - value: 99.9%
    label: 可用性
---

# 项目介绍

这是一个使用自定义项目布局的示例项目，展示了如何在 VitePress 中创建独特的项目展示页面。

## 项目背景

本项目旨在展示 VitePress 的自定义布局功能，通过创建不同的布局模板，可以为不同类型的页面提供独特的展示效果。

## 技术实现

### 自定义布局系统

我们创建了一套完整的自定义布局系统：

1. **BlogLayout**: 专门用于博客文章的布局
2. **ProjectLayout**: 专门用于项目展示的布局
3. **默认布局**: 保持原有的文档布局

### 布局特性

每个自定义布局都包含以下特性：

- **响应式设计**: 完美适配各种设备
- **主题支持**: 支持明暗主题切换
- **SEO 优化**: 内置 SEO 友好的结构
- **性能优化**: 基于 Vite 的快速构建

## 使用方法

### 1. 博客文章布局

```markdown
---
layout: blog
title: 文章标题
description: 文章描述
date: 2024-01-15
author: 作者名
category: 分类
tags: [标签1, 标签2]
---
```

### 2. 项目展示布局

```markdown
---
layout: project
title: 项目名称
description: 项目描述
icon: 🚀
status: active
tech: 技术栈
date: 2024-01-15
---
```

## 自定义配置

### 项目状态

支持以下项目状态：

- `active`: 进行中（绿色）
- `completed`: 已完成（蓝色）
- `archived`: 已归档（灰色）
- `planning`: 规划中（橙色）

### 技术栈展示

可以通过 `techStack` 配置展示项目使用的技术：

```yaml
techStack:
  - icon: ⚛️
    name: React
  - icon: 🟢
    name: Node.js
```

### 项目截图

通过 `screenshots` 配置展示项目截图：

```yaml
screenshots:
  - src: /images/screenshot.png
    alt: 截图描述
    caption: 截图标题
```

## 总结

通过自定义布局系统，我们可以为不同类型的页面提供独特的展示效果，提升用户体验和页面的专业性。这种模块化的设计方式使得维护和扩展变得更加容易。

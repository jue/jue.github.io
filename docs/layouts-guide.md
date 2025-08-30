---
layout: project
title: 布局使用指南
description: 了解如何在 VitePress 中使用不同的布局类型
---

# 📐 布局使用指南

本指南将详细介绍如何在 VitePress 中使用不同的布局类型，为你的页面创建独特的展示效果。

## 🎯 布局类型概览

### 内置布局类型

VitePress 提供了几种内置的布局类型：

| 布局类型       | 说明             | 适用场景                           |
| -------------- | ---------------- | ---------------------------------- |
| `layout: home` | 首页布局         | 网站首页，包含 hero 区域和特性介绍 |
| `layout: page` | 标准页面布局     | 普通内容页面，包含导航和侧边栏     |
| `layout: doc`  | 文档页面布局     | 技术文档页面（默认布局）           |
| `layout: 404`  | 404 错误页面布局 | 错误页面                           |

### 自定义布局类型

我们还创建了两种自定义布局：

| 布局类型          | 说明         | 适用场景                             |
| ----------------- | ------------ | ------------------------------------ |
| `layout: blog`    | 博客文章布局 | 博客文章，包含目录、标签等           |
| `layout: project` | 项目展示布局 | 项目介绍页面，包含项目信息、技术栈等 |

## 📝 使用方法

### 1. 首页布局 (`layout: home`)

```markdown
---
layout: home
title: 网站首页
description: 网站描述

hero:
  name: '网站名称'
  text: '网站副标题'
  tagline: 网站标语
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/...

features:
  - title: 特性 1
    details: 特性 1 的详细描述
  - title: 特性 2
    details: 特性 2 的详细描述
---
```

### 2. 标准页面布局 (`layout: page`)

```markdown
---
layout: page
title: 页面标题
description: 页面描述
---

# 页面内容

这里是页面的主要内容...
```

### 3. 博客文章布局 (`layout: blog`)

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

# 文章内容

这里是文章的主要内容...
```

### 4. 项目展示布局 (`layout: project`)

```markdown
---
layout: project
title: 项目名称
description: 项目描述
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

features:
  - icon: ⚡
    title: 极速性能
    description: 基于 Vite 构建，提供极快的开发体验
  - icon: 📱
    title: 响应式设计
    description: 完美适配各种设备

techStack:
  - icon: ⚛️
    name: React
  - icon: 🟢
    name: Node.js

screenshots:
  - src: /images/screenshot.png
    alt: 项目截图
    caption: 项目界面展示

stats:
  - value: 1000+
    label: 用户
  - value: 50+
    label: 功能
---

# 项目介绍

这里是项目的详细介绍...
```

## 🎨 布局特性对比

### 首页布局特性

- ✅ Hero 区域（标题、描述、操作按钮）
- ✅ 特性展示网格
- ✅ 全宽设计
- ❌ 导航菜单
- ❌ 侧边栏

### 标准页面布局特性

- ✅ 完整导航菜单
- ✅ 侧边栏（如果配置）
- ✅ 面包屑导航
- ✅ 页脚
- ❌ Hero 区域

### 博客文章布局特性

- ✅ 文章头部信息（标题、作者、日期）
- ✅ 侧边栏目录导航
- ✅ 标签展示
- ✅ 文章元数据
- ✅ 响应式设计

### 项目展示布局特性

- ✅ 项目头部信息（图标、状态、技术栈）
- ✅ 项目链接
- ✅ 特性展示
- ✅ 技术栈展示
- ✅ 项目截图
- ✅ 项目统计

## 🔧 自定义配置

### 博客布局配置选项

| 配置项        | 类型   | 说明     |
| ------------- | ------ | -------- |
| `title`       | string | 文章标题 |
| `description` | string | 文章描述 |
| `date`        | string | 发布日期 |
| `author`      | string | 作者名   |
| `category`    | string | 文章分类 |
| `tags`        | array  | 文章标签 |

### 项目布局配置选项

| 配置项        | 类型   | 说明                                           |
| ------------- | ------ | ---------------------------------------------- |
| `title`       | string | 项目名称                                       |
| `description` | string | 项目描述                                       |
| `icon`        | string | 项目图标（emoji）                              |
| `status`      | string | 项目状态（active/completed/archived/planning） |
| `tech`        | string | 主要技术栈                                     |
| `date`        | string | 项目日期                                       |
| `links`       | array  | 项目相关链接                                   |
| `features`    | array  | 项目特性                                       |
| `techStack`   | array  | 技术栈详情                                     |
| `screenshots` | array  | 项目截图                                       |
| `stats`       | array  | 项目统计                                       |

## 📱 响应式设计

所有自定义布局都支持响应式设计：

- **桌面端** (> 768px): 完整布局，包含侧边栏
- **平板端** (768px - 1024px): 适配中等屏幕
- **手机端** (< 768px): 单列布局，隐藏侧边栏

## 🎯 最佳实践

### 1. 选择合适的布局

- **首页**: 使用 `layout: home`
- **博客文章**: 使用 `layout: blog`
- **项目展示**: 使用 `layout: project`
- **普通页面**: 使用 `layout: page`
- **技术文档**: 使用默认布局或 `layout: doc`

### 2. 配置完整的元数据

确保为每个页面配置完整的 frontmatter：

```markdown
---
layout: blog
title: 完整的标题
description: 详细的描述信息
date: 2024-01-15
author: 作者名
category: 分类
tags: [标签1, 标签2]
---
```

### 3. 使用语义化的标签

在布局组件中使用语义化的 HTML 标签：

```vue
<template>
  <article class="blog-post">
    <header class="post-header">
      <h1>{{ title }}</h1>
    </header>
    <main class="post-content">
      <Content />
    </main>
    <footer class="post-footer">
      <!-- 页脚内容 -->
    </footer>
  </article>
</template>
```

### 4. 保持样式一致性

使用 CSS 变量保持样式一致性：

```css
.blog-layout {
  --layout-max-width: 1200px;
  --layout-padding: 2rem;
  --layout-border-radius: 12px;
}
```

## 🚀 扩展布局

如果需要创建新的布局类型，可以按照以下步骤：

1. **创建布局组件** (`docs/.vitepress/theme/layouts/NewLayout.vue`)
2. **注册布局组件** (`docs/.vitepress/theme/index.ts`)
3. **在 Markdown 中使用** (`layout: new`)

## 📚 相关资源

- [VitePress 官方文档](https://vitepress.dev/)
- [Vue 3 组件开发指南](https://vuejs.org/)
- [CSS 变量使用指南](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

## 🤝 贡献

如果你有好的布局想法或发现了问题，欢迎提交 Issue 或 Pull Request！

---

通过合理使用不同的布局类型，你可以为 VitePress 站点创建更加专业和个性化的页面展示效果。选择合适的布局，配置完整的元数据，遵循最佳实践，你的站点将会更加吸引人！

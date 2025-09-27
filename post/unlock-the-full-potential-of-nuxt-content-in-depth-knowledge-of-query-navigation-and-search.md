---
title: "释放 Nuxt Content 的全部潜力：深入了解查询、导航与搜索"
description: "@nuxt/content 是 Nuxt 生态中最受欢迎的模块之一。它能让你轻松地将 Markdown、YAML、CSV 或 JSON 文件作为内容源，从而构建出功能强大的内容驱动型网站，无论是博客、文档还是作品集。 大多数开发者都熟悉 queryContent 的基本用法，但 Nuxt Conte..."
date: 2025-09-02
lastUpdated: 2025-09-02
authors:
  - name: "jue"
    link: "https://github.com/jue"
    avatar: "https://avatars.githubusercontent.com/u/377499?v=4"
categories:
  - "Tech Talk"
wordCount: 1782
readingTime: 6
githubIssue: 6
githubUrl: "https://github.com/jue/jue.github.io/issues/6"
---
`@nuxt/content` 是 Nuxt 生态中最受欢迎的模块之一。它能让你轻松地将 Markdown、YAML、CSV 或 JSON 文件作为内容源，从而构建出功能强大的内容驱动型网站，无论是博客、文档还是作品集。

大多数开发者都熟悉 `queryContent` 的基本用法，但 Nuxt Content 提供的能力远不止于此。它内置了一套强大的工具集，可以帮你处理内容之间的关系、自动生成导航，甚至为站内搜索打下基础。

今天，就让我们一起深入探索 Nuxt Content 的四个核心查询功能，将你的网站提升到一个新的水平。

### 前置准备

在开始之前，我们假设你已经创建了一个 Nuxt 3 项目并添加了 `@nuxt/content` 模块。同时，你的 `content/` 目录结构如下：

```bash
content/
└── articles/
    ├── first-post.md
    ├── second-post.md
    └── another-post.md
```

每篇文章（例如 `first-post.md`）都有类似这样的 front-matter：

```yaml
---
title: '我的第一篇文章'
description: '这是文章的摘要...'
date: '2025-09-02'
tags: ['Nuxt', 'Content']
published: true
---

这是文章的正文内容...
```

好了，让我们开始吧！

### 1\. 万物之基：使用 `queryContent` 查询你的内容

这是你与 Nuxt Content 交互的起点，也是最核心的功能。它提供了一套优雅的链式 API，让你能够随心所欲地获取内容。

**它的作用：**
`queryContent` 可以让你像查询数据库一样，对你的内容进行筛选、排序、分页和选择特定字段。

**应用场景：**
创建博客列表页、展示特定分类下的文章、获取最新的几篇文章作为首页推荐等。

**代码实现：创建一个文章列表页**

在 `pages/articles/index.vue` 文件中，我们可以这样获取所有已发布并按日期倒序排列的文章：

```vue
<template>
  <div>
    <h1>所有文章</h1>
    <ul v-if="articles && articles.length">
      <li v-for="article in articles" :key="article._path">
        <NuxtLink :to="article._path">
          <h2>{ { article.title } }</h2>
          <p>{ { article.description } }</p>
          <time>{ { new Date(article.date).toLocaleDateString() } }</time>
        </NuxtLink>
      </li>
    </ul>
    <p v-else>暂无文章。</p>
  </div>
</template>

<script setup>
// 使用 queryContent 获取内容
const { data: articles } = await useAsyncData('all-articles', () =>
  queryContent('articles') // 指定查询 'articles' 目录
    .where({ published: true }) // 筛选条件：只显示已发布的
    .sort({ date: -1 }) // 排序：按日期降序（-1 代表 desc）
    .only(['_path', 'title', 'description', 'date']) // 只获取需要的字段以优化性能
    .find() // 执行查询
);
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 2rem;
}
a {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>
```

### 2\. 串联上下文：用 `findSurround` 实现“上一篇/下一篇”

当用户读完一篇文章时，提供一个直接进入下一篇的链接可以极大地提升阅读体验。`findSurround` 就是为此而生的。

**它的作用：**
获取指定内容项在同一个集合中的前一个和后一个邻居。

**应用场景：**
文章详情页底部的“上一篇/下一篇”导航、作品集或图库的翻页链接。

**代码实现：在文章详情页添加导航**

在你的动态路由文件 `pages/articles/[...slug].vue` 中：

```vue
<template>
  <main>
    <ContentDoc />

    <div class="surround-navigation">
      <NuxtLink v-if="prev" :to="prev._path" class="prev">
        <span>上一篇</span>
        <p>{ { prev.title } }</p>
      </NuxtLink>
      <span v-else></span> <NuxtLink v-if="next" :to="next._path" class="next">
        <span>下一篇</span>
        <p>{ { next.title } }</p>
      </NuxtLink>
    </div>
  </main>
</template>

<script setup>
const { path } = useRoute();

// 获取相邻文章，它返回一个包含 [prev, next] 的数组
const { data: surround } = await useAsyncData(`surround-${path}`, () =>
  queryContent('articles')
    .only(['_path', 'title']) // 同样可以只选择需要的字段
    .findSurround(path) // 核心方法：传入当前页面的路径
);

const [prev, next] = surround.value || [null, null];
</script>

<style scoped>
.surround-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}
.surround-navigation a {
  text-decoration: none;
  color: #1a202c;
  max-width: 48%;
}
.surround-navigation a.next {
  text-align: right;
}
.surround-navigation span {
  font-size: 0.875rem;
  color: #718096;
}
.surround-navigation p {
  margin: 0.25rem 0 0;
  font-weight: 500;
}
</style>
```

### 3\. 自动构建骨架：用 `fetchContentNavigation` 生成动态导航

对于文档站或结构复杂的网站，手动维护导航菜单是一件非常繁琐的事。`fetchContentNavigation` 可以根据你的目录结构自动生成导航树。

**它的作用：**
创建一个可直接渲染的、层级化的导航数据结构。

**应用场景：**
文档网站的侧边栏、网站主菜单、面包屑导航。

**代码实现：创建一个可复用的侧边栏导航组件**

你可以创建一个组件 `components/AppSidebar.vue`：

```vue
<template>
  <aside>
    <nav>
      <ul v-if="navigation?.length">
        <li v-for="item in navigation" :key="item._path">
          <NuxtLink :to="item._path">{ { item.title } }</NuxtLink>
          <ul v-if="item.children?.length">
            <li v-for="child in item.children" :key="child._path">
               <NuxtLink :to="child._path">{ { child.title } }</NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
// 获取整个项目的导航树
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation());
</script>
```

**提示**：你可以在每个文件夹下创建一个 `.navigation.yml` 文件来自定义文件夹在导航中显示的标题，这比默认使用文件夹名要灵活得多。

### 4\. 赋予智慧：用 `searchContent` 打造站内搜索

当网站内容越来越多，一个好用的搜索功能就变得至关重要。`searchContent` 正是实现这一功能的基础。

**它的作用：**
它不会直接提供一个完整的搜索解决方案，而是将你的文档内容智能地分割成可搜索的小块（sections），每一块都包含标题、纯文本内容和层级信息。

**应用场景：**
将处理后的数据喂给前端搜索库（如 [Fuse.js](https://fusejs.io/) 或 [FlexSearch](https://github-cdn.nipao.com/nextapps-de/flexsearch)），构建高性能的站内全文搜索功能。

**代码实现：一个极简的搜索组件**

这个例子展示了如何获取并展示搜索数据。在实际项目中，你需要结合一个搜索库来实现模糊匹配和高亮。

```vue
<template>
  <div>
    <input
      v-model="query"
      type="search"
      placeholder="搜索文章内容..."
    />
    <ul v-if="results.length">
      <li v-for="result in results" :key="result.id">
        <NuxtLink :to="result.path + '#' + result.id">
          <strong>{ { result.title } }</strong>
          <p>{ { result.text.substring(0, 150) } }...</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const query = ref('');
const searchData = ref([]);
const results = ref([]);

// 1. 获取所有可供搜索的数据
const { data } = await useAsyncData('search-data', () => searchContent());
if (data.value) {
  // 简单地将数据扁平化处理
  searchData.value = data.value.flatMap(doc => 
    doc.body.children
      // 通常我们只索引标题和段落
      .filter(section => ['h1','h2','h3','p'].includes(section.tag))
      .map(section => ({
        id: section.props.id,
        path: doc._path,
        title: section.tag.startsWith('h') ? section.children[0].value : doc.title,
        text: section.children?.[0]?.value || ''
      }))
  );
}

// 2. 监听输入并执行搜索 (这里是极简的实现)
watch(query, (newQuery) => {
  if (!newQuery) {
    results.value = [];
  } else {
    results.value = searchData.value.filter(item =>
      item.title.toLowerCase().includes(newQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(newQuery.toLowerCase())
    ).slice(0, 10); // 只显示前10条结果
  }
});
</script>
```

### 总结

通过掌握这四个强大的查询功能，你可以将 Nuxt Content 的能力发挥到极致：

  - **`queryContent`** 是数据获取的基石。
  - **`findSurround`** 负责连接内容，优化阅读流。
  - **`fetchContentNavigation`** 自动化构建网站结构。
  - **`searchContent`** 为内容赋予了被发现的智慧。

下次当你构建 Nuxt Content 项目时，不妨试试这些功能。它们会让你的开发过程更高效，也会让你的最终成品更专业、更易用。现在就开始探索，释放你内容的全部潜力吧！
---
layout: page
title: 博客文章
description: 技术分享与开发经验
---

<script setup>
import { ref, onMounted, computed } from 'vue'
import { data as postsData } from '../.vitepress/theme/posts.data.js'

// 博客数据状态
const posts = ref([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取分类统计
const categorizedPosts = computed(() => {
  const categories = {
    '技术教程': [],
    '开发相关': [],
    '其他': []
  }
  
  posts.value.forEach(post => {
    const category = post.category || '其他'
    if (categories[category]) {
      categories[category].push(post)
    } else {
      categories['其他'].push(post)
    }
  })
  
  return categories
})

const totalPosts = computed(() => posts.value.length)
const totalPages = computed(() => Math.ceil(totalPosts.value / pageSize.value))

// 获取当前页的文章
const getCurrentPagePosts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return posts.value.slice(startIndex, endIndex)
})

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 组件挂载时加载数据
onMounted(async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 300)) // 简短加载动画
  posts.value = postsData || []
  loading.value = false
})
</script>

# 📚 博客文章

欢迎来到我的技术博客！这里分享各种技术教程、开发经验和实用工具。

<div v-if="loading" class="loading-skeleton">
  <div class="skeleton-line"></div>
  <div class="skeleton-line"></div>
  <div class="skeleton-line"></div>
</div>

<div v-else-if="error" class="empty-state">
  <div class="empty-icon">⚠️</div>
  <div class="empty-title">加载失败</div>
  <div class="empty-description">{{ error }}</div>
</div>

<div v-else>
  <!-- 统计信息 -->
  <div class="blog-stats">
    <div class="stats-item">
      <div class="stats-number">{{ totalPosts }}</div>
      <div class="stats-label">总文章数</div>
    </div>
    <div class="stats-item">
      <div class="stats-number">{{ Object.keys(categorizedPosts).filter(key => categorizedPosts[key].length > 0).length }}</div>
      <div class="stats-label">分类数</div>
    </div>
    <div class="stats-item">
      <div class="stats-number">持续更新</div>
      <div class="stats-label">更新频率</div>
    </div>
  </div>

  <!-- 分页导航（顶部） -->

<BlogPagination
v-if="totalPages > 1"
:current-page="currentPage"
:total-pages="totalPages"
:total-items="totalPosts"
@page-change="handlePageChange"
/>

  <!-- 文章列表 -->
  <div class="blog-posts-container">
    <BlogPostCard 
      v-for="post in getCurrentPagePosts"
      :key="post.url"
      :post="post"
      :show-excerpt="true"
      :excerpt-length="150"
    />
  </div>

  <!-- 空状态 -->
  <div v-if="posts.length === 0" class="empty-state">
    <div class="empty-icon">📝</div>
    <div class="empty-title">暂无文章</div>
    <div class="empty-description">还没有发布任何文章，敬请期待！</div>
  </div>

  <!-- 分页导航（底部） -->

<BlogPagination
v-if="totalPages > 1"
:current-page="currentPage"
:total-pages="totalPages"
:total-items="totalPosts"
@page-change="handlePageChange"
/>

  <!-- 分类概览 -->
  <div class="category-overview">
    <div 
      v-for="(categoryPosts, categoryName) in categorizedPosts" 
      :key="categoryName"
      v-show="categoryPosts.length > 0"
      class="category-card"
    >
      <h4>{{ getCategoryIcon(categoryName) }} {{ categoryName }}</h4>
      <div class="category-count">{{ categoryPosts.length }}篇</div>
      <div class="category-description">{{ getCategoryDescription(categoryName) }}</div>
    </div>
  </div>
</div>

<script>
// 获取分类图标
function getCategoryIcon(categoryName) {
  const icons = {
    '技术教程': '🔧',
    '开发相关': '💻',
    '其他': '📄'
  }
  return icons[categoryName] || '📄'
}

// 获取分类描述
function getCategoryDescription(categoryName) {
  const descriptions = {
    '技术教程': '系统配置、网络部署、服务优化等实用教程',
    '开发相关': '编程技巧、工具使用、开发经验分享',
    '其他': '其他技术相关内容'
  }
  return descriptions[categoryName] || '其他技术相关内容'
}
</script>

---

_💡 提示：点击文章标题即可阅读完整内容。所有文章都会持续更新和完善。_

<style>
.loading-skeleton {
  padding: 2rem 0;
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, var(--vp-c-bg-soft) 25%, var(--vp-c-divider) 50%, var(--vp-c-bg-soft) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  margin-bottom: 1rem;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--vp-c-text-2);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.empty-description {
  font-size: 1rem;
  line-height: 1.6;
}

.blog-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.stats-item {
  text-align: center;
}

.stats-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.5rem;
}

.stats-label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.blog-posts-container {
  margin: 2rem 0;
}

.category-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.category-card {
  padding: 1.5rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  text-align: center;
}

.category-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.category-card h4 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
  font-size: 1.2rem;
}

.category-count {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.5rem;
}

.category-description {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .blog-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .category-overview {
    grid-template-columns: 1fr;
  }
}
</style>

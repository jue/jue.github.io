---
layout: page
title: 博客文章
description: 技术分享与开发经验
---

<script setup>
import { ref, onMounted } from 'vue'

// 博客数据状态
const posts = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPosts = ref(0)
const totalPages = ref(0)
const categorizedPosts = ref({
  '技术教程': [],
  '开发相关': [],
  '其他': []
})

// 模拟从GitHub API获取数据
// 在实际部署中，这些数据将由GitHub Actions自动生成
const mockPosts = [
  {
    number: 1,
    title: '【Proxmox VE 终极教程】如何实现虚拟机（Guest OS）宕机后自动重启？',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    body: '这是一篇关于Proxmox VE虚拟机自动重启的详细教程。在这篇文章中，我们将学习如何配置虚拟机在宕机后自动重启，确保服务的高可用性。本教程涵盖了从基础配置到高级优化的完整流程，适合系统管理员和运维工程师参考。',
    labels: [{ name: '技术教程' }, { name: 'Proxmox' }],
    state: 'open',
    author: { login: 'jue' }
  },
  {
    number: 2,
    title: '【实战教程】突破端口封锁：如何使用1Panel在家庭网络中发布多个HTTPS服务',
    created_at: '2024-01-14T09:00:00Z',
    updated_at: '2024-01-14T09:00:00Z',
    body: '本教程将详细介绍如何使用1Panel在家庭网络环境中发布多个HTTPS服务，突破运营商的端口封锁限制。我们将学习反向代理配置、SSL证书管理、域名解析等关键技术。',
    labels: [{ name: '技术教程' }, { name: '网络' }],
    state: 'open',
    author: { login: 'jue' }
  },
  {
    number: 3,
    title: '如何重置supabase里所有表、函数和触发器',
    created_at: '2024-01-13T08:00:00Z',
    updated_at: '2024-01-13T08:00:00Z',
    body: '在开发过程中，有时需要完全重置Supabase数据库。本文将介绍如何安全地重置所有表、函数和触发器，包括数据备份、权限管理等重要注意事项。',
    labels: [{ name: '开发相关' }, { name: 'Supabase' }],
    state: 'open',
    author: { login: 'jue' }
  },
  {
    number: 4,
    title: '理解Autodesk Viewer3D文档的使用方法',
    created_at: '2024-01-12T07:00:00Z',
    updated_at: '2024-01-12T07:00:00Z',
    body: 'Autodesk Viewer3D是一个强大的3D模型查看器。本文将详细介绍其API文档的使用方法和最佳实践，帮助开发者快速集成3D查看功能。',
    labels: [{ name: '开发相关' }, { name: 'JavaScript' }],
    state: 'open',
    author: { login: 'jue' }
  },
  {
    number: 5,
    title: 'Vue 3 Composition API 最佳实践',
    created_at: '2024-01-11T06:00:00Z',
    updated_at: '2024-01-11T06:00:00Z',
    body: '深入探讨Vue 3 Composition API的使用技巧和最佳实践，帮助开发者更好地组织和管理代码。包括响应式数据、生命周期钩子、组合式函数等核心概念。',
    labels: [{ name: '技术教程' }, { name: 'Vue' }],
    state: 'open',
    author: { login: 'jue' }
  }
]

// 加载博客数据
const loadPosts = async () => {
  try {
    loading.value = true
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    posts.value = mockPosts
    totalPosts.value = mockPosts.length
    totalPages.value = Math.ceil(totalPosts.value / pageSize.value)
    
    // 按分类分组
    categorizedPosts.value = {
      '技术教程': mockPosts.filter(post => post.labels.some(label => label.name === '技术教程')),
      '开发相关': mockPosts.filter(post => post.labels.some(label => label.name === '开发相关')),
      '其他': mockPosts.filter(post => !post.labels.some(label => ['技术教程', '开发相关'].includes(label.name)))
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 获取当前页的文章
const getCurrentPagePosts = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return posts.value.slice(startIndex, endIndex)
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 组件挂载时加载数据
onMounted(() => {
  loadPosts()
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
      v-for="post in getCurrentPagePosts()"
      :key="post.number"
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

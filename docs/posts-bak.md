---
layout: page
title: 博客
description: 技术分享与开发经验
---

<script setup>
import { ref, onMounted, computed } from 'vue'
import { data as postsData } from './.vitepress/theme/posts.data.js'

// 博客数据状态
const posts = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const pageSize = ref(6)
const selectedCategory = ref('全部')
const searchQuery = ref('')

// 获取所有分类
const categories = computed(() => {
  const cats = new Set(['全部'])
  posts.value.forEach(post => {
    if (post.category) {
      cats.add(post.category)
    }
    post.tags?.forEach(tag => cats.add(tag))
  })
  return Array.from(cats)
})

// 过滤后的文章
const filteredPosts = computed(() => {
  let filtered = posts.value

  // 按分类过滤
  if (selectedCategory.value !== '全部') {
    filtered = filtered.filter(post => 
      post.category === selectedCategory.value ||
      post.tags?.includes(selectedCategory.value)
    )
  }

  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(query) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(query))
    )
  }

  return filtered
})

// 总页数
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize.value))

// 当前页文章
const currentPagePosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredPosts.value.slice(start, start + pageSize.value)
})

// 分类统计
const categoryStats = computed(() => {
  const stats = {}
  posts.value.forEach(post => {
    if (post.category) {
      stats[post.category] = (stats[post.category] || 0) + 1
    }
    post.tags?.forEach(tag => {
      stats[tag] = (stats[tag] || 0) + 1
    })
  })
  return stats
})

// 加载数据
const loadPosts = async () => {
  try {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    posts.value = postsData || []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 处理分类切换
const handleCategoryChange = (category) => {
  selectedCategory.value = category
  currentPage.value = 1
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 处理分页
const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  handleSearch()
}

// 初始化
onMounted(() => {
  loadPosts()
})
</script>

<pre>{{postsData}}</pre>

<!-- 搜索和筛选 -->
<div class="blog-controls">
  <div class="search-box">
    <input 
      v-model="searchQuery"
      type="text"
      placeholder="搜索文章标题或内容..."
      class="search-input"
      @keyup.enter="handleSearch"
    >
    <button @click="handleSearch" class="search-btn">🔍</button>
    <button v-if="searchQuery" @click="clearSearch" class="clear-btn">✕</button>
  </div>
  
  <div class="category-filters">
    <button
      v-for="category in categories"
      :key="category"
      @click="handleCategoryChange(category)"
      class="category-btn"
      :class="{ active: selectedCategory === category }"
    >
      {{ category }}
      <span v-if="category !== '全部'" class="count">({{ categoryStats[category] || 0 }})</span>
    </button>
  </div>
</div>

<!-- 加载状态 -->
<div v-if="loading" class="loading-container">
  <div class="loading-spinner"></div>
  <p>正在加载文章...</p>
</div>

<!-- 错误状态 -->
<div v-else-if="error" class="error-container">
  <div class="error-icon">⚠️</div>
  <h3>加载失败</h3>
  <p>{{ error }}</p>
  <button @click="loadPosts" class="retry-btn">重试</button>
</div>

<!-- 文章列表 -->
<div v-else class="blog-content">
  <!-- 搜索结果提示 -->
  <div v-if="searchQuery" class="search-result-info">
    <p>搜索 "<strong>{{ searchQuery }}</strong>" 找到 {{ filteredPosts.length }} 篇文章</p>
  </div>
  
  <!-- 分类筛选提示 -->
  <div v-if="selectedCategory !== '全部'" class="category-info">
    <p>分类 "<strong>{{ selectedCategory }}</strong>" 下共有 {{ filteredPosts.length }} 篇文章</p>
  </div>

  <!-- 文章网格 -->
  <div v-if="currentPagePosts.length > 0" class="posts-grid">
    <BlogPostCard 
      v-for="post in currentPagePosts"
      :key="post.number"
      :post="post"
      :show-excerpt="true"
      :excerpt-length="120"
    />
  </div>

  <!-- 空状态 -->
  <div v-else class="empty-state">
    <div class="empty-icon">📝</div>
    <h3>{{ searchQuery ? '没有找到相关文章' : '暂无文章' }}</h3>
    <p>{{ searchQuery ? '尝试修改搜索词或选择其他分类' : '还没有发布任何文章，敬请期待！' }}</p>
    <button v-if="searchQuery || selectedCategory !== '全部'" @click="clearSearch(); handleCategoryChange('全部')" class="reset-btn">
      重置筛选
    </button>
  </div>

  <!-- 分页组件 -->

<BlogPagination
v-if="totalPages > 1"
:current-page="currentPage"
:total-pages="totalPages"
:total-items="filteredPosts.length"
@page-change="handlePageChange"
/>

</div>

<!-- 侧边栏信息 -->
<div class="blog-sidebar">
  <div class="stats-card">
    <h4>📊 博客统计</h4>
    <div class="stat-item">
      <span class="stat-number">{{ posts.length }}</span>
      <span class="stat-label">总文章</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">{{ Object.keys(categoryStats).length }}</span>
      <span class="stat-label">分类数</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">持续更新</span>
      <span class="stat-label">更新频率</span>
    </div>
  </div>

  <div class="categories-card">
    <h4>🏷️ 热门分类</h4>
    <div class="category-list">
      <div 
        v-for="(count, category) in categoryStats" 
        :key="category"
        class="category-item"
        @click="handleCategoryChange(category)"
      >
        <span class="category-name">{{ category }}</span>
        <span class="category-count">{{ count }}</span>
      </div>
    </div>
  </div>
</div>

<style scoped>
.blog-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--vp-c-brand-soft) 0%, var(--vp-c-bg-soft) 100%);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.blog-intro {
  max-width: 600px;
  margin: 0 auto;
}

.blog-intro p {
  margin: 0.5rem 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.blog-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.search-box {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-btn,
.clear-btn {
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover,
.clear-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  white-space: nowrap;
}

.category-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.category-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.count {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--vp-c-divider);
  border-top: 3px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn,
.reset-btn {
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.retry-btn:hover,
.reset-btn:hover {
  background: var(--vp-c-brand-dark);
}

.blog-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.search-result-info,
.category-info {
  padding: 1rem;
  background: var(--vp-c-tip-soft);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-brand-soft);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
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

.blog-sidebar {
  display: none;
}

.stats-card,
.categories-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.stats-card h4,
.categories-card h4 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.stat-label {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.category-item:hover {
  background: var(--vp-c-bg);
}

.category-name {
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
}

.category-count {
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
  background: var(--vp-c-bg);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

@media (min-width: 768px) {
  .blog-controls {
    flex-direction: row;
    align-items: center;
  }
  
  .search-box {
    min-width: 300px;
  }
  
  .blog-content {
    grid-template-columns: 1fr 300px;
  }
  
  .blog-sidebar {
    display: block;
  }
}

@media (max-width: 480px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .category-filters {
    justify-content: center;
  }
}
</style>

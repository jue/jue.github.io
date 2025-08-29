---
layout: page
title: 标签
description: 按标签浏览文章
---

<script setup>
import { ref, onMounted, computed } from 'vue'

// 数据状态
const tags = ref([])
const loading = ref(true)
const selectedTag = ref('')
const posts = ref([])

// 模拟标签数据
const mockTags = [
  { name: '技术教程', count: 3, color: '#3b82f6' },
  { name: '开发相关', count: 2, color: '#10b981' },
  { name: 'Proxmox', count: 1, color: '#ef4444' },
  { name: '网络', count: 2, color: '#8b5cf6' },
  { name: '1Panel', count: 1, color: '#f59e0b' },
  { name: 'CDN', count: 1, color: '#06b6d4' },
  { name: 'Supabase', count: 1, color: '#22c55e' },
  { name: '数据库', count: 1, color: '#6366f1' },
  { name: 'JavaScript', count: 1, color: '#fbbf24' },
  { name: '3D', count: 1, color: '#f472b6' },
  { name: '虚拟化', count: 1, color: '#ef4444' }
]

// 模拟文章数据
const mockPosts = [
  {
    title: '【Proxmox VE 终极教程】如何实现虚拟机（Guest OS）宕机后自动重启？',
    link: '/posts/【Proxmox VE 终极教程】如何实现虚拟机（Guest OS）宕机后自动重启？',
    date: '2024-01-15',
    tags: ['技术教程', 'Proxmox', '虚拟化']
  },
  {
    title: '【实战教程】突破端口封锁：如何使用1Panel在家庭网络中发布多个HTTPS服务',
    link: '/posts/【实战教程】突破端口封锁：如何使用1Panel在家庭网络中发布多个HTTPS服务',
    date: '2024-01-14',
    tags: ['技术教程', '网络', '1Panel']
  },
  {
    title: '【进阶篇】巧用CDN：为家庭服务套上"马甲"，实现完美HTTPS访问',
    link: '/posts/【进阶篇】巧用CDN：为家庭服务套上"马甲"，实现完美HTTPS访问',
    date: '2024-01-13',
    tags: ['技术教程', '网络', 'CDN']
  },
  {
    title: '如何重置supabase里所有表、函数和触发器',
    link: '/posts/如何重置supabase里所有表、函数和触发器',
    date: '2024-01-12',
    tags: ['开发相关', 'Supabase', '数据库']
  },
  {
    title: '理解Autodesk Viewer3D文档的使用方法',
    link: '/posts/理解Autodesk Viewer3D文档的使用方法',
    date: '2024-01-11',
    tags: ['开发相关', 'JavaScript', '3D']
  }
]

// 按标签分组的文章
const postsByTag = computed(() => {
  const grouped = {}
  posts.value.forEach(post => {
    post.tags.forEach(tag => {
      if (!grouped[tag]) {
        grouped[tag] = []
      }
      grouped[tag].push(post)
    })
  })
  return grouped
})

// 筛选后的文章
const filteredPosts = computed(() => {
  if (!selectedTag.value) return []
  return postsByTag.value[selectedTag.value] || []
})

// 标签云大小计算
const getTagSize = (count) => {
  const maxCount = Math.max(...tags.value.map(tag => tag.count))
  const minSize = 0.8
  const maxSize = 2
  return minSize + (count / maxCount) * (maxSize - minSize)
}

// 选择标签
const selectTag = (tagName) => {
  selectedTag.value = selectedTag.value === tagName ? '' : tagName
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    tags.value = mockTags
    posts.value = mockPosts
  } catch (error) {
    console.error('加载标签数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadData()
})
</script>

# 🏷️ 标签云

<div class="tags-intro">
  <p>通过标签快速找到您感兴趣的技术文章</p>
  <p>点击标签查看相关文章，再次点击取消筛选</p>
</div>

<!-- 加载状态 -->
<div v-if="loading" class="loading-container">
  <div class="loading-spinner"></div>
  <p>正在加载标签...</p>
</div>

<!-- 标签云 -->
<div v-else class="tags-cloud-container">
  <div class="tags-cloud">
    <button
      v-for="tag in tags"
      :key="tag.name"
      @click="selectTag(tag.name)"
      class="tag-button"
      :class="{ active: selectedTag === tag.name }"
      :style="{
        fontSize: getTagSize(tag.count) + 'rem',
        '--tag-color': tag.color
      }"
    >
      {{ tag.name }}
      <span class="tag-count">({{ tag.count }})</span>
    </button>
  </div>

  <!-- 标签统计 -->
  <div class="tags-stats">
    <div class="stats-item">
      <span class="stats-number">{{ tags.length }}</span>
      <span class="stats-label">总标签数</span>
    </div>
    <div class="stats-item">
      <span class="stats-number">{{ posts.length }}</span>
      <span class="stats-label">文章总数</span>
    </div>
    <div class="stats-item">
      <span class="stats-number">{{ selectedTag ? filteredPosts.length : 0 }}</span>
      <span class="stats-label">当前筛选</span>
    </div>
  </div>
</div>

<!-- 筛选结果 -->
<div v-if="selectedTag" class="filter-results">
  <div class="filter-header">
    <h3>
      标签 "<span class="tag-name">{{ selectedTag }}</span>" 相关文章
      <span class="result-count">({{ filteredPosts.length }}篇)</span>
    </h3>
    <button @click="selectedTag = ''" class="clear-filter-btn">
      ✕ 清除筛选
    </button>
  </div>

  <div class="posts-list">
    <article
      v-for="post in filteredPosts"
      :key="post.title"
      class="post-item"
    >
      <div class="post-content">
        <h4 class="post-title">
          <a :href="post.link" class="post-link">{{ post.title }}</a>
        </h4>
        
        <div class="post-meta">
          <time class="post-date">{{ formatDate(post.date) }}</time>
          <div class="post-tags">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="post-tag"
              :class="{ current: tag === selectedTag }"
              @click="selectTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </article>
  </div>
</div>

<!-- 使用提示 -->
<div v-else class="usage-tips">
  <div class="tips-card">
    <h3>💡 使用提示</h3>
    <ul>
      <li>点击任意标签查看相关文章</li>
      <li>标签大小反映了文章数量</li>
      <li>可以通过不同标签探索相关内容</li>
      <li>支持快速切换标签进行筛选</li>
    </ul>
  </div>

  <div class="popular-tags">
    <h3>🔥 热门标签</h3>
    <div class="popular-list">
      <div
        v-for="tag in tags.slice().sort((a, b) => b.count - a.count).slice(0, 5)"
        :key="tag.name"
        class="popular-item"
        @click="selectTag(tag.name)"
      >
        <span class="popular-name">{{ tag.name }}</span>
        <span class="popular-count">{{ tag.count }}篇</span>
      </div>
    </div>
  </div>
</div>

<style scoped>
.tags-intro {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.tags-intro p {
  margin: 0.5rem 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.loading-container {
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

.tags-cloud-container {
  margin-bottom: 2rem;
}

.tags-cloud {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  line-height: 2.5;
  margin-bottom: 1.5rem;
}

.tag-button {
  display: inline-block;
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.tag-button:hover {
  color: var(--tag-color);
  border-color: var(--tag-color);
  transform: scale(1.05);
}

.tag-button.active {
  background: var(--tag-color);
  border-color: var(--tag-color);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tag-count {
  font-size: 0.75em;
  opacity: 0.8;
  margin-left: 0.25rem;
}

.tags-stats {
  display: flex;
  justify-content: space-around;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
}

.stats-item {
  text-align: center;
}

.stats-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.25rem;
}

.stats-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.filter-results {
  margin-top: 2rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--vp-c-tip-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-brand-soft);
}

.filter-header h3 {
  margin: 0;
  color: var(--vp-c-text-1);
}

.tag-name {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.result-count {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-weight: normal;
}

.clear-filter-btn {
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.clear-filter-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.post-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
}

.post-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.3s ease;
}

.post-link:hover {
  color: var(--vp-c-brand-1);
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.post-date {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-tag {
  padding: 0.25rem 0.5rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-tag:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.post-tag.current {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.usage-tips {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.tips-card,
.popular-tags {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
}

.tips-card h3,
.popular-tags h3 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.tips-card ul {
  margin: 0;
  padding-left: 1.5rem;
}

.tips-card li {
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.popular-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.popular-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.popular-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(4px);
}

.popular-name {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.popular-count {
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
  background: var(--vp-c-bg-soft);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

@media (min-width: 768px) {
  .filter-header {
    flex-direction: row;
  }
  
  .post-meta {
    flex-direction: row;
  }
  
  .usage-tips {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .tags-cloud {
    padding: 1rem;
  }
  
  .tag-button {
    font-size: 0.875rem;
    margin: 0.25rem;
  }
  
  .filter-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .stats-item {
    font-size: 0.875rem;
  }
  
  .stats-number {
    font-size: 1.25rem;
  }
}
</style>

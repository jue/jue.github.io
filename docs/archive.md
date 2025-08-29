---
layout: page
title: 归档
description: 按时间浏览所有文章
---

<script setup>
import { ref, onMounted, computed } from 'vue'

// 数据状态
const posts = ref([])
const loading = ref(true)
const selectedYear = ref('')
const selectedMonth = ref('')

// 模拟文章数据
const mockPosts = [
  {
    title: '【Proxmox VE 终极教程】如何实现虚拟机（Guest OS）宕机后自动重启？',
    link: '/posts/【Proxmox VE 终极教程】如何实现虚拟机（Guest OS）宕机后自动重启？',
    date: '2024-01-15',
    category: '技术教程',
    wordCount: 2800
  },
  {
    title: '【实战教程】突破端口封锁：如何使用1Panel在家庭网络中发布多个HTTPS服务',
    link: '/posts/【实战教程】突破端口封锁：如何使用1Panel在家庭网络中发布多个HTTPS服务',
    date: '2024-01-14',
    category: '技术教程',
    wordCount: 3200
  },
  {
    title: '【进阶篇】巧用CDN：为家庭服务套上"马甲"，实现完美HTTPS访问',
    link: '/posts/【进阶篇】巧用CDN：为家庭服务套上"马甲"，实现完美HTTPS访问',
    date: '2024-01-13',
    category: '技术教程',
    wordCount: 2100
  },
  {
    title: '如何重置supabase里所有表、函数和触发器',
    link: '/posts/如何重置supabase里所有表、函数和触发器',
    date: '2024-01-12',
    category: '开发相关',
    wordCount: 1800
  },
  {
    title: '理解Autodesk Viewer3D文档的使用方法',
    link: '/posts/理解Autodesk Viewer3D文档的使用方法',
    date: '2024-01-11',
    category: '开发相关',
    wordCount: 4500
  }
]

// 按年月分组的文章
const groupedPosts = computed(() => {
  const grouped = {}
  
  posts.value.forEach(post => {
    const date = new Date(post.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    
    if (!grouped[year]) {
      grouped[year] = {}
    }
    if (!grouped[year][month]) {
      grouped[year][month] = []
    }
    
    grouped[year][month].push(post)
  })
  
  return grouped
})

// 年份列表
const years = computed(() => {
  return Object.keys(groupedPosts.value)
    .map(year => parseInt(year))
    .sort((a, b) => b - a)
})

// 月份列表
const months = computed(() => {
  if (!selectedYear.value) return []
  return Object.keys(groupedPosts.value[selectedYear.value] || {})
    .map(month => parseInt(month))
    .sort((a, b) => b - a)
})

// 筛选后的文章
const filteredPosts = computed(() => {
  if (!selectedYear.value) {
    return posts.value.sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  
  if (!selectedMonth.value) {
    const yearPosts = []
    Object.values(groupedPosts.value[selectedYear.value] || {}).forEach(monthPosts => {
      yearPosts.push(...monthPosts)
    })
    return yearPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  
  return groupedPosts.value[selectedYear.value]?.[selectedMonth.value] || []
})

// 统计信息
const stats = computed(() => {
  const totalPosts = posts.value.length
  const totalWords = posts.value.reduce((sum, post) => sum + post.wordCount, 0)
  const avgWords = totalPosts > 0 ? Math.round(totalWords / totalPosts) : 0
  
  return {
    totalPosts,
    totalWords,
    avgWords,
    years: years.value.length
  }
})

// 时间轴数据
const timeline = computed(() => {
  const timelineData = []
  
  years.value.forEach(year => {
    const yearData = {
      year,
      months: []
    }
    
    const yearMonths = Object.keys(groupedPosts.value[year])
      .map(month => parseInt(month))
      .sort((a, b) => b - a)
    
    yearMonths.forEach(month => {
      const monthPosts = groupedPosts.value[year][month]
      yearData.months.push({
        month,
        posts: monthPosts,
        count: monthPosts.length
      })
    })
    
    timelineData.push(yearData)
  })
  
  return timelineData
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 格式化月份
const formatMonth = (month) => {
  return new Date(2024, month - 1, 1).toLocaleDateString('zh-CN', { month: 'long' })
}

// 计算阅读时间
const getReadingTime = (wordCount) => {
  return Math.ceil(wordCount / 200)
}

// 获取分类图标
const getCategoryIcon = (category) => {
  const icons = {
    '技术教程': '🔧',
    '开发相关': '💻',
    '其他': '📄'
  }
  return icons[category] || '📄'
}

// 筛选控制
const filterByYear = (year) => {
  selectedYear.value = selectedYear.value === year.toString() ? '' : year.toString()
  selectedMonth.value = ''
}

const filterByMonth = (month) => {
  selectedMonth.value = selectedMonth.value === month.toString() ? '' : month.toString()
}

const clearFilter = () => {
  selectedYear.value = ''
  selectedMonth.value = ''
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    posts.value = mockPosts
  } catch (error) {
    console.error('加载归档数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

# 📅 文章归档

<div class="archive-intro">
  <p>按时间顺序浏览所有文章，回顾技术学习的每一步足迹</p>
  <p>点击年份或月份进行筛选，探索感兴趣的时间段内容</p>
</div>

<!-- 加载状态 -->
<div v-if="loading" class="loading-container">
  <div class="loading-spinner"></div>
  <p>正在加载归档...</p>
</div>

<!-- 归档内容 -->
<div v-else class="archive-container">
  <!-- 统计面板 -->
  <div class="stats-panel">
    <div class="stat-card">
      <div class="stat-number">{{ stats.totalPosts }}</div>
      <div class="stat-label">总文章数</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{{ Math.round(stats.totalWords / 1000) }}K</div>
      <div class="stat-label">总字数</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{{ stats.avgWords }}</div>
      <div class="stat-label">平均字数</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{{ stats.years }}</div>
      <div class="stat-label">活跃年份</div>
    </div>
  </div>

  <!-- 筛选控制 -->
  <div class="filter-controls">
    <div class="filter-section">
      <h4>📅 年份筛选</h4>
      <div class="year-buttons">
        <button
          v-for="year in years"
          :key="year"
          @click="filterByYear(year)"
          class="filter-btn"
          :class="{ active: selectedYear === year.toString() }"
        >
          {{ year }}年
          <span class="count">({{ Object.values(groupedPosts[year]).flat().length }})</span>
        </button>
      </div>
    </div>

    <div v-if="selectedYear" class="filter-section">
      <h4>📆 月份筛选</h4>
      <div class="month-buttons">
        <button
          v-for="month in months"
          :key="month"
          @click="filterByMonth(month)"
          class="filter-btn"
          :class="{ active: selectedMonth === month.toString() }"
        >
          {{ formatMonth(month) }}
          <span class="count">({{ groupedPosts[selectedYear][month].length }})</span>
        </button>
      </div>
    </div>

    <div v-if="selectedYear || selectedMonth" class="clear-filter">
      <button @click="clearFilter" class="clear-btn">
        ✕ 清除筛选
      </button>
    </div>

  </div>

  <!-- 当前筛选提示 -->
  <div v-if="selectedYear || selectedMonth" class="filter-info">
    <p>
      正在显示
      <span v-if="selectedYear" class="filter-term">{{ selectedYear }}年</span>
      <span v-if="selectedMonth" class="filter-term">{{ formatMonth(parseInt(selectedMonth)) }}</span>
      的文章 ({{ filteredPosts.length }}篇)
    </p>
  </div>

  <!-- 文章列表 -->
  <div class="posts-section">
    <div v-if="filteredPosts.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>该时间段暂无文章</h3>
      <p>尝试选择其他时间段或清除筛选查看所有文章</p>
    </div>

    <div v-else class="posts-list">
      <article
        v-for="post in filteredPosts"
        :key="post.title"
        class="post-item"
      >
        <div class="post-date-badge">
          <div class="date-day">{{ new Date(post.date).getDate() }}</div>
          <div class="date-month">{{ formatMonth(new Date(post.date).getMonth() + 1) }}</div>
        </div>

        <div class="post-content">
          <div class="post-header">
            <h3 class="post-title">
              <a :href="post.link" class="post-link">{{ post.title }}</a>
            </h3>
            <div class="post-category">
              {{ getCategoryIcon(post.category) }} {{ post.category }}
            </div>
          </div>

          <div class="post-meta">
            <time class="post-full-date">{{ formatDate(post.date) }}</time>
            <span class="post-word-count">{{ post.wordCount }}字</span>
            <span class="post-reading-time">{{ getReadingTime(post.wordCount) }}分钟阅读</span>
          </div>
        </div>
      </article>
    </div>

  </div>

  <!-- 时间轴视图 -->
  <div class="timeline-section">
    <h3>📊 时间轴视图</h3>
    <div class="timeline">
      <div
        v-for="yearData in timeline"
        :key="yearData.year"
        class="timeline-year"
      >
        <div class="year-header" @click="filterByYear(yearData.year)">
          <h4>{{ yearData.year }}年</h4>
          <span class="year-count">{{ Object.values(groupedPosts[yearData.year]).flat().length }}篇</span>
        </div>
        
        <div class="timeline-months">
          <div
            v-for="monthData in yearData.months"
            :key="monthData.month"
            class="timeline-month"
            @click="selectedYear = yearData.year.toString(); filterByMonth(monthData.month)"
          >
            <div class="month-name">{{ formatMonth(monthData.month) }}</div>
            <div class="month-count">{{ monthData.count }}篇</div>
            <div class="month-bar">
              <div 
                class="month-fill"
                :style="{ width: (monthData.count / Math.max(...Object.values(groupedPosts[yearData.year]).map(posts => posts.length)) * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style scoped>
.archive-intro {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.archive-intro p {
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

.archive-container {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-number {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.filter-controls {
  margin-bottom: 2rem;
}

.filter-section {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.filter-section h4 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.year-buttons,
.month-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.filter-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.count {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

.clear-filter {
  text-align: center;
  margin-top: 1rem;
}

.clear-btn {
  padding: 0.5rem 1.5rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.filter-info {
  padding: 1rem;
  background: var(--vp-c-tip-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-brand-soft);
  margin-bottom: 1.5rem;
  text-align: center;
}

.filter-term {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.posts-section {
  margin-bottom: 3rem;
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

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.post-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-date-badge {
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  background: var(--vp-c-brand-1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.date-day {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  font-size: 0.75rem;
  opacity: 0.9;
}

.post-content {
  flex: 1;
  min-width: 0;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.post-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  flex: 1;
}

.post-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.3s ease;
}

.post-link:hover {
  color: var(--vp-c-brand-1);
}

.post-category {
  flex-shrink: 0;
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  flex-wrap: wrap;
}

.timeline-section {
  margin-top: 3rem;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.timeline-section h3 {
  margin: 0 0 1.5rem 0;
  color: var(--vp-c-text-1);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-year {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
}

.year-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.year-header:hover {
  background: var(--vp-c-bg-soft);
}

.year-header h4 {
  margin: 0;
  color: var(--vp-c-text-1);
}

.year-count {
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
  background: var(--vp-c-bg-soft);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.timeline-months {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.timeline-month {
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.timeline-month:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.month-name {
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.month-count {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.5rem;
}

.month-bar {
  height: 4px;
  background: var(--vp-c-divider);
  border-radius: 2px;
  overflow: hidden;
}

.month-fill {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 2px;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .post-item {
    flex-direction: column;
    text-align: center;
  }
  
  .post-date-badge {
    align-self: center;
  }
  
  .post-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .post-meta {
    justify-content: center;
  }
  
  .filter-section {
    padding: 1rem;
  }
  
  .year-buttons,
  .month-buttons {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stats-panel {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .timeline-months {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-btn {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
}
</style>

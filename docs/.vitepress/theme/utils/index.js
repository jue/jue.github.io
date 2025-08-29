/**
 * 博客主题工具函数集合
 * 提供各种实用的工具函数和辅助方法
 */

// import { blogConfig } from '../../config/blog.js'

// 日期格式化函数
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  
  const formatMap = {
    'YYYY': year,
    'MM': month,
    'DD': day,
    'HH': hour,
    'mm': minute,
    'ss': second
  }
  
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => formatMap[match])
}

// 相对时间格式化
export function formatRelativeTime(date) {
  if (!date) return ''
  
  const now = new Date()
  const target = new Date(date)
  const diff = now - target
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)} 分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)} 天前`
  } else if (diff < month) {
    return `${Math.floor(diff / week)} 周前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)} 个月前`
  } else {
    return `${Math.floor(diff / year)} 年前`
  }
}

// 阅读时间计算
export function calculateReadingTime(content, options = {}) {
  const config = { wordsPerMinute: 200, ...options }
  
  if (!content) return { minutes: 0, words: 0 }
  
  // 移除 HTML 标签
  const textContent = content.replace(/<[^>]*>/g, '')
  
  // 计算字数（中英文混合）
  const chineseWords = (textContent.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (textContent.match(/\b\w+\b/g) || []).length
  const totalWords = chineseWords + englishWords
  
  // 计算代码块
  const codeBlocks = content.match(/```[\s\S]*?```/g) || []
  const codeWords = config.includeCodeBlocks 
    ? codeBlocks.reduce((acc, block) => acc + block.length / 5, 0)
    : 0
  
  // 计算图片
  const images = content.match(/!\[[^\]]*\]\([^)]*\)/g) || []
  const imageTime = config.includeImages 
    ? images.length * config.imageReadingTime
    : 0
  
  const totalReadingWords = totalWords + codeWords
  const minutes = Math.ceil(totalReadingWords / config.wordsPerMinute + imageTime)
  
  return {
    minutes: Math.max(1, minutes),
    words: totalWords
  }
}

// 生成摘要
export function generateExcerpt(content, options = {}) {
  const config = { maxLength: 150, ...options }
  
  if (!content) return ''
  
  // 检查是否有手动摘要分隔符
  const separatorIndex = content.indexOf(config.separator)
  if (separatorIndex !== -1) {
    return content.substring(0, separatorIndex).trim()
  }
  
  // 自动生成摘要
  let excerpt = content
  
  // 移除 HTML 标签
  if (config.stripTags) {
    excerpt = excerpt.replace(/<[^>]*>/g, '')
  }
  
  // 移除 Markdown 语法
  excerpt = excerpt
    .replace(/^#{1,6}\s+/gm, '') // 标题
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 粗体
    .replace(/\*([^*]+)\*/g, '$1') // 斜体
    .replace(/`([^`]+)`/g, '$1') // 行内代码
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 图片
  
  // 截取指定长度
  if (excerpt.length > config.length) {
    excerpt = excerpt.substring(0, config.length) + '...'
  }
  
  return excerpt.trim()
}

// 文本高亮
export function highlightText(text, query) {
  if (!query || !text) return text
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// 转义正则表达式特殊字符
export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 防抖函数
export function debounce(func, wait, immediate = false) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

// 节流函数
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// URL 参数处理
export function getUrlParams(url = window.location.href) {
  const params = new URLSearchParams(new URL(url).search)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

export function setUrlParams(params, replace = false) {
  const url = new URL(window.location.href)
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key)
    } else {
      url.searchParams.set(key, value)
    }
  })
  
  if (replace) {
    window.history.replaceState({}, '', url.toString())
  } else {
    window.history.pushState({}, '', url.toString())
  }
}

// 滚动到元素
export function scrollToElement(element, options = {}) {
  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    offset: 80 // 顶部偏移量
  }
  
  const config = { ...defaultOptions, ...options }
  
  if (typeof element === 'string') {
    element = document.querySelector(element)
  }
  
  if (!element) return
  
  const elementTop = element.getBoundingClientRect().top + window.pageYOffset
  const offsetTop = elementTop - config.offset
  
  window.scrollTo({
    top: offsetTop,
    behavior: config.behavior
  })
}

// 复制到剪贴板
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      textArea.remove()
      return result
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

// 图片懒加载
export function lazyLoadImages(container = document) {
  const images = container.querySelectorAll('img[data-src]')
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove('lazy')
          img.classList.add('loaded')
          observer.unobserve(img)
        }
      })
    })
    
    images.forEach(img => imageObserver.observe(img))
  } else {
    // 降级方案
    images.forEach(img => {
      img.src = img.dataset.src
      img.classList.remove('lazy')
      img.classList.add('loaded')
    })
  }
}

// 本地存储工具
export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('读取本地存储失败:', error)
      return defaultValue
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('写入本地存储失败:', error)
      return false
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('删除本地存储失败:', error)
      return false
    }
  },
  
  clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('清空本地存储失败:', error)
      return false
    }
  }
}

// 主题切换
export function toggleTheme() {
  const html = document.documentElement
  const currentTheme = html.classList.contains('dark') ? 'dark' : 'light'
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  
  html.classList.remove(currentTheme)
  html.classList.add(newTheme)
  
  storage.set('theme', newTheme)
  
  // 触发主题切换事件
  window.dispatchEvent(new CustomEvent('theme-changed', {
    detail: { theme: newTheme, previousTheme: currentTheme }
  }))
  
  return newTheme
}

// 获取当前主题
export function getCurrentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

// 设置主题
export function setTheme(theme) {
  const html = document.documentElement
  const currentTheme = getCurrentTheme()
  
  if (theme === currentTheme) return
  
  html.classList.remove('light', 'dark')
  html.classList.add(theme)
  
  storage.set('theme', theme)
  
  window.dispatchEvent(new CustomEvent('theme-changed', {
    detail: { theme, previousTheme: currentTheme }
  }))
}

// 初始化主题
export function initTheme() {
  const savedTheme = storage.get('theme')
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const theme = savedTheme || systemTheme
  
  setTheme(theme)
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!storage.get('theme')) {
      setTheme(e.matches ? 'dark' : 'light')
    }
  })
}

// 文章相关性计算
export function calculatePostSimilarity(post1, post2, options = {}) {
  const config = {
    tagWeight: 0.4,
    categoryWeight: 0.3,
    contentWeight: 0.2,
    timeWeight: 0.1,
    ...options
  }
  
  let similarity = 0
  
  // 标签相似度
  if (post1.tags && post2.tags) {
    const tags1 = new Set(post1.tags)
    const tags2 = new Set(post2.tags)
    const intersection = new Set([...tags1].filter(x => tags2.has(x)))
    const union = new Set([...tags1, ...tags2])
    const tagSimilarity = union.size > 0 ? intersection.size / union.size : 0
    similarity += tagSimilarity * config.tagWeight
  }
  
  // 分类相似度
  if (post1.category && post2.category) {
    const categorySimilarity = post1.category === post2.category ? 1 : 0
    similarity += categorySimilarity * config.categoryWeight
  }
  
  // 内容相似度（简单的关键词匹配）
  if (post1.content && post2.content) {
    const words1 = extractKeywords(post1.content)
    const words2 = extractKeywords(post2.content)
    const wordsSet1 = new Set(words1)
    const wordsSet2 = new Set(words2)
    const intersection = new Set([...wordsSet1].filter(x => wordsSet2.has(x)))
    const union = new Set([...wordsSet1, ...wordsSet2])
    const contentSimilarity = union.size > 0 ? intersection.size / union.size : 0
    similarity += contentSimilarity * config.contentWeight
  }
  
  // 时间相似度
  if (post1.date && post2.date) {
    const date1 = new Date(post1.date)
    const date2 = new Date(post2.date)
    const timeDiff = Math.abs(date1 - date2)
    const maxDiff = 365 * 24 * 60 * 60 * 1000 // 一年
    const timeSimilarity = Math.max(0, 1 - timeDiff / maxDiff)
    similarity += timeSimilarity * config.timeWeight
  }
  
  return Math.min(1, similarity)
}

// 提取关键词
function extractKeywords(text, maxWords = 20) {
  if (!text) return []
  
  // 移除 HTML 标签和 Markdown 语法
  const cleanText = text
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`\[\]()]/g, '')
    .toLowerCase()
  
  // 分词（简单的空格分割）
  const words = cleanText
    .split(/\s+/)
    .filter(word => word.length > 2 && !isStopWord(word))
  
  // 词频统计
  const wordCount = {}
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })
  
  // 按频率排序并返回前 N 个
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxWords)
    .map(([word]) => word)
}

// 停用词检查（简化版）
function isStopWord(word) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'
  ])
  return stopWords.has(word)
}

// 搜索算法
export function searchPosts(posts, query, options = {}) {
  const config = {
    algorithm: 'hybrid',
    weights: {
      title: 10,
      tags: 3,
      category: 2,
      description: 1,
      content: 0.5
    },
    minScore: 0.1,
    maxResults: 20,
    ...options
  }
  
  if (!query || !posts) return []
  
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0)
  
  const results = posts.map(post => {
    let score = 0
    
    // 标题匹配
    if (post.title) {
      const titleLower = post.title.toLowerCase()
      const titleScore = calculateTextScore(titleLower, queryWords)
      score += titleScore * config.weights.title
    }
    
    // 标签匹配
    if (post.tags && post.tags.length > 0) {
      const tagsText = post.tags.join(' ').toLowerCase()
      const tagsScore = calculateTextScore(tagsText, queryWords)
      score += tagsScore * config.weights.tags
    }
    
    // 分类匹配
    if (post.category) {
      const categoryLower = post.category.toLowerCase()
      const categoryScore = calculateTextScore(categoryLower, queryWords)
      score += categoryScore * config.weights.category
    }
    
    // 描述匹配
    if (post.description) {
      const descriptionLower = post.description.toLowerCase()
      const descriptionScore = calculateTextScore(descriptionLower, queryWords)
      score += descriptionScore * config.weights.description
    }
    
    // 内容匹配
    if (post.content) {
      const contentLower = post.content.toLowerCase()
      const contentScore = calculateTextScore(contentLower, queryWords)
      score += contentScore * config.weights.content
    }
    
    return {
      ...post,
      searchScore: score
    }
  })
  
  return results
    .filter(post => post.searchScore >= config.minScore)
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, config.maxResults)
}

// 计算文本匹配分数
function calculateTextScore(text, queryWords) {
  if (!text || !queryWords.length) return 0
  
  let score = 0
  
  queryWords.forEach(word => {
    // 完全匹配
    if (text.includes(word)) {
      score += 1
    }
    
    // 部分匹配
    const regex = new RegExp(escapeRegExp(word), 'gi')
    const matches = text.match(regex)
    if (matches) {
      score += matches.length * 0.5
    }
  })
  
  return score
}

// 导出所有工具函数
export default {
  formatDate,
  formatRelativeTime,
  calculateReadingTime,
  generateExcerpt,
  highlightText,
  escapeRegExp,
  debounce,
  throttle,
  getUrlParams,
  setUrlParams,
  scrollToElement,
  copyToClipboard,
  lazyLoadImages,
  storage,
  toggleTheme,
  getCurrentTheme,
  setTheme,
  initTheme,
  calculatePostSimilarity,
  searchPosts
}
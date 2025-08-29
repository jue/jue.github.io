<template>
  <article class="blog-post-card">
    <div class="post-header">
      <h3 class="post-title">
        <a :href="postUrl" class="title-link">{{ post.title }}</a>
      </h3>

      <div class="post-meta">
        <time class="post-date" :datetime="post.created_at">
          {{ formatDate(post.created_at) }}
        </time>
        <span class="post-author" v-if="post.author">
          <span class="author-icon">👤</span>
          {{ post.author.login }}
        </span>
        <span class="reading-time" v-if="readingTime">
          <span class="time-icon">⏱️</span>
          {{ readingTime }}分钟阅读
        </span>
      </div>
    </div>

    <div class="post-content">
      <p class="post-excerpt" v-if="showExcerpt && excerpt">
        {{ excerpt }}
      </p>

      <div class="post-tags" v-if="post.labels && post.labels.length > 0">
        <span
          v-for="label in post.labels"
          :key="label.name"
          class="tag"
          :class="getTagClass(label.name)"
        >
          {{ getTagIcon(label.name) }} {{ label.name }}
        </span>
      </div>
    </div>

    <div class="post-footer">
      <a :href="postUrl" class="read-more-btn">
        阅读全文 <span class="arrow">→</span>
      </a>

      <div class="post-stats">
        <span class="word-count" v-if="wordCount"> {{ wordCount }}字 </span>
        <span class="update-time" v-if="post.updated_at !== post.created_at">
          更新于 {{ formatDate(post.updated_at) }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  showExcerpt: {
    type: Boolean,
    default: true
  },
  excerptLength: {
    type: Number,
    default: 200
  }
})

// 计算文章URL
const postUrl = computed(() => {
  return `/posts/${encodeURIComponent(props.post.title)}`
})

// 计算摘要
const excerpt = computed(() => {
  if (!props.post.body) return ''
  const text = props.post.body.replace(/[#*`\[\]]/g, '').trim()
  return text.length > props.excerptLength
    ? text.substring(0, props.excerptLength) + '...'
    : text
})

// 计算字数
const wordCount = computed(() => {
  if (!props.post.body) return 0
  return props.post.body.replace(/\s/g, '').length
})

// 计算阅读时间（按每分钟200字计算）
const readingTime = computed(() => {
  const words = wordCount.value
  return Math.ceil(words / 200)
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

// 获取标签图标
const getTagIcon = (tagName) => {
  const icons = {
    技术教程: '🔧',
    开发相关: '💻',
    Proxmox: '🖥️',
    网络: '🌐',
    Supabase: '🗄️',
    JavaScript: '📜',
    Vue: '💚',
    其他: '📄'
  }
  return icons[tagName] || '🏷️'
}

// 获取标签样式类
const getTagClass = (tagName) => {
  const classes = {
    技术教程: 'tag-tutorial',
    开发相关: 'tag-development',
    Proxmox: 'tag-proxmox',
    网络: 'tag-network',
    Supabase: 'tag-supabase',
    JavaScript: 'tag-javascript',
    Vue: 'tag-vue'
  }
  return classes[tagName] || 'tag-default'
}
</script>

<style scoped>
.blog-post-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.blog-post-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.post-header {
  margin-bottom: 1rem;
}

.post-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.title-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.3s ease;
}

.title-link:hover {
  color: var(--vp-c-brand-1);
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  align-items: center;
}

.post-date,
.post-author,
.reading-time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.author-icon,
.time-icon {
  font-size: 0.75rem;
}

.post-content {
  margin-bottom: 1rem;
}

.post-excerpt {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 1rem 0;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
}

.tag:hover {
  transform: scale(1.05);
}

.tag-tutorial {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.tag-development {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.tag-proxmox {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.tag-network {
  background: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
  color: #a855f7;
}

.tag-supabase {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.tag-javascript {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}

.tag-vue {
  background: rgba(52, 211, 153, 0.1);
  border-color: rgba(52, 211, 153, 0.3);
  color: #34d399;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand-1);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.read-more-btn:hover {
  background: var(--vp-c-brand-dark);
  transform: translateX(4px);
}

.arrow {
  transition: transform 0.3s ease;
}

.read-more-btn:hover .arrow {
  transform: translateX(4px);
}

.post-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.word-count,
.update-time {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .blog-post-card {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .post-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .post-stats {
    align-items: flex-start;
  }

  .read-more-btn {
    align-self: flex-start;
  }
}
</style>

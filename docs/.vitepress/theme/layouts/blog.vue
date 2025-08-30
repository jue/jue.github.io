<template>
  <div class="blog-layout">
    <!-- 自定义头部 -->
    <header class="blog-header">
      <div class="container">
        <h1 class="blog-title">{{ frontmatter.title }}</h1>
        <p class="blog-description">{{ frontmatter.description }}</p>
        <div class="blog-meta">
          <span v-if="frontmatter.date"
            >📅 {{ formatDate(frontmatter.date) }}</span
          >
          <span v-if="frontmatter.author">👤 {{ frontmatter.author }}</span>
          <span v-if="frontmatter.category">🏷️ {{ frontmatter.category }}</span>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="blog-main">
      <div class="container">
        <!-- 侧边栏 -->
        <aside class="blog-sidebar">
          <div class="sidebar-widget">
            <h3>📚 目录</h3>
            <nav class="toc">
              <ul>
                <li v-for="heading in headings" :key="heading.id">
                  <a
                    :href="`#${heading.id}`"
                    :class="{ active: activeHeading === heading.id }"
                  >
                    {{ heading.text }}
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div class="sidebar-widget">
            <h3>🏷️ 标签</h3>
            <div class="tags">
              <span v-for="tag in frontmatter.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </aside>

        <!-- 文章内容 -->
        <article class="vp-doc">
          <Content />
        </article>
      </div>
    </main>

    <!-- 自定义页脚 -->
    <footer class="blog-footer">
      <div class="container">
        <div class="footer-content">
          <p>© 2024 NIPAO 技术博客</p>
          <div class="footer-links">
            <a href="/">首页</a>
            <a href="/blog">博客</a>
            <a href="/about">关于11</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

// 获取页面标题
const headings = ref([])
const activeHeading = ref('')

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 监听滚动，更新活动标题
const updateActiveHeading = () => {
  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const scrollTop = window.scrollY

  for (let i = headingElements.length - 1; i >= 0; i--) {
    const element = headingElements[i]
    const rect = element.getBoundingClientRect()

    if (rect.top <= 100) {
      activeHeading.value = element.id
      break
    }
  }
}

onMounted(() => {
  // 获取所有标题
  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headings.value = Array.from(headingElements).map((el) => ({
    id: el.id,
    text: el.textContent,
    level: parseInt(el.tagName.charAt(1))
  }))

  // 添加滚动监听
  window.addEventListener('scroll', updateActiveHeading)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})
</script>

<template>
  <div class="project-layout">
    <!-- 项目头部 -->
    <header class="project-header">
      <div class="container">
        <div class="project-hero">
          <div class="project-icon" v-if="frontmatter.icon">
            <span class="icon">{{ frontmatter.icon }}</span>
          </div>
          <div class="project-info">
            <h1 class="project-title">{{ frontmatter.title }}</h1>
            <p class="project-description">{{ frontmatter.description }}</p>
            <div class="project-meta">
              <span
                v-if="frontmatter.status"
                class="status"
                :class="frontmatter.status"
              >
                {{ getStatusText(frontmatter.status) }}
              </span>
              <span v-if="frontmatter.tech" class="tech">
                🛠️ {{ frontmatter.tech }}
              </span>
              <span v-if="frontmatter.date" class="date">
                📅 {{ formatDate(frontmatter.date) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 项目链接 -->
        <div v-if="frontmatter.links" class="project-links">
          <a
            v-for="link in frontmatter.links"
            :key="link.name"
            :href="link.url"
            :target="link.external ? '_blank' : '_self'"
            class="project-link"
          >
            {{ link.name }}
            <span v-if="link.external" class="external-icon">↗</span>
          </a>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="project-main">
      <div class="container">
        <!-- 项目概览 -->
        <section v-if="frontmatter.features" class="project-overview">
          <h2>✨ 项目特色</h2>
          <div class="features-grid">
            <div
              v-for="feature in frontmatter.features"
              :key="feature.title"
              class="feature-card"
            >
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </section>

        <!-- 项目内容 -->
        <div class="">
          <section class="vp-doc max-w-3xl mx-auto">
            <Content />
          </section>
        </div>

        <!-- 技术栈 -->
        <section v-if="frontmatter.techStack" class="tech-stack">
          <h2>🛠️ 技术栈</h2>
          <div class="tech-grid">
            <div
              v-for="tech in frontmatter.techStack"
              :key="tech.name"
              class="tech-item"
            >
              <span class="tech-icon">{{ tech.icon }}</span>
              <span class="tech-name">{{ tech.name }}</span>
            </div>
          </div>
        </section>

        <!-- 项目截图 -->
        <section v-if="frontmatter.screenshots" class="screenshots">
          <h2>📸 项目截图</h2>
          <div class="screenshots-grid">
            <div
              v-for="screenshot in frontmatter.screenshots"
              :key="screenshot.alt"
              class="screenshot-item"
            >
              <img :src="screenshot.src" :alt="screenshot.alt" />
              <p class="screenshot-caption">{{ screenshot.caption }}</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 项目页脚 -->
    <footer class="project-footer">
      <div class="container">
        <div class="footer-content">
          <div class="project-stats">
            <div v-if="frontmatter.stats" class="stats-grid">
              <div
                v-for="stat in frontmatter.stats"
                :key="stat.label"
                class="stat-item"
              >
                <span class="stat-number">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>

          <div class="footer-actions">
            <a href="/projects" class="back-link">← 返回项目列表</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    active: '进行中',
    completed: '已完成',
    archived: '已归档',
    planning: '规划中'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.project-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 项目头部 */
.project-header {
  background: linear-gradient(
    135deg,
    var(--vp-c-brand-soft) 0%,
    var(--vp-c-bg-soft) 100%
  );
  padding: 3rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.project-hero {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.project-icon {
  flex-shrink: 0;
}

.icon {
  font-size: 4rem;
  display: block;
}

.project-info {
  flex: 1;
}

.project-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem 0;
}

.project-description {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

.project-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status.active {
  background: #10b981;
  color: white;
}

.status.completed {
  background: #3b82f6;
  color: white;
}

.status.archived {
  background: #6b7280;
  color: white;
}

.status.planning {
  background: #f59e0b;
  color: white;
}

.tech,
.date {
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
}

/* 项目链接 */
.project-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand-1);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.project-link:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
}

.external-icon {
  font-size: 0.875rem;
}

/* 主要内容 */
.project-main {
  flex: 1;
  padding: 2rem 0;
}

.project-main section {
  margin-bottom: 3rem;
}

.project-main h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-divider);
}

/* 项目概览 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem 0;
}

.feature-card p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

/* 项目内容 */
.project-content {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 2rem;
}

/* 技术栈 */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tech-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.tech-icon {
  font-size: 1.5rem;
}

.tech-name {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

/* 项目截图 */
.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.screenshot-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

.screenshot-item img {
  width: 100%;
  height: auto;
  display: block;
}

.screenshot-caption {
  padding: 1rem;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  text-align: center;
}

/* 项目页脚 */
.project-footer {
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.stats-grid {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.back-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--vp-c-brand-dark);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .project-hero {
    flex-direction: column;
    text-align: center;
  }

  .project-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .screenshots-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    justify-content: center;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>

---
layout: page
title: 标签
description: 按标签浏览文章
---

<script setup>
import { ref } from 'vue'
const loading = ref(false)
const tags = ref([
  { name: '技术教程', count: 3, color: '#3b82f6' },
  { name: '开发相关', count: 2, color: '#10b981' }
])
const selectedTag = ref('')
const filteredPosts = ref([])
</script>

# 🏷️ 标签云

<div class="tags-intro">
  <p>通过标签快速找到您感兴趣的技术文章</p>
  <p>点击标签查看相关文章，再次点击取消筛选</p>
</div>

<div v-if="loading" class="loading-container">
  <div class="loading-spinner"></div>
  <p>正在加载标签...</p>
</div>

<div v-else>
  <div class="tags-cloud">
    <div 
      v-for="tag in tags" 
      :key="tag.name"
      class="tag-item"
      :style="{ backgroundColor: tag.color }"
      @click="selectedTag = tag.name"
    >
      <span class="tag-name">{{ tag.name }}</span>
      <span class="tag-count">{{ tag.count }}</span>
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
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.tag-item:hover {
  transform: scale(1.05);
}
</style>

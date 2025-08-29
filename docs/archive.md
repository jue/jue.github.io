---
layout: page
title: 归档
description: 按时间浏览所有文章
---

<script setup>
import { ref } from 'vue'
const loading = ref(false)
</script>

# 📅 文章归档

<div class="archive-intro">
  <p>按时间顺序浏览所有文章，回顾技术学习的每一步足迹</p>
  <p>点击年份或月份进行筛选，探索感兴趣的时间段内容</p>
</div>

<div v-if="loading" class="loading-container">
  <div class="loading-spinner"></div>
  <p>正在加载归档...</p>
</div>

<div v-else class="archive-container">
  <div class="stats-panel">
    <div class="stat-card">
      <div class="stat-number">5</div>
      <div class="stat-label">总文章数</div>
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
}
</style>

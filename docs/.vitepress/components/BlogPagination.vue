<template>
  <nav class="blog-pagination" v-if="totalPages > 1">
    <div class="pagination-info">
      <span class="page-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>
      <span class="item-info"> 共 {{ totalItems }} 篇文章 </span>
    </div>

    <div class="pagination-controls">
      <button
        class="pagination-btn prev-btn"
        :disabled="currentPage <= 1"
        @click="changePage(currentPage - 1)"
        :aria-label="'上一页'"
      >
        <span class="btn-icon">←</span>
        <span class="btn-text">上一页</span>
      </button>

      <div class="page-numbers">
        <!-- 第一页 -->
        <button
          v-if="showFirstPage"
          class="page-btn"
          :class="{ active: currentPage === 1 }"
          @click="changePage(1)"
          :aria-label="'第1页'"
        >
          1
        </button>

        <!-- 左侧省略号 -->
        <span v-if="showLeftEllipsis" class="ellipsis">...</span>

        <!-- 中间页码 -->
        <button
          v-for="page in visiblePages"
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
          :aria-label="'第' + page + '页'"
        >
          {{ page }}
        </button>

        <!-- 右侧省略号 -->
        <span v-if="showRightEllipsis" class="ellipsis">...</span>

        <!-- 最后一页 -->
        <button
          v-if="showLastPage"
          class="page-btn"
          :class="{ active: currentPage === totalPages }"
          @click="changePage(totalPages)"
          :aria-label="'第' + totalPages + '页'"
        >
          {{ totalPages }}
        </button>
      </div>

      <button
        class="pagination-btn next-btn"
        :disabled="currentPage >= totalPages"
        @click="changePage(currentPage + 1)"
        :aria-label="'下一页'"
      >
        <span class="btn-text">下一页</span>
        <span class="btn-icon">→</span>
      </button>
    </div>

    <!-- 快速跳转 -->
    <div class="quick-jump" v-if="totalPages > 10">
      <span class="jump-label">跳转到</span>
      <input
        v-model.number="jumpPage"
        type="number"
        :min="1"
        :max="totalPages"
        class="jump-input"
        @keyup.enter="handleJump"
        :placeholder="'1-' + totalPages"
      />
      <button class="jump-btn" @click="handleJump" :disabled="!isValidJumpPage">
        确定
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  maxVisible: {
    type: Number,
    default: 7
  }
})

const emit = defineEmits(['page-change'])

// 快速跳转页码
const jumpPage = ref('')

// 可见页码范围
const visiblePages = computed(() => {
  const { currentPage, totalPages, maxVisible } = props
  const pages = []

  let start = Math.max(2, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages - 1, start + maxVisible - 1)

  // 调整开始位置
  if (end - start + 1 < maxVisible) {
    start = Math.max(2, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i)
    }
  }

  return pages
})

// 是否显示第一页
const showFirstPage = computed(() => {
  return (
    props.totalPages > 1 && (props.currentPage > 3 || visiblePages.value[0] > 2)
  )
})

// 是否显示最后一页
const showLastPage = computed(() => {
  return (
    props.totalPages > 1 &&
    (props.currentPage < props.totalPages - 2 ||
      visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1)
  )
})

// 是否显示左侧省略号
const showLeftEllipsis = computed(() => {
  return visiblePages.value.length > 0 && visiblePages.value[0] > 2
})

// 是否显示右侧省略号
const showRightEllipsis = computed(() => {
  return (
    visiblePages.value.length > 0 &&
    visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
  )
})

// 验证跳转页码
const isValidJumpPage = computed(() => {
  const page = Number(jumpPage.value)
  return page >= 1 && page <= props.totalPages && page !== props.currentPage
})

// 切换页码
const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}

// 处理快速跳转
const handleJump = () => {
  const page = Number(jumpPage.value)
  if (isValidJumpPage.value) {
    changePage(page)
    jumpPage.value = ''
  }
}
</script>

<style scoped>
.blog-pagination {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.pagination-info {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  text-align: center;
}

.page-info {
  font-weight: 500;
}

.item-info {
  color: var(--vp-c-text-3);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 1rem;
  line-height: 1;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0 0.5rem;
}

.page-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.page-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ellipsis {
  padding: 0 0.5rem;
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
}

.quick-jump {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.jump-label {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.jump-input {
  width: 4rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  font-size: 0.875rem;
  text-align: center;
}

.jump-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.jump-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.jump-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
  border-color: var(--vp-c-brand-dark);
}

.jump-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .blog-pagination {
    padding: 1rem;
  }

  .pagination-info {
    flex-direction: column;
    gap: 0.25rem;
  }

  .pagination-controls {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .page-numbers {
    order: -1;
    margin: 0;
    flex-wrap: wrap;
    justify-content: center;
  }

  .page-btn {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }

  .pagination-btn {
    padding: 0.5rem;
  }

  .btn-text {
    display: none;
  }

  .quick-jump {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-numbers {
    gap: 0.125rem;
  }

  .page-btn {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.7rem;
  }
}
</style>

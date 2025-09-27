<script setup lang="ts">
import Date from './Date.vue'
import Author from './Author.vue'
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from './posts.data.js'

const { frontmatter: data } = useData()

const route = useRoute()

function normalize(path: string) {
  return path.replace(/(index)?\.html$/, '').replace(/\/$/, '')
}

const currentIndex = computed(() => {
  const normalizedRoute = normalize(route.path)
  return posts.findIndex((p) => normalize(p.url) === normalizedRoute)
})

const currentPost = computed(() => {
  const index = currentIndex.value
  return index >= 0 ? posts[index] : undefined
})

function fallbackDate() {
  const raw = data.value?.date
  const parsed = new globalThis.Date(raw || globalThis.Date.now())
  if (Number.isNaN(parsed.getTime())) {
    parsed.setTime(globalThis.Date.now())
  }
  parsed.setUTCHours(12)
  return {
    time: +parsed,
    string: parsed.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

// use the customData date which contains pre-resolved date info
const date = computed(() => currentPost.value?.date ?? fallbackDate())
const nextPost = computed(() => {
  const index = currentIndex.value
  return index > 0 ? posts[index - 1] : undefined
})
const prevPost = computed(() => {
  const index = currentIndex.value
  return index >= 0 && index + 1 < posts.length ? posts[index + 1] : undefined
})
</script>

<template>
  <article class="xl:divide-y xl:divide-gray-200 dark:xl:divide-slate-200/5">
    <header class="pt-6 xl:pb-10 space-y-1 text-center">
      <Date :date="date" />
      <h1
        class="text-3xl leading-9 font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl sm:leading-10 md:text-5xl md:leading-14"
      >
        {{ data.title }}
      </h1>
    </header>

    <div
      class="divide-y xl:divide-y-0 divide-gray-200 dark:divide-slate-200/5 xl:grid xl:grid-cols-4 xl:gap-x-10 pb-16 xl:pb-20"
      style="grid-template-rows: auto 1fr"
    >
      <Author />
      <div
        class="divide-y divide-gray-200 dark:divide-slate-200/5 xl:pb-0 xl:col-span-3 xl:row-span-2"
      >
        <Content class="prose dark:prose-invert max-w-none pt-10 pb-8" />
      </div>

      <footer
        class="text-sm font-medium leading-5 divide-y divide-gray-200 dark:divide-slate-200/5 xl:col-start-1 xl:row-start-2"
      >
        <div v-if="nextPost" class="py-8">
          <h2
            class="text-xs tracking-wide uppercase text-gray-500 dark:text-white"
          >
            Next Article
          </h2>
          <div class="link">
            <a :href="nextPost.url">{{ nextPost.title }}</a>
          </div>
        </div>
        <div v-if="prevPost" class="py-8">
          <h2
            class="text-xs tracking-wide uppercase text-gray-500 dark:text-white"
          >
            Previous Article
          </h2>
          <div class="link">
            <a :href="prevPost.url">{{ prevPost.title }}</a>
          </div>
        </div>
        <div class="pt-8">
          <a class="link" href="/">← 返回</a>
        </div>
      </footer>
    </div>
  </article>
</template>

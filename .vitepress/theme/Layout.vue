<script setup lang="ts">
import { useData } from 'vitepress'
import Home from './Home.vue'
import Article from './Article.vue'
import NotFound from './NotFound.vue'

const { page, frontmatter } = useData()
const { theme } = useData()
</script>

<template>
  <div class="antialiased dark:bg-slate-900">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <nav class="flex justify-between items-center py-10 font-bold">
        <a class="text-xl" href="/" aria-label="The Vue Point">
          <img
            class="inline-block mr-2"
            style="width: 36px; height: 31px"
            alt="logo"
            src="/logo.svg"
          />
          <span
            v-if="!frontmatter.index"
            class="hidden md:inline dark:text-white"
            >项码士</span
          >
        </a>
        <div class="text-sm text-gray-500 dark:text-white leading-5">
          <template v-for="(item, index) in theme.nav" :key="index">
            <a
              class="hover:text-gray-700 dark:hover:text-gray-200"
              :href="item.link"
              :target="item.target || undefined"
              :rel="item.rel || undefined"
              v-text="item.text"
            />
            <span class="mr-2 ml-2" v-if="index < theme.nav.length - 1">·</span>
          </template>
        </div>
      </nav>
    </div>
    <main class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <Home v-if="frontmatter.index" />
      <NotFound v-else-if="page.isNotFound" />
      <Article v-else />
    </main>
    <footer class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <div
        class="text-sm text-gray-500 dark:text-white leading-5 py-10 text-center"
      >
        <p>
          Copyright &copy; {{ new Date().getFullYear() }} 项码士. All rights
          reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

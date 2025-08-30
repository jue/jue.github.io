<template>
  <div class="max-w-5xl mx-auto px-6">
    <div class="py-12">
      <div class="text-4xl font-bold">项码士内容分享</div>
      <div class="text-neutral-800 text-lg mt-4">
        分享各种技术教程、开发经验和实用工具。
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg overflow-hidden"
    >
      <postCard
        v-for="post in postsData"
        :key="post.number"
        :post="post"
        :show-excerpt="true"
        :excerpt-length="120"
      />
    </div>
  </div>
</template>

<script setup>
import { data as postsData } from '../posts.data.js'
</script>

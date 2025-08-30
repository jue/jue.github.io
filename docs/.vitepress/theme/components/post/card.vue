<template>
  <div
    class="w-full p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
  >
    <img
      src="https://updates.kickstarter.com/content/images/size/w960/format/webp/2025/07/Pledge-Manager-Blog-Image.jpg"
      alt="Post Image"
      class="w-full h-40 object-cover rounded-lg mb-4"
    />
    <div class="text-green-400 text-sm mb-2">{{ post.category }}</div>
    <div class="text-xl font-bold mb-2 text-gray-900">{{ post.title }}</div>
    <div class="text-gray-600 text-sm mb-3 line-clamp-3">
      {{ post.excerpt }}
    </div>
    <div class="text-gray-500 text-xs flex items-center justify-between">
      <span>By {{ post.author }} — {{ formatDate(post.date) }}</span>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '../../utils'
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

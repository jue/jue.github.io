<script setup>
import { data as posts } from './posts.data.js'
</script>

<template>
  <ul>
    <li v-for="post of posts">
      <h2>
        <a :href="post.url">{{ post.title }}</a>
      </h2>
      <p>{{ new Date(post.date).toLocaleDateString() }}</p>
      <div v-if="post.excerpt" v-html="post.excerpt"></div>
    </li>
  </ul>
</template>

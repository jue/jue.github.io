<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <dl
    class="pt-6 pb-10 xl:pt-11 xl:border-b xl:border-gray-200 dark:xl:border-slate-200/5"
  >
    <dt class="sr-only">Authors</dt>
    <dd>
      <ul
        class="flex justify-center xl:block space-x-8 sm:space-x-12 xl:space-x-0 xl:space-y-8"
      >
        <li class="flex items-center space-x-2">
          <img
            src="https://p26-passport.byteacctimg.com/img/user-avatar/6916916304851dfaddc399c62dc8e974~300x300.image"
            alt="author image"
            class="w-10 h-10 rounded-full"
          />
          <dl class="text-sm font-medium leading-5 whitespace-nowrap">
            <dt class="sr-only">Name</dt>
            <dd class="text-gray-900 dark:text-white">项剑锋</dd>
            <dt class="sr-only">Twitter</dt>
            <dd>
              <a
                href="https://x.com/nipao"
                target="_blank"
                rel="noopnener noreferrer"
                class="link"
                >nipao</a
              >
            </dd>
          </dl>
        </li>
      </ul>
    </dd>
  </dl>
</template>

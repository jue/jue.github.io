import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BlogPostCard from '../components/BlogPostCard.vue'
import BlogPagination from '../components/BlogPagination.vue'

// 导入自定义样式
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('BlogPostCard', BlogPostCard)
    app.component('BlogPagination', BlogPagination)
  }
} satisfies Theme

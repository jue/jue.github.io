import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BlogPostCard from '../components/BlogPostCard.vue'
import BlogPagination from '../components/BlogPagination.vue'
import blog from './layouts/blog.vue'
import project from './layouts/ProjectLayout.vue'
import postsPage from './pages/posts.vue'
import postCard from './components/post/card.vue'
// 导入自定义样式
import './app.css'

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

    // 注册自定义布局
    app.component('blog', blog)
    app.component('project', project)

    // 专属页面
    app.component('postsPage', postsPage)
    app.component('postCard', postCard)
  }
} satisfies Theme

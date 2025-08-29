import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    server: {
      port: 3000,
      host: '0.0.0.0',
      open: true,
      allowedHosts: ['dev.jue.sh']
    }
  },
  lang: 'zh-CN',
  title: 'NIPAO',
  description: 'NIPAO分享',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: '博客', link: '/post' }
    ],

    // 侧边栏
    sidebar: [
      {
        text: '文章列表', // 侧边栏的分组标题
        items: [
          // 这里的 link 直接对应 docs 目录下的文件名（去掉 .md）
          { text: 'API 示例', link: '/api-examples' },
          { text: 'Markdown 示例', link: '/markdown-examples' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'NIPAO',
  description: 'NIPAO分享',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
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

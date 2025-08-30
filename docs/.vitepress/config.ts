import Tailwind from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'
import { generateSitemap } from './utils/sitemap'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'NIPAO 技术博客',
  description: '分享实用的技术教程与开发经验',
  base: '/',
  lang: 'zh-CN',

  // Head配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'meta',
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'NIPAO 技术博客' }],
    [
      'meta',
      { property: 'og:description', content: '分享实用的技术教程与开发经验' }
    ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'author', content: 'jue' }],
    [
      'meta',
      {
        name: 'keywords',
        content: '技术博客,教程,开发,Proxmox,Supabase,Vue,JavaScript'
      }
    ]
  ],

  // 主题配置
  themeConfig: {
    // 网站标题
    siteTitle: 'NIPAO',

    // Logo
    logo: '/favicon.ico',

    // 导航菜单
    nav: [
      { text: '首页', link: '/' },
      {
        text: '文章分类',
        items: [
          { text: '全部文章', link: '/posts' },
          { text: '技术教程', link: '/posts?category=技术教程' },
          { text: '开发相关', link: '/posts?category=开发相关' }
        ]
      },
      { text: '教育邮箱', link: 'http://edumail.nipao.com' },
      { text: '关于', link: '/about' }
    ],

    // 侧边栏
    sidebar: {
      '/posts/': [
        {
          text: '📚 最新文章',
          collapsed: false,
          items: [
            { text: '文章列表', link: '/posts/' },
            {
              text: 'Proxmox VE自动重启教程',
              link: '/posts/【Proxmox VE 终极教程】如何实现虚拟机（Guest OS）宕机后自动重启？'
            },
            {
              text: '1Panel发布HTTPS服务',
              link: '/posts/【实战教程】突破端口封锁：如何使用1Panel在家庭网络中发布多个HTTPS服务'
            },
            {
              text: 'CDN配置HTTPS访问',
              link: '/posts/【进阶篇】巧用CDN：为家庭服务套上"马甲"，实现完美HTTPS访问'
            },
            {
              text: 'Supabase数据库重置',
              link: '/posts/如何重置supabase里所有表、函数和触发器'
            },
            {
              text: 'Autodesk Viewer3D使用',
              link: '/posts/理解Autodesk Viewer3D文档的使用方法'
            }
          ]
        },
        {
          text: '🏷️ 分类浏览',
          collapsed: true,
          items: [
            { text: '技术教程', link: '/blog?category=技术教程' },
            { text: '开发相关', link: '/blog?category=开发相关' },
            { text: '全部标签', link: '/tags' }
          ]
        }
      ]
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    // 页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024 NIPAO'
    },

    // 编辑链接
    editLink: {
      pattern:
        'https://github.com/yourusername/jue.github.io/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 社交链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/jue' }],

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 大纲配置
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    // 上下页导航
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  },

  // Markdown配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    toc: { level: [1, 2, 3] }
  },

  // 清理URL
  cleanUrls: true,

  // 站点地图
  buildEnd: generateSitemap,

  vite: {
    server: {
      port: 3000,
      host: true,
      allowedHosts: ['dev.jue.sh']
    },
    plugins: [Tailwind()]
  }
})

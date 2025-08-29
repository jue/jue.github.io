import { defineConfig } from 'vitepress'
// import { blogConfig } from './config/blog.js'

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
  description: 'NIPAO分享 - 技术、生活和思考',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: 'NIPAO' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'NIPAO' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'RSS Feed', href: '/feed.xml' }],
    ['link', { rel: 'alternate', type: 'application/atom+xml', title: 'Atom Feed', href: '/atom.xml' }],
    ['link', { rel: 'alternate', type: 'application/json', title: 'JSON Feed', href: '/feed.json' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog' },
      { text: '标签', link: '/tags' },
      { text: '归档', link: '/archive' },
      { text: '关于', link: '/about' }
    ],

    // 侧边栏
    sidebar: {
      '/': [
        {
          text: '示例', 
          items: [
            { text: 'API 示例', link: '/api-examples' },
            { text: 'Markdown 示例', link: '/markdown-examples' },
          ]
        }
      ],
      '/post/': [
        {
          text: '技术教程',
          items: [
            { text: 'Proxmox VE 虚拟机自动重启', link: '/post/【Proxmox VE 终极教程】如何实现虚拟机（Guest OS）宕机后自动重启？' },
            { text: '1Panel HTTPS服务发布', link: '/post/【实战教程】突破端口封锁：如何使用1Panel在家庭网络中发布多个HTTPS服务' },
            { text: 'CDN家庭服务优化', link: '/post/【进阶篇】巧用CDN：为家庭服务套上"马甲"，实现完美HTTPS访问' }
          ]
        },
        {
          text: '开发相关',
          items: [
            { text: 'Supabase数据库重置', link: '/post/如何重置supabase里所有表、函数和触发器' },
            { text: 'Autodesk Viewer3D使用', link: '/post/理解Autodesk Viewer3D文档的使用方法' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jue' }
    ],

    // 博客配置
    blog: {
      title: 'NIPAO',
      description: 'NIPAO分享 - 技术、生活和思考',
      author: { name: 'NIPAO', email: 'contact@jue.sh' },
      pagination: { pageSize: 10 },
      search: { enabled: true },
      rss: { enabled: true }
    },

    // 搜索配置
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

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/username/repo/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 页脚
    footer: {
      message: `基于 <a href="https://vitepress.dev/" target="_blank">VitePress</a> 构建`,
      copyright: `Copyright © ${new Date().getFullYear()} NIPAO`
    },

    // 文档页脚导航
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    // 返回顶部
    returnToTopLabel: '回到顶部',

    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',

    // 深色模式开关标签
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})

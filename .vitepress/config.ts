import { defineConfig } from 'vitepress'
import { genFeed } from './genFeed.js'

export default defineConfig({
  title: 'NIPAO',
  description: 'The official blog for the Vue.js project',
  lang: 'zh-CN',
  cleanUrls: true,
  head: [
    ['meta', { name: 'twitter:site', content: '@nipao' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'meta',
      {
        name: 'twitter:image',
        content: 'https://blog.nipao.com/images/logo.svg'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ],
    [
      'meta',
      {
        name: 'msvalidate.01',
        content: '9B58387904FD6F8AF0E775C590906D37'
      }
    ],
    [
      'meta',
      {
        name: 'baidu-site-verification',
        content: 'codeva-TWwKHGS8ix'
      }
    ]
    // [
    //   'script',
    //   {
    //     src: 'https://cdn.usefathom.com/script.js',
    //     'data-site': 'NYHGSGQV',
    //     'data-spa': 'auto',
    //     defer: ''
    //   }
    // ]
  ],
  themeConfig: {},
  buildEnd: genFeed,

  vite: {
    server: {
      port: 3000,
      host: true,
      allowedHosts: ['dev.jue.sh']
    }
  }
})

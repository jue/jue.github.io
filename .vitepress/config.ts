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
        content: 'https://www.nipao.com/images/logo.svg'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
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

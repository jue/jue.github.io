import { writeFileSync } from 'fs'
import { resolve } from 'path'
import type { SiteConfig } from 'vitepress'

export function generateSitemap(config: SiteConfig) {
  const hostname = 'https://yourdomain.com' // 替换为你的域名
  const pages = [
    '',
    'blog',
    'posts/',
    'tags',
    'archive',
    'about',
    'posts/【Proxmox VE 终极教程】如何实现虚拟机（Guest OS）宕机后自动重启？',
    'posts/【实战教程】突破端口封锁：如何使用1Panel在家庭网络中发布多个HTTPS服务',
    'posts/【进阶篇】巧用CDN：为家庭服务套上"马甲"，实现完美HTTPS访问',
    'posts/如何重置supabase里所有表、函数和触发器',
    'posts/理解Autodesk Viewer3D文档的使用方法'
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${hostname}/${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  writeFileSync(resolve(config.outDir, 'sitemap.xml'), sitemap)
}

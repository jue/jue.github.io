import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'

const baseUrl = `https://blog.nipao.com`

export async function genFeed(config: SiteConfig) {
  const feed = new Feed({
    title: 'NIPAO Blog',
    description: 'The official blog for the NIPAO project',
    id: baseUrl,
    link: baseUrl,
    language: 'zh-CN',
    image:
      'https://p26-passport.byteacctimg.com/img/user-avatar/6916916304851dfaddc399c62dc8e974~300x300.image',
    favicon: `${baseUrl}/favicon.ico`,
    copyright: 'Copyright (c) 2025 nipao.com. All Rights Reserved.'
  })

  const posts = await createContentLoader('post/*.md', {
    excerpt: true,
    render: true
  }).load()

  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string)
  )

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${baseUrl}${url}`,
      link: `${baseUrl}${url}`,
      description: excerpt,
      content: html?.replaceAll('&ZeroWidthSpace;', ''),
      author: [
        {
          name: frontmatter.author,
          link: frontmatter.twitter
            ? `https://twitter.com/${frontmatter.twitter}`
            : undefined
        }
      ],
      date: frontmatter.date
    })
  }

  writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2(), 'utf8')
}

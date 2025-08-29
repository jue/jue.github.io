// .vitepress/theme/posts.data.js
import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  excerpt: true, // 提取摘要
  transform(rawData) {
    return rawData
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title,
        author: frontmatter.author,
        date: new Date(frontmatter.date),
        tags: frontmatter.tags,
        url,
        excerpt
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  }
})

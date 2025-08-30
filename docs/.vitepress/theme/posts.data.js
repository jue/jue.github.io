import { createContentLoader } from 'vitepress'
import { generateExcerpt } from './utils/index.js'

export default createContentLoader('posts/*.md', {
  includeSrc: false, // 不包含原始markdown内容
  render: false, // 不渲染HTML
  excerpt: true, // 包含摘要
  transform(rawData) {
    // 对数据进行转换和排序
    return rawData
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title,
        url,
        excerpt: generateExcerpt(excerpt || frontmatter.description || '', {
          maxLength: 150,
          stripTags: true
        }),
        date: frontmatter.date,
        lastUpdated: frontmatter.lastUpdated,
        category: frontmatter.category || '其他',
        tags: frontmatter.tags || [],
        author: frontmatter.author || 'NIPAO',
        wordCount: frontmatter.wordCount || 0,
        readingTime:
          frontmatter.readingTime ||
          Math.ceil((frontmatter.wordCount || 1000) / 200)
      }))
      .filter((post) => post.title) // 过滤掉没有标题的文章
      .sort((a, b) => +new Date(b.date) - +new Date(a.date)) // 按日期降序排列
  }
})

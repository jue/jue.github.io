import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: {
    time: number
    string: string
  }
  excerpt: string | undefined
  categories: string[]
}

declare const data: Post[]
export { data }

export default createContentLoader('post/*.md', {
  excerpt: true,
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title,
        url,
        excerpt,
        categories: normalizeCategories(frontmatter.categories),
        date: formatDate(frontmatter.date || new Date())
      }))
      .sort((a, b) => b.date.time - a.date.time)
  }
})

function formatDate(raw: string | Date | undefined): Post['date'] {
  // 如果 raw 是 undefined 或无效日期，使用当前日期
  const date = new Date(raw || new Date())
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    // 如果日期无效，使用当前日期
    date.setTime(new Date().getTime())
  }
  date.setUTCHours(12)
  return {
    time: +date,
    string: date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

function normalizeCategories(input: unknown): string[] {
  if (!input) {
    return []
  }

  const values = Array.isArray(input)
    ? input
    : typeof input === 'string'
      ? input.split(',').map((value) => value.trim())
      : []

  return Array.from(
    new Set(
      values
        .map((value) => String(value).trim())
        .filter((value) => value.length > 0)
    )
  )
}

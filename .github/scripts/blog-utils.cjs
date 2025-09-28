// 博客工具函数库
// Blog utility functions library

// 博客目录路径常量
// Blog directory path constant
const BLOG_DIR = 'post'

// 博客网站基础URL常量
// Blog website base URL constant
const BLOG_BASE_URL = 'https://blog.nipao.com/post'

/**
 * 提取内容中的第一张图片地址
 * Extract the first image URL from content
 * @param {string} content - 内容文本
 * @returns {string} - 第一张图片的URL，如果没有则返回空字符串
 */
function extractFirstImageUrl(content) {
  if (!content) return ''

  // 匹配 markdown 格式的图片: ![alt](url)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/
  const markdownMatch = content.match(markdownImageRegex)
  if (markdownMatch && markdownMatch[1]) {
    return markdownMatch[1].trim()
  }

  // 匹配 HTML img 标签: <img src="url">
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i
  const htmlMatch = content.match(htmlImageRegex)
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1].trim()
  }

  // 匹配直接的图片URL（以常见图片扩展名结尾）
  const directImageRegex =
    /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s]*)?/i
  const directMatch = content.match(directImageRegex)
  if (directMatch && directMatch[0]) {
    return directMatch[0].trim()
  }

  return ''
}

/**
 * 将字符串转为安全的 YAML 双引号格式
 * Quote string for YAML double quoted style
 * @param {string} value
 * @returns {string}
 */
function yamlQuote(value) {
  const stringValue = String(value ?? '')
  const escaped = stringValue
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
  return `"${escaped}"`
}

/**
 * 生成 Front Matter
 * Generate Front Matter
 * @param {Object} issue - GitHub issue 对象
 * @returns {string} - Front Matter 字符串
 */
function generateFrontMatter(issue) {
  const title = issue.title
  const authorLogin = issue.user.login
  const authorLink = issue.user.html_url || `https://github.com/${authorLogin}`
  const authorAvatar = issue.user.avatar_url || ''
  const createdAt = issue.created_at.split('T')[0]
  const updatedAt = issue.updated_at.split('T')[0]
  const issueNumber = issue.number

  // 分离分类和标签
  // Separate categories and tags
  let category = null
  const tags = []

  issue.labels.forEach((label) => {
    if (label.name.startsWith('Category:')) {
      const categoryName = label.name.replace(/^Category:\s*/, '').trim()
      if (categoryName) {
        category = categoryName
      }
    } else if (label.name) {
      tags.push(label.name)
    }
  })

  const categories = category ? [category] : []

  // 生成文章描述（取issue body的前150个字符）
  // Generate description (first 150 characters of issue body)
  let description = ''
  const body = issue.body || ''
  if (body) {
    description = body
      .replace(/[#*`\[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .substring(0, 150)
    if (body.length > 150) {
      description += '...'
    }
  }

  // 提取第一张图片作为封面
  // Extract first image as cover
  const cover = extractFirstImageUrl(body)

  // 估算字数（中文按字符计算，英文按单词计算）
  // Estimate word count
  let wordCount = 0
  if (body) {
    const chineseChars = (body.match(/[\u4e00-\u9fff]/g) || []).length
    const englishWords =
      body.replace(/[\u4e00-\u9fff]/g, '').match(/\b\w+\b/g) || []
    wordCount = chineseChars + englishWords.length
  }

  const readingTime = wordCount ? Math.max(1, Math.round(wordCount / 300)) : 0

  const frontMatterLines = [
    '---',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `date: ${createdAt}`,
    `lastUpdated: ${updatedAt}`,
    'authors:',
    `  - name: ${yamlQuote(authorLogin)}`,
    `    link: ${yamlQuote(authorLink)}`
  ]

  if (authorAvatar) {
    frontMatterLines.push(`    avatar: ${yamlQuote(authorAvatar)}`)
  }

  if (cover) {
    frontMatterLines.push(`cover: ${yamlQuote(cover)}`)
  }

  if (categories.length > 0) {
    frontMatterLines.push('categories:')
    categories.forEach((item) => {
      frontMatterLines.push(`  - ${yamlQuote(item)}`)
    })
  }

  if (tags.length > 0) {
    frontMatterLines.push('tags:')
    tags.forEach((tag) => {
      frontMatterLines.push(`  - ${yamlQuote(tag)}`)
    })
  }

  if (wordCount > 0) {
    frontMatterLines.push(`wordCount: ${wordCount}`)
  }

  if (readingTime > 0) {
    frontMatterLines.push(`readingTime: ${readingTime}`)
  }

  frontMatterLines.push(`githubIssue: ${issueNumber}`)
  if (issue.html_url) {
    frontMatterLines.push(`githubUrl: ${yamlQuote(issue.html_url)}`)
  }

  if (issue.state && issue.state !== 'open') {
    frontMatterLines.push(`draft: true`)
  }

  frontMatterLines.push('---', '')

  return frontMatterLines.join('\n')
}

/**
 * 使用Google翻译API翻译文本
 * Translate text using Google Translate API
 * @param {string} text - 要翻译的文本
 * @param {string} targetLang - 目标语言代码，默认为'en'
 * @returns {Promise<string>} - 翻译后的文本
 */
async function translateText(text, targetLang = 'en') {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`
    )
    const data = await response.json()
    return data[0][0][0] || text
  } catch (error) {
    console.warn('Translation failed, using original text:', error.message)
    return text
  }
}

/**
 * 清理文件名中的非法字符
 * Sanitize filename by removing illegal characters
 * @param {string} title - 原始标题
 * @returns {string} - 清理后的文件名
 */
function sanitizeFilename(title) {
  return title
    .replace(/[<>:"/\\|?*]/g, '') // 移除非法字符
    .replace(/[^a-zA-Z0-9\s-]/g, '') // 只保留字母、数字、空格和中划线
    .replace(/\s+/g, '-') // 空格替换为中划线
    .replace(/-+/g, '-') // 多个连续中划线替换为单个
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的中划线
    .toLowerCase() // 转换为小写
    .trim()
}

/**
 * 异步清理文件名（包含翻译）
 * Async sanitize filename with translation
 * @param {string} title - 原始标题
 * @returns {Promise<string>} - 清理后的英文文件名
 */
async function sanitizeFilenameAsync(title) {
  const translatedTitle = await translateText(title, 'en')
  return sanitizeFilename(translatedTitle)
}

/**
 * 按年月分组 issues
 * Group issues by year and month
 * @param {Array} issues - issues 数组
 * @returns {Object} - 按年月分组的 issues
 */
function groupIssuesByYearMonth(issues) {
  const issuesByYearMonth = {}

  issues.forEach((issue) => {
    // 跳过 Pull Requests
    if (issue.pull_request) return

    const createdDate = new Date(issue.created_at)
    const yearMonth = `${createdDate.getFullYear()}-${String(
      createdDate.getMonth() + 1
    ).padStart(2, '0')}`

    if (!issuesByYearMonth[yearMonth]) {
      issuesByYearMonth[yearMonth] = []
    }

    issuesByYearMonth[yearMonth].push({
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state
    })
  })

  return issuesByYearMonth
}

/**
 * 异步生成 README 内容（包含翻译）
 * Async generate README content with translation
 * @param {Object} issuesByYearMonth - 按年月分组的 issues
 * @param {number} totalCount - 总文章数
 * @returns {Promise<string>} - README 内容
 */
async function generateReadmeContentAsync(issuesByYearMonth, totalCount) {
  let readmeContent = '# NIPAO Post\n\n'
  readmeContent +=
    '这是一个基于 GitHub Issues 的博客系统。每个 Issue 会自动转换为博客文章。\n\n'
  readmeContent += '## 📝 文章列表\n\n'

  // 按年月倒序排列
  const sortedYearMonths = Object.keys(issuesByYearMonth).sort().reverse()

  if (sortedYearMonths.length === 0) {
    readmeContent += '暂无文章。\n\n'
  } else {
    for (const yearMonth of sortedYearMonths) {
      const [year, month] = yearMonth.split('-')
      const monthNames = [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
      ]
      const monthName = monthNames[parseInt(month) - 1]

      readmeContent += `### ${year}年${monthName}\n\n`

      // 按 issue 编号倒序排列（最新的在前）
      const sortedIssues = issuesByYearMonth[yearMonth].sort(
        (a, b) => b.number - a.number
      )

      for (const issue of sortedIssues) {
        // 生成翻译后的清理文件名作为URL路径
        // Generate translated sanitized filename as URL path
        const sanitizedTitle = await sanitizeFilenameAsync(issue.title)
        const blogUrl = `${BLOG_BASE_URL}/${sanitizedTitle}`
        readmeContent += `- [${issue.title}](${blogUrl})\n`
      }

      readmeContent += '\n'
    }
  }

  readmeContent += '---\n\n'
  readmeContent +=
    '💡 **使用说明**：创建新的 Issue 即可自动生成博客文章，文章内容为 Issue 的正文部分。\n\n'
  readmeContent += `📊 **统计信息**：共有 ${totalCount} 篇文章\n\n`
  readmeContent += `🔄 **最后更新**：${new Date().toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai'
  })}\n`

  return readmeContent
}

/**
 * 生成 README 内容
 * Generate README content
 * @param {Object} issuesByYearMonth - 按年月分组的 issues
 * @param {number} totalCount - 总文章数
 * @returns {string} - README 内容
 */
function generateReadmeContent(issuesByYearMonth, totalCount) {
  let readmeContent = '# NIPAO Post\n\n'
  readmeContent +=
    '这是一个基于 GitHub Issues 的博客系统。每个 Issue 会自动转换为博客文章。\n\n'
  readmeContent += '## 📝 文章列表\n\n'

  // 按年月倒序排列
  const sortedYearMonths = Object.keys(issuesByYearMonth).sort().reverse()

  if (sortedYearMonths.length === 0) {
    readmeContent += '暂无文章。\n\n'
  } else {
    sortedYearMonths.forEach((yearMonth) => {
      const [year, month] = yearMonth.split('-')
      const monthNames = [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
      ]
      const monthName = monthNames[parseInt(month) - 1]

      readmeContent += `### ${year}年${monthName}\n\n`

      // 按 issue 编号倒序排列（最新的在前）
      const sortedIssues = issuesByYearMonth[yearMonth].sort(
        (a, b) => b.number - a.number
      )

      sortedIssues.forEach((issue) => {
        // 生成清理后的文件名作为URL路径
        // Generate sanitized filename as URL path
        const sanitizedTitle = sanitizeFilename(issue.title)
        const blogUrl = `${BLOG_BASE_URL}/${sanitizedTitle}`
        readmeContent += `- [${issue.title}](${blogUrl})\n`
      })

      readmeContent += '\n'
    })
  }

  readmeContent += '---\n\n'
  readmeContent +=
    '💡 **使用说明**：创建新的 Issue 即可自动生成博客文章，文章内容为 Issue 的正文部分。\n\n'
  readmeContent += `📊 **统计信息**：共有 ${totalCount} 篇文章\n\n`
  readmeContent += `🔄 **最后更新**：${new Date().toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai'
  })}\n`

  return readmeContent
}

/**
 * 转义Vue模板语法以避免VitePress构建错误
 * Escape Vue template syntax to prevent VitePress build errors
 * @param {string} content - 原始内容
 * @returns {string} - 转义后的内容
 */
function escapeVueTemplateSyntax(content) {
  if (!content) return content

  // 转义 {{ }} 为 { } }
  // 使用负向前瞻和负向后顾确保不会重复转义已经转义的内容
  return content.replace(/\{\{([^{]*?)\}\}/g, (match, p1) => {
    // 如果已经是转义格式，则不处理
    if (match.includes('{ {') || match.includes('} }')) {
      return match
    }
    // 将 {{ ... }} 转义为 { { ... }
    return `{ {${p1}} }`
  })
}

/**
 * 创建博客文件内容
 * Create blog file content
 * @param {Object} issue - GitHub issue 对象
 * @returns {Object} - 包含文件路径和内容的对象
 */
function createBlogFileContent(issue) {
  const frontMatter = generateFrontMatter(issue)
  const sanitizedTitle = sanitizeFilename(issue.title)
  const filePath = `${BLOG_DIR}/${sanitizedTitle}.md`

  // 转义Vue模板语法以避免VitePress构建错误
  let bodyContent = issue.body || ''
  bodyContent = escapeVueTemplateSyntax(bodyContent)

  const content = frontMatter + bodyContent

  return {
    filePath,
    content,
    filename: `${sanitizedTitle}.md`
  }
}

/**
 * 异步创建博客文件内容（包含翻译）
 * Async create blog file content with translation
 * @param {Object} issue - GitHub issue 对象
 * @returns {Promise<Object>} - 包含文件路径和内容的对象
 */
async function createBlogFileContentAsync(issue) {
  const frontMatter = generateFrontMatter(issue)
  const sanitizedTitle = await sanitizeFilenameAsync(issue.title)
  const filePath = `${BLOG_DIR}/${sanitizedTitle}.md`

  // 转义Vue模板语法以避免VitePress构建错误
  let bodyContent = issue.body || ''
  bodyContent = escapeVueTemplateSyntax(bodyContent)

  const content = frontMatter + bodyContent

  return {
    filePath,
    content,
    filename: `${sanitizedTitle}.md`
  }
}

// 导出函数供 GitHub Actions 使用
// Export functions for GitHub Actions
const BlogUtils = {
  BLOG_DIR,
  BLOG_BASE_URL,
  extractFirstImageUrl,
  generateFrontMatter,
  sanitizeFilename,
  sanitizeFilenameAsync,
  translateText,
  groupIssuesByYearMonth,
  generateReadmeContent,
  generateReadmeContentAsync,
  createBlogFileContent,
  createBlogFileContentAsync,
  escapeVueTemplateSyntax
}

// 兼容不同的模块系统
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogUtils
} else if (typeof global !== 'undefined') {
  global.BlogUtils = BlogUtils
} else {
  this.BlogUtils = BlogUtils
}

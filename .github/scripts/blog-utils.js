// 博客工具函数库
// Blog utility functions library

// 博客目录路径常量
// Blog directory path constant
const BLOG_DIR = 'docs/posts'

/**
 * 生成 Front Matter
 * Generate Front Matter
 * @param {Object} issue - GitHub issue 对象
 * @returns {string} - Front Matter 字符串
 */
function generateFrontMatter(issue) {
  const title = issue.title
  const author = issue.user.login
  const createdAt = issue.created_at.split('T')[0]
  const updatedAt = issue.updated_at.split('T')[0]
  const issueNumber = issue.number

  // 分离分类和标签
  // Separate categories and tags
  const categories = []
  const tags = []

  issue.labels.forEach((label) => {
    if (label.name.startsWith('Category:')) {
      // 移除 'Category:' 前缀作为分类
      // Remove 'Category:' prefix for categories
      const categoryName = label.name.replace(/^Category:\s*/, '').trim()
      if (categoryName) {
        categories.push(categoryName)
      }
    } else {
      // 其他标签作为 tags
      // Other labels as tags
      tags.push(label.name)
    }
  })

  const frontMatterLines = [
    '---',
    `layout: post`,
    `title: "${title.replace(/"/g, '\\"')}"`,
    `author: "${author}"`,
    `date: ${createdAt}`,
    `last_modified_at: ${updatedAt}`
  ]

  // 添加分类（如果有）
  // Add categories (if any)
  if (categories.length > 0) {
    frontMatterLines.push(
      `categories: [${categories
        .map((cat) => `"${cat.replace(/"/g, '\\"')}"`)
        .join(', ')}]`
    )
  }

  // 添加标签（如果有）
  // Add tags (if any)
  if (tags.length > 0) {
    frontMatterLines.push(
      `tags: [${tags.map((tag) => `"${tag.replace(/"/g, '\\"')}"`).join(', ')}]`
    )
  }

  frontMatterLines.push(`issue_number: ${issueNumber}`, '---', '')

  return frontMatterLines.join('\n')
}

/**
 * 清理文件名中的非法字符
 * Sanitize filename by removing illegal characters
 * @param {string} title - 原始标题
 * @returns {string} - 清理后的文件名
 */
function sanitizeFilename(title) {
  return title
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
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
 * 生成 README 内容
 * Generate README content
 * @param {Object} issuesByYearMonth - 按年月分组的 issues
 * @param {number} totalCount - 总文章数
 * @returns {string} - README 内容
 */
function generateReadmeContent(issuesByYearMonth, totalCount) {
  let readmeContent = '# Post\n\n'
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
        readmeContent += `- [${issue.title}](${issue.url})\n`
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
 * 创建博客文件内容
 * Create blog file content
 * @param {Object} issue - GitHub issue 对象
 * @returns {Object} - 包含文件路径和内容的对象
 */
function createBlogFileContent(issue) {
  const frontMatter = generateFrontMatter(issue)
  const sanitizedTitle = sanitizeFilename(issue.title)
  const filePath = `${BLOG_DIR}/${sanitizedTitle}.md`
  const content = frontMatter + (issue.body || '')

  return {
    filePath,
    content,
    filename: `${sanitizedTitle}.md`
  }
}

/**
 * 按分类分组文章
 * Group articles by category
 * @param {Array} issues - issues 数组
 * @returns {Object} - 按分类分组的文章
 */
function groupIssuesByCategory(issues) {
  const categories = {
    技术教程: [],
    开发相关: [],
    其他: []
  }

  issues.forEach((issue) => {
    if (issue.pull_request || issue.state !== 'open') return

    let categoryFound = false
    issue.labels.forEach((label) => {
      if (label.name.startsWith('Category:')) {
        const categoryName = label.name.replace(/^Category:\s*/, '').trim()
        if (categories[categoryName]) {
          categories[categoryName].push(issue)
          categoryFound = true
        }
      }
    })

    // 如果没有找到分类，放入"其他"分类
    if (!categoryFound) {
      categories['其他'].push(issue)
    }
  })

  return categories
}

/**
 * 生成分页信息
 * Generate pagination info
 * @param {Array} items - 文章数组
 * @param {number} currentPage - 当前页码
 * @param {number} itemsPerPage - 每页文章数
 * @returns {Object} - 分页信息
 */
function generatePaginationInfo(items, currentPage = 1, itemsPerPage = 5) {
  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = items.slice(startIndex, endIndex)

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex,
    currentItems,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  }
}

/**
 * 生成博客索引页面内容
 * Generate blog index page content
 * @param {Array} issues - issues 数组
 * @param {number} currentPage - 当前页码
 * @param {number} itemsPerPage - 每页文章数
 * @returns {Object} - 包含索引页面内容和分页信息的对象
 */
function generateBlogIndexContent(issues, currentPage = 1, itemsPerPage = 5) {
  // 过滤出开放状态的issues（排除PR）
  const openIssues = issues.filter(
    (issue) => !issue.pull_request && issue.state === 'open'
  )

  // 按创建时间倒序排列
  const sortedIssues = openIssues.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )

  // 按分类分组
  const categorizedIssues = groupIssuesByCategory(sortedIssues)

  // 生成分页信息
  const pagination = generatePaginationInfo(
    sortedIssues,
    currentPage,
    itemsPerPage
  )

  // 生成页面内容
  let content = `---
layout: page
title: 博客文章
description: 技术分享与实战教程
---

# 博客文章

欢迎来到我的技术博客！这里分享各种实用的技术教程和开发经验。

`

  // 添加统计信息
  content += `## 📊 统计信息

- **总文章数：** ${pagination.totalItems}
- **当前页：** ${pagination.currentPage} / ${pagination.totalPages}
- **每页显示：** ${pagination.itemsPerPage} 篇

`

  // 添加分页导航（顶部）
  if (pagination.totalPages > 1) {
    content += generatePaginationNav(pagination, 'top')
  }

  content += `## 📚 最新文章\n\n`

  // 显示当前页的文章
  if (pagination.currentItems.length === 0) {
    content += `暂无文章。\n\n`
  } else {
    pagination.currentItems.forEach((issue, index) => {
      const sanitizedTitle = sanitizeFilename(issue.title)
      const createdDate = new Date(issue.created_at).toLocaleDateString('zh-CN')
      const updatedDate = new Date(issue.updated_at).toLocaleDateString('zh-CN')

      content += `### [${issue.title}](./${encodeURIComponent(
        sanitizedTitle
      )}.md)\n\n`
      content += `> **发布时间：** ${createdDate}`
      if (createdDate !== updatedDate) {
        content += ` | **更新时间：** ${updatedDate}`
      }
      content += ` | **作者：** ${
        issue.author
          ? issue.author.login
          : issue.user
          ? issue.user.login
          : 'Unknown'
      }\n`
      content += `> \n`

      // 添加文章摘要（取body的前150个字符）
      if (issue.body) {
        const summary = issue.body.replace(/[\r\n]+/g, ' ').substring(0, 150)
        content += `> ${summary}${issue.body.length > 150 ? '...' : ''}\n`
      }

      // 添加标签
      if (issue.labels && issue.labels.length > 0) {
        const tags = issue.labels.map((label) => `\`${label.name}\``).join(' ')
        content += `> \n> **标签：** ${tags}\n`
      }

      content += `\n---\n\n`
    })
  }

  // 添加分页导航（底部）
  if (pagination.totalPages > 1) {
    content += generatePaginationNav(pagination, 'bottom')
  }

  // 添加分类概览
  content += `## 🏷️ 文章分类\n\n`
  Object.keys(categorizedIssues).forEach((category) => {
    const count = categorizedIssues[category].length
    if (count > 0) {
      content += `- **${category}** (${count}篇)\n`
    }
  })

  content += `\n---\n\n*持续更新中，欢迎关注！*\n\n`

  // 添加样式
  content += generateBlogIndexStyles()

  return {
    content,
    pagination,
    categorizedIssues
  }
}

/**
 * 生成分页导航
 * Generate pagination navigation
 * @param {Object} pagination - 分页信息
 * @param {string} position - 位置 ('top' 或 'bottom')
 * @returns {string} - 分页导航HTML
 */
function generatePaginationNav(pagination, position = 'bottom') {
  let nav = `<div class="pagination-nav pagination-${position}">\n`

  // 上一页按钮
  if (pagination.hasPrevPage) {
    const prevPage = pagination.currentPage - 1
    const prevLink = prevPage === 1 ? './index.md' : `./page-${prevPage}.md`
    nav += `  <a href="${prevLink}" class="pagination-btn prev-btn">← 上一页</a>\n`
  } else {
    nav += `  <span class="pagination-btn prev-btn disabled">← 上一页</span>\n`
  }

  // 页码信息
  nav += `  <span class="pagination-info">第 ${pagination.currentPage} 页，共 ${pagination.totalPages} 页</span>\n`

  // 下一页按钮
  if (pagination.hasNextPage) {
    const nextPage = pagination.currentPage + 1
    const nextLink = `./page-${nextPage}.md`
    nav += `  <a href="${nextLink}" class="pagination-btn next-btn">下一页 →</a>\n`
  } else {
    nav += `  <span class="pagination-btn next-btn disabled">下一页 →</span>\n`
  }

  nav += `</div>\n\n`

  return nav
}

/**
 * 生成博客索引页面样式
 * Generate blog index page styles
 * @returns {string} - CSS样式
 */
function generateBlogIndexStyles() {
  return `<style>
.pagination-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  padding: 1rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination-btn:not(.disabled) {
  background-color: var(--vp-c-brand);
  color: var(--vp-c-white);
}

.pagination-btn:not(.disabled):hover {
  background-color: var(--vp-c-brand-dark);
  transform: translateY(-1px);
}

.pagination-btn.disabled {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-3);
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.pagination-top {
  margin-bottom: 2rem;
}

.pagination-bottom {
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .pagination-nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-info {
    order: -1;
  }
}
</style>`
}

// 导出函数供 GitHub Actions 使用
// Export functions for GitHub Actions
const BlogUtils = {
  BLOG_DIR,
  generateFrontMatter,
  sanitizeFilename,
  groupIssuesByYearMonth,
  generateReadmeContent,
  createBlogFileContent,
  groupIssuesByCategory,
  generatePaginationInfo,
  generateBlogIndexContent,
  generatePaginationNav,
  generateBlogIndexStyles
}

// 兼容不同的模块系统
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogUtils
} else if (typeof global !== 'undefined') {
  global.BlogUtils = BlogUtils
} else {
  // 直接在全局作用域中定义
  this.BlogUtils = BlogUtils
}

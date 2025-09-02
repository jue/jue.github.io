// 博客工具函数库
// Blog utility functions library

// 博客目录路径常量
// Blog directory path constant
const BLOG_DIR = 'content'

// 博客网站基础URL常量
// Blog website base URL constant
const BLOG_BASE_URL = 'https://www.nipao.com/post'

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
  let category = 'other' // 默认分类
  const tags = []

  issue.labels.forEach((label) => {
    if (label.name.startsWith('Category:')) {
      // 移除 'Category:' 前缀作为分类
      // Remove 'Category:' prefix for categories
      const categoryName = label.name.replace(/^Category:\s*/, '').trim()
      if (categoryName) {
        category = categoryName
      }
    } else {
      // other标签作为 tags
      // Other labels as tags
      tags.push(label.name)
    }
  })

  // 生成文章描述（取issue body的前150个字符）
  // Generate description (first 150 characters of issue body)
  let description = ''
  if (issue.body) {
    description = issue.body
      .replace(/[#*`\[\]]/g, '') // 移除markdown标记
      .replace(/\n+/g, ' ') // 换行转空格
      .trim()
      .substring(0, 150)
    if (issue.body.length > 150) {
      description += '...'
    }
  }

  // 估算字数（中文按字符计算，英文按单词计算）
  // Estimate word count
  let wordCount = 0
  if (issue.body) {
    const chineseChars = (issue.body.match(/[\u4e00-\u9fff]/g) || []).length
    const englishWords =
      issue.body.replace(/[\u4e00-\u9fff]/g, '').match(/\b\w+\b/g) || []
    wordCount = chineseChars + englishWords.length
  }

  const frontMatterLines = [
    '---',
    `title: '${title.replace(/'/g, "\'")}'`,
    `description: '${description.replace(/'/g, "\'")}'`,
    `author: '${author}'`,
    `date: ${createdAt}`,
    `lastUpdated: ${updatedAt}`,
    `category: '${category.replace(/'/g, "\'")}'`
  ]

  // 添加标签（如果有）
  // Add tags (if any)
  if (tags.length > 0) {
    frontMatterLines.push('tags:')
    tags.forEach((tag) => {
      frontMatterLines.push(`  - '${tag.replace(/'/g, "\'")}'`)
    })
  }

  // 添加字数和issue编号
  // Add word count and issue number
  frontMatterLines.push(
    `wordCount: ${wordCount}`,
    `issue_number: ${issueNumber}`,
    '---',
    ''
  )

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
    .replace(/[<>:"/\\|?*]/g, '') // 移除非法字符
    .replace(/\s+/g, '-') // 空格替换为中划线
    .replace(/-+/g, '-') // 多个连续中划线替换为单个
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的中划线
    .toLowerCase() // 转换为小写
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
 * 同步文件到目标仓库
 * Sync file to target repository
 * @param {Object} github - GitHub API 实例
 * @param {Object} targetRepo - 目标仓库信息 {owner, repo}
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 * @param {string} message - 提交信息
 * @param {string} issueNumber - Issue 编号（用于验证）
 * @returns {Promise<boolean>} - 是否成功
 */
async function syncFileToRepo(github, targetRepo, filePath, content, message, issueNumber) {
  try {
    // 检查文件是否已存在
    let existingFileSha = null
    try {
      const { data: fileData } = await github.rest.repos.getContent({
        owner: targetRepo.owner,
        repo: targetRepo.repo,
        path: filePath,
      })
      
      // 验证文件确实对应当前issue
      const fileContent = Buffer.from(fileData.content, 'base64').toString('utf8')
      const match = fileContent.match(/issue_number:\s*(\d+)/)
      if (match && parseInt(match[1], 10) === parseInt(issueNumber, 10)) {
        existingFileSha = fileData.sha
        console.log(`Found existing file in ${targetRepo.owner}/${targetRepo.repo}: ${filePath}`)
      }
    } catch (error) {
      if (error.status !== 404) {
        console.error(`Error checking file in ${targetRepo.owner}/${targetRepo.repo}:`, error.message)
        return false
      }
      // 文件不存在，将创建新文件
    }

    // 创建或更新文件
    await github.rest.repos.createOrUpdateFileContents({
      owner: targetRepo.owner,
      repo: targetRepo.repo,
      path: filePath,
      message: message,
      content: Buffer.from(content).toString('base64'),
      sha: existingFileSha,
      committer: { name: 'GitHub Actions Bot', email: 'actions@github.com' }
    })

    console.log(`Successfully synced to ${targetRepo.owner}/${targetRepo.repo}: ${filePath}`)
    return true
  } catch (error) {
    console.error(`Error syncing to ${targetRepo.owner}/${targetRepo.repo}:`, error.message)
    return false
  }
}

/**
 * 从目标仓库删除文件
 * Delete file from target repository
 * @param {Object} github - GitHub API 实例
 * @param {Object} targetRepo - 目标仓库信息 {owner, repo}
 * @param {string} filePath - 文件路径
 * @param {string} message - 提交信息
 * @param {string} issueNumber - Issue 编号（用于验证）
 * @returns {Promise<boolean>} - 是否成功
 */
async function deleteFileFromRepo(github, targetRepo, filePath, message, issueNumber) {
  try {
    // 获取文件信息
    const { data: fileData } = await github.rest.repos.getContent({
      owner: targetRepo.owner,
      repo: targetRepo.repo,
      path: filePath,
    })

    // 验证文件确实对应当前issue
    const fileContent = Buffer.from(fileData.content, 'base64').toString('utf8')
    const match = fileContent.match(/issue_number:\s*(\d+)/)
    if (match && parseInt(match[1], 10) === parseInt(issueNumber, 10)) {
      // 删除文件
      await github.rest.repos.deleteFile({
        owner: targetRepo.owner,
        repo: targetRepo.repo,
        path: filePath,
        message: message,
        sha: fileData.sha,
        committer: { name: 'GitHub Actions Bot', email: 'actions@github.com' }
      })
      console.log(`Successfully deleted from ${targetRepo.owner}/${targetRepo.repo}: ${filePath}`)
      return true
    } else {
      console.log(`File ${filePath} in ${targetRepo.owner}/${targetRepo.repo} doesn't match issue #${issueNumber}`)
      return false
    }
  } catch (error) {
    if (error.status === 404) {
      console.log(`File not found in ${targetRepo.owner}/${targetRepo.repo}: ${filePath}`)
      return true // 文件不存在也算成功
    } else {
      console.error(`Error deleting from ${targetRepo.owner}/${targetRepo.repo}:`, error.message)
      return false
    }
  }
}

// 导出函数供 GitHub Actions 使用
// Export functions for GitHub Actions
const BlogUtils = {
  BLOG_DIR,
  BLOG_BASE_URL,
  generateFrontMatter,
  sanitizeFilename,
  groupIssuesByYearMonth,
  generateReadmeContent,
  createBlogFileContent,
  syncFileToRepo,
  deleteFileFromRepo
}

// 兼容不同的模块系统
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogUtils
} else if (typeof global !== 'undefined') {
  global.BlogUtils = BlogUtils
} else {
  this.BlogUtils = BlogUtils
}

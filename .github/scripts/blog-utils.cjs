// 博客工具函数库
// Blog utility functions library

// 博客目录路径常量
// Blog directory path constant
const BLOG_DIR = 'content'

/**
 * 生成 Front Matter (适配VitePress + createContentLoader)
 * Generate Front Matter (adapted for VitePress + createContentLoader)
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
  let category = '其他' // 默认分类
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
      // 其他标签作为 tags
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
    `title: '${title.replace(/'/g, "\\'")}'`,
    `description: '${description.replace(/'/g, "\\'")}'`,
    `author: '${author}'`,
    `date: ${createdAt}`,
    `lastUpdated: ${updatedAt}`,
    `category: '${category.replace(/'/g, "\\'")}'`
  ]

  // 添加标签（如果有）
  // Add tags (if any)
  if (tags.length > 0) {
    frontMatterLines.push('tags:')
    tags.forEach((tag) => {
      frontMatterLines.push(`  - '${tag.replace(/'/g, "\\'")}'`)
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
 * 使用免费的 Google 翻译接口翻译中文到英文
 * Translate Chinese to English using free Google Translate interface
 * @param {string} text - 需要翻译的中文文本
 * @returns {Promise<string>} - 翻译后的英文文本
 */
async function translateWithGoogleFree(text) {
  try {
    // 检查是否包含中文字符
    if (!/[\u4e00-\u9fff]/.test(text)) {
      return text; // 如果没有中文，直接返回
    }

    // 使用 google-translate-api-x 库（免费）
    let translate;
    try {
      translate = require('google-translate-api-x');
    } catch (requireError) {
      console.error('Failed to load google-translate-api-x:', requireError.message);
      return translateChineseToEnglishFallback(text);
    }
    
    const result = await translate(text, { from: 'zh', to: 'en', forceFrom: true });

    console.log(`Translated "${text}" to "${result.text}"`);
    return result.text;
  } catch (error) {
    console.error('Free Google Translate error:', error.message);
    // 如果翻译失败，回退到简单的中文词汇映射
    return translateChineseToEnglishFallback(text);
  }
}

// 加载拼音转换库
let pinyinLib;
try {
  const pinyinModule = require('pinyin');
  pinyinLib = pinyinModule.default || pinyinModule.pinyin || pinyinModule;
} catch (error) {
  console.log('拼音库加载失败，将使用基础词典:', error.message);
}

/**
 * 回退的中文翻译方法（当 Google API 不可用时）
 * 优先使用词典翻译，如果无法翻译则转换为拼音
 * Fallback Chinese translation method (when Google API is unavailable)
 * @param {string} text - 包含中文的文本
 * @returns {string} - 翻译后的英文文本或拼音
 */
function translateChineseToEnglishFallback(text) {
  // 基础词典翻译
  const chineseToEnglish = {
    '技术': 'technology',
    '教程': 'tutorial',
    '指南': 'guide',
    '开发': 'development',
    '编程': 'programming',
    '前端': 'frontend',
    '后端': 'backend',
    '数据库': 'database',
    '算法': 'algorithm',
    '框架': 'framework',
    '工具': 'tools',
    '配置': 'configuration',
    '部署': 'deployment',
    '优化': 'optimization',
    '调试': 'debugging',
    '测试': 'testing',
    '文档': 'documentation',
    '项目': 'project',
    '应用': 'application',
    '系统': 'system',
    '网站': 'website',
    '博客': 'blog',
    '文章': 'article',
    '笔记': 'notes',
    '总结': 'summary',
    '分享': 'sharing',
    '经验': 'experience',
    '实践': 'practice',
    '解决方案': 'solution',
    '问题': 'problem',
    '错误': 'error',
    '修复': 'fix',
    '更新': 'update',
    '新功能': 'new-feature',
    '版本': 'version',
    '发布': 'release',
    '安装': 'installation',
    '使用': 'usage',
    '介绍': 'introduction',
    '入门': 'getting-started',
    '高级': 'advanced',
    '基础': 'basic',
    '深入': 'deep-dive',
    '原理': 'principle',
    '源码': 'source-code',
    '分析': 'analysis',
    '比较': 'comparison',
    '选择': 'choice',
    '推荐': 'recommendation',
    'Vue': 'vue',
    'React': 'react',
    'Node': 'node',
    'JavaScript': 'javascript',
    'TypeScript': 'typescript',
    'CSS': 'css',
    'HTML': 'html'
  };

  let result = text;
  
  // 首先使用词典进行翻译
  Object.keys(chineseToEnglish).forEach(chinese => {
    const english = chineseToEnglish[chinese];
    result = result.replace(new RegExp(chinese, 'g'), english);
  });
  
  // 如果还有中文字符，尝试转换为拼音
  if (/[\u4e00-\u9fff]/.test(result) && pinyinLib && typeof pinyinLib === 'function') {
    try {
      // 将剩余的中文转换为拼音
      result = result.replace(/[\u4e00-\u9fff]+/g, (match) => {
        const pinyinResult = pinyinLib(match, {
          style: pinyinLib.STYLE_NORMAL || 0, // 不带声调的拼音
          heteronym: false // 不显示多音字的多个读音
        });
        return pinyinResult.map(item => Array.isArray(item) ? item[0] : item).join('-');
      });
    } catch (error) {
      console.log('拼音转换失败:', error.message);
      // 如果拼音转换失败，移除剩余的中文字符
      result = result.replace(/[\u4e00-\u9fff]/g, '');
    }
  } else if (/[\u4e00-\u9fff]/.test(result)) {
    // 如果没有拼音库，移除剩余的中文字符
    result = result.replace(/[\u4e00-\u9fff]/g, '');
  }
  
  return result;
}

/**
 * 清理文件名中的非法字符（异步版本，支持 Google 翻译）
 * Sanitize filename by removing illegal characters (async version with Google Translate)
 * @param {string} title - 原始标题
 * @returns {Promise<string>} - 清理后的文件名
 */
async function sanitizeFilenameAsync(title) {
  try {
    // 首先使用 Google 翻译
    let translatedTitle = await translateWithGoogleFree(title);
    
    return translatedTitle
      .replace(/[<>:"/\\|?*]/g, '') // 移除非法字符
      .replace(/\s+/g, '-') // 空格替换为中划线
      .replace(/-+/g, '-') // 多个连续中划线替换为单个
      .replace(/^-+|-+$/g, '') // 移除开头和结尾的中划线
      .toLowerCase() // 转换为小写
      .trim();
  } catch (error) {
    console.error('Error in sanitizeFilenameAsync:', error.message);
    // 如果异步翻译失败，回退到同步方法
    return sanitizeFilename(title);
  }
}

/**
 * 清理文件名中的非法字符（保持原有的同步版本作为回退）
 * Sanitize filename by removing illegal characters
 * @param {string} title - 原始标题
 * @returns {string} - 清理后的文件名
 */
function sanitizeFilename(title) {
  // 使用回退翻译方法
  let translatedTitle = translateChineseToEnglishFallback(title);
  
  return translatedTitle
    .replace(/[<>:"/\\|?*]/g, '') // 移除非法字符
    .replace(/\s+/g, '-') // 空格替换为中划线
    .replace(/-+/g, '-') // 多个连续中划线替换为单个
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的中划线
    .toLowerCase() // 转换为小写
    .trim();
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
 * 创建博客文件内容（异步版本，支持 Google 翻译）
 * Create blog file content (async version with Google Translate)
 * @param {Object} issue - GitHub issue 对象
 * @returns {Promise<Object>} - 包含文件路径和内容的对象
 */
async function createBlogFileContentAsync(issue) {
  const frontMatter = generateFrontMatter(issue);
  const sanitizedTitle = await sanitizeFilenameAsync(issue.title);
  const filePath = `${BLOG_DIR}/${sanitizedTitle}.md`;
  const content = frontMatter + (issue.body || '');

  return {
    filePath,
    content,
    filename: `${sanitizedTitle}.md`
  };
}

/**
 * 创建博客文件内容（保持原有的同步版本作为回退）
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
    let existingFileSha = null;
    try {
      const { data: fileData } = await github.rest.repos.getContent({
        owner: targetRepo.owner,
        repo: targetRepo.repo,
        path: filePath,
      });
      
      // 验证文件确实对应当前issue
      const fileContent = Buffer.from(fileData.content, 'base64').toString('utf8');
      const match = fileContent.match(/issue_number:\s*(\d+)/);
      if (match && parseInt(match[1], 10) === parseInt(issueNumber, 10)) {
        existingFileSha = fileData.sha;
        console.log(`Found existing file in ${targetRepo.owner}/${targetRepo.repo}: ${filePath}`);
      }
    } catch (error) {
      if (error.status !== 404) {
        console.error(`Error checking file in ${targetRepo.owner}/${targetRepo.repo}:`, error.message);
        return false;
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
    });

    console.log(`Successfully synced to ${targetRepo.owner}/${targetRepo.repo}: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error syncing to ${targetRepo.owner}/${targetRepo.repo}:`, error.message);
    return false;
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
    });

    // 验证文件确实对应当前issue
    const fileContent = Buffer.from(fileData.content, 'base64').toString('utf8');
    const match = fileContent.match(/issue_number:\s*(\d+)/);
    if (match && parseInt(match[1], 10) === parseInt(issueNumber, 10)) {
      // 删除文件
      await github.rest.repos.deleteFile({
        owner: targetRepo.owner,
        repo: targetRepo.repo,
        path: filePath,
        message: message,
        sha: fileData.sha,
        committer: { name: 'GitHub Actions Bot', email: 'actions@github.com' }
      });
      console.log(`Successfully deleted from ${targetRepo.owner}/${targetRepo.repo}: ${filePath}`);
      return true;
    } else {
      console.log(`File ${filePath} in ${targetRepo.owner}/${targetRepo.repo} doesn't match issue #${issueNumber}`);
      return false;
    }
  } catch (error) {
    if (error.status === 404) {
      console.log(`File not found in ${targetRepo.owner}/${targetRepo.repo}: ${filePath}`);
      return true; // 文件不存在也算成功
    } else {
      console.error(`Error deleting from ${targetRepo.owner}/${targetRepo.repo}:`, error.message);
      return false;
    }
  }
}

/**
 * 智能查找目标仓库中的旧文件
 * Smart search for old files in target repository
 * @param {Object} github - GitHub API 实例
 * @param {Object} targetRepo - 目标仓库信息 {owner, repo}
 * @param {string} issueNumber - Issue 编号
 * @param {string} currentFilePath - 当前文件路径
 * @returns {Promise<Object|null>} - 文件信息或null
 */
async function findOldFileInRepo(github, targetRepo, issueNumber, currentFilePath) {
  try {
    // 首先尝试通过当前路径查找
    try {
      const { data: fileData } = await github.rest.repos.getContent({
        owner: targetRepo.owner,
        repo: targetRepo.repo,
        path: currentFilePath,
      });
      
      const fileContent = Buffer.from(fileData.content, 'base64').toString('utf8');
      const match = fileContent.match(/issue_number:\s*(\d+)/);
      if (match && parseInt(match[1], 10) === parseInt(issueNumber, 10)) {
        return { path: currentFilePath, sha: fileData.sha };
      }
    } catch (error) {
      if (error.status !== 404) {
        console.error(`Error checking current path in ${targetRepo.owner}/${targetRepo.repo}:`, error.message);
      }
    }

    // 如果当前路径找不到，遍历content目录查找
    try {
      const { data: files } = await github.rest.repos.getContent({
        owner: targetRepo.owner,
        repo: targetRepo.repo,
        path: BLOG_DIR
      });
      
      for (const file of files) {
        if (!file.name.endsWith('.md')) continue;
        
        try {
          const { data: content } = await github.rest.repos.getContent({
            owner: targetRepo.owner,
            repo: targetRepo.repo,
            path: file.path
          });
          
          const fileContent = Buffer.from(content.content, 'base64').toString('utf8');
          const match = fileContent.match(/issue_number:\s*(\d+)/);
          if (match && parseInt(match[1], 10) === parseInt(issueNumber, 10)) {
            return { path: file.path, sha: file.sha };
          }
        } catch (error) {
          console.error(`Error reading file ${file.path} in ${targetRepo.owner}/${targetRepo.repo}:`, error.message);
        }
      }
    } catch (error) {
      if (error.status === 404) {
        console.log(`Content directory not found in ${targetRepo.owner}/${targetRepo.repo}`);
      } else {
        console.error(`Error searching files in ${targetRepo.owner}/${targetRepo.repo}:`, error.message);
      }
    }

    return null;
  } catch (error) {
    console.error(`Error finding old file in ${targetRepo.owner}/${targetRepo.repo}:`, error.message);
    return null;
  }
}

// 导出函数供 GitHub Actions 使用
// Export functions for GitHub Actions
const BlogUtils = {
  BLOG_DIR,
  generateFrontMatter,
  sanitizeFilename,
  sanitizeFilenameAsync,
  translateWithGoogleFree,
  translateChineseToEnglishFallback,
  groupIssuesByYearMonth,
  generateReadmeContent,
  createBlogFileContent,
  createBlogFileContentAsync,
  groupIssuesByCategory,
  generatePaginationInfo,
  generateBlogIndexContent,
  generatePaginationNav,
  generateBlogIndexStyles,
  syncFileToRepo,
  deleteFileFromRepo,
  findOldFileInRepo
}

// 调试信息
console.log('BlogUtils对象创建完成，包含属性:', Object.keys(BlogUtils));
console.log('module类型:', typeof module);
console.log('module.exports类型:', typeof module?.exports);

// 兼容不同的模块系统
if (typeof module !== 'undefined' && module.exports) {
  console.log('设置module.exports前:', module.exports);
  module.exports = BlogUtils;
  console.log('设置module.exports后:', module.exports);
  console.log('BlogUtils已通过module.exports导出');
} else if (typeof global !== 'undefined') {
  global.BlogUtils = BlogUtils
  console.log('BlogUtils已设置到global');
} else {
  // 直接在全局作用域中定义
  this.BlogUtils = BlogUtils
  console.log('BlogUtils已设置到this');
}

// 博客工具函数库
// Blog utility functions library

/**
 * 生成 Front Matter
 * Generate Front Matter
 * @param {Object} issue - GitHub issue 对象
 * @returns {string} - Front Matter 字符串
 */
function generateFrontMatter(issue) {
  const title = issue.title;
  const author = issue.user.login;
  const createdAt = issue.created_at.split('T')[0];
  const updatedAt = issue.updated_at.split('T')[0];
  const tags = issue.labels.map(label => label.name);
  const issueNumber = issue.number;

  return [
    '---',
    'layout: default',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `author: "${author}"`,
    `date: ${createdAt}`,
    `last_modified_at: ${updatedAt}`,
    `tags: [${tags.join(', ')}]`,
    `issue_number: ${issueNumber}`,
    '---',
    ''
  ].join('\n');
}

/**
 * 清理文件名中的非法字符
 * Sanitize filename by removing illegal characters
 * @param {string} title - 原始标题
 * @returns {string} - 清理后的文件名
 */
function sanitizeFilename(title) {
  return title.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * 按年月分组 issues
 * Group issues by year and month
 * @param {Array} issues - issues 数组
 * @returns {Object} - 按年月分组的 issues
 */
function groupIssuesByYearMonth(issues) {
  const issuesByYearMonth = {};
  
  issues.forEach(issue => {
    // 跳过 Pull Requests
    if (issue.pull_request) return;
    
    const createdDate = new Date(issue.created_at);
    const yearMonth = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!issuesByYearMonth[yearMonth]) {
      issuesByYearMonth[yearMonth] = [];
    }
    
    issuesByYearMonth[yearMonth].push({
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state
    });
  });
  
  return issuesByYearMonth;
}

/**
 * 生成 README 内容
 * Generate README content
 * @param {Object} issuesByYearMonth - 按年月分组的 issues
 * @param {number} totalCount - 总文章数
 * @returns {string} - README 内容
 */
function generateReadmeContent(issuesByYearMonth, totalCount) {
  let readmeContent = '# Post\n\n';
  readmeContent += '这是一个基于 GitHub Issues 的博客系统。每个 Issue 会自动转换为博客文章。\n\n';
  readmeContent += '## 📝 文章列表\n\n';

  // 按年月倒序排列
  const sortedYearMonths = Object.keys(issuesByYearMonth).sort().reverse();
  
  if (sortedYearMonths.length === 0) {
    readmeContent += '暂无文章。\n\n';
  } else {
    sortedYearMonths.forEach(yearMonth => {
      const [year, month] = yearMonth.split('-');
      const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                        '七月', '八月', '九月', '十月', '十一月', '十二月'];
      const monthName = monthNames[parseInt(month) - 1];
      
      readmeContent += `### ${year}年${monthName}\n\n`;
      
      // 按 issue 编号倒序排列（最新的在前）
      const sortedIssues = issuesByYearMonth[yearMonth].sort((a, b) => b.number - a.number);
      
      sortedIssues.forEach(issue => {
        readmeContent += `- [${issue.title}](${issue.url})\n`;
      });
      
      readmeContent += '\n';
    });
  }

  readmeContent += '---\n\n';
  readmeContent += '💡 **使用说明**：创建新的 Issue 即可自动生成博客文章，文章内容为 Issue 的正文部分。\n\n';
  readmeContent += `📊 **统计信息**：共有 ${totalCount} 篇文章\n\n`;
  readmeContent += `🔄 **最后更新**：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n`;
  
  return readmeContent;
}

/**
 * 创建博客文件内容
 * Create blog file content
 * @param {Object} issue - GitHub issue 对象
 * @returns {Object} - 包含文件路径和内容的对象
 */
function createBlogFileContent(issue) {
  const frontMatter = generateFrontMatter(issue);
  const sanitizedTitle = sanitizeFilename(issue.title);
  const filePath = `docs/${sanitizedTitle}.md`;
  const content = frontMatter + (issue.body || '');
  
  return {
    filePath,
    content,
    filename: `${sanitizedTitle}.md`
  };
}

// 导出函数供 GitHub Actions 使用
// Export functions for GitHub Actions
const BlogUtils = {
  generateFrontMatter,
  sanitizeFilename,
  groupIssuesByYearMonth,
  generateReadmeContent,
  createBlogFileContent
};

// 兼容不同的模块系统
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogUtils;
} else if (typeof global !== 'undefined') {
  global.BlogUtils = BlogUtils;
} else {
  // 直接在全局作用域中定义
  this.BlogUtils = BlogUtils;
}
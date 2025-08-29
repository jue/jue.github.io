// 测试新的frontmatter生成函数
const fs = require('fs')
const path = require('path')

// 加载工具函数
const utilsPath = path.join(process.cwd(), '.github/scripts/blog-utils.js')
const utilsCode = fs.readFileSync(utilsPath, 'utf8')

// 设置全局对象来接收导出
global.module = { exports: {} }
eval(utilsCode)
const BlogUtils = global.BlogUtils || global.module.exports

// 模拟一个issue对象
const mockIssue = {
  title: '测试文章标题：包含"引号"和特殊字符',
  user: { login: 'jue' },
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T12:00:00Z',
  number: 123,
  body: '这是一篇测试文章的内容。它包含了很多有用的信息，帮助我们理解如何使用VitePress和createContentLoader来构建现代化的博客系统。这里有更多的内容来测试字数统计功能，包括一些English words来测试混合语言的字数计算。',
  labels: [
    { name: 'Category:技术教程' },
    { name: 'VitePress' },
    { name: '博客' },
    { name: 'Vue.js' }
  ]
}

// 生成frontmatter
const frontMatter = BlogUtils.generateFrontMatter(mockIssue)
console.log('生成的frontmatter:')
console.log(frontMatter)

// 清理测试文件
fs.unlinkSync(__filename)

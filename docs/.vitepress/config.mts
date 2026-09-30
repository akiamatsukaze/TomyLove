import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// 自动扫描 posts 目录，生成文章列表（新文章只要放进 posts 文件夹就会自动出现）
function listPosts() {
  const dir = fileURLToPath(new URL('../posts', import.meta.url))
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .sort()
    .reverse()
    .map((file) => {
      const raw = readFileSync(fileURLToPath(new URL(`../posts/${file}`, import.meta.url)), 'utf-8')
      const titleMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      let title = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
      if (titleMatch) {
        const t = titleMatch[1].match(/^title:\s*(.+)$/m)
        if (t) title = t[1].trim().replace(/^['"]|['"]$/g, '')
      }
      const date = file.slice(0, 10)
      return { text: `${date} · ${title}`, link: `/posts/${file.replace(/\.md$/, '')}` }
    })
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'TomyLove',
  description: '我们的恋爱小窝，记录与你在一起的每一个瞬间',
  cleanUrls: true,
  lastUpdated: false,
  themeConfig: {
    siteTitle: 'TomyLove',
    search: {
      provider: 'local'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '我们的故事', link: '/posts/' },
      { text: '时间轴', link: '/timeline' },
      { text: '许愿清单', link: '/wishlist' }
    ],
    sidebar: {
      '/posts/': [
        { text: '我们的故事', link: '/posts/' },
        ...listPosts()
      ]
    },
    outline: { label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '夜间模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    footer: {
      message: '把喜欢，都记在这里',
      copyright: 'Made with love · TomyLove'
    }
  }
})
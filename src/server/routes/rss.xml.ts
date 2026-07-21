import { Feed } from 'feed'

/** RSS 中最多输出的文章数 */
const RSS_ITEM_LIMIT = 20

const SITE = {
  title: '江晚正愁余 Blog',
  description: '前端开发者的个人博客，分享前端技术、Nuxt3、Vue3 开发经验与生活感悟',
  author: '江晚正愁余'
}

const stripMarkdown = (text: string): string =>
  (text || '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*`_>~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * RSS 2.0 订阅源（移植自 ThriveX 的 /api/rss）。
 * 访问 /rss.xml 获取，数据来自后端公开文章接口。
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = String(config.public.baseURL || '').replace(/\/+$/, '')
  const siteUrl = getRequestURL(event).origin

  const feed = new Feed({
    title: SITE.title,
    description: SITE.description,
    id: siteUrl,
    link: siteUrl,
    language: 'zh-CN',
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${SITE.author}`,
    author: { name: SITE.author, link: siteUrl }
  })

  try {
    const res: any = await $fetch(`${apiBase}/public/article/list`, {
      query: { page: 1, limit: RSS_ITEM_LIMIT }
    })

    const items = res?.code === 200 ? res.data?.items || [] : []

    for (const article of items) {
      const link = `${siteUrl}/article/${article.id}`
      feed.addItem({
        title: article.title || '无标题',
        id: link,
        link,
        description: article.summary || stripMarkdown(article.content).slice(0, 200),
        content: article.content || '',
        image: article.cover || undefined,
        date: article.createTime ? new Date(article.createTime) : new Date()
      })
    }
  } catch (err) {
    // 后端不可用时返回空订阅源，而不是 500——避免订阅器把整个源标记为失效
    console.error('[rss] 获取文章列表失败:', err)
  }

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  setHeader(event, 'cache-control', 'max-age=1800, s-maxage=1800')
  return feed.rss2()
})

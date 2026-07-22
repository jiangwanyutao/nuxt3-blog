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
 * RSS 2.0 订阅源。
 * 访问 /rss.xml 获取，数据来自后端公开文章接口。
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = getRequestURL(event).origin

  /*
   * 生产环境 NUXT_PUBLIC_API_BASE 是相对路径 /api，由 vercel.json 的边缘重写
   * 转发到 api.jwyt.xyz。但边缘重写只作用于进入 Vercel 的请求，
   * 而本路由跑在 Nitro 服务端函数里：$fetch('/api/...') 会被当成内部路由解析，
   * 而 /api 又在 nitro.ignore 里，结果 404 → 被 catch 吞掉 → 输出空 feed。
   * 补上站点 origin 变成绝对地址，请求就会正常出网并命中那条重写。
   */
  const rawBase = String(config.public.baseURL || '').replace(/\/+$/, '')
  const apiBase = /^https?:\/\//.test(rawBase) ? rawBase : `${siteUrl}${rawBase}`

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

    // 加密文章不进订阅：正文本就取不到，只推标题和摘要，订阅者点开只会撞上密码框。
    // 主列表仍然保留它们，所以这里得自己过滤，不能指望接口已经排除。
    const all = res?.code === 200 ? res.data?.items || [] : []
    const items = all.filter((a: any) => !a.isEncrypted)

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

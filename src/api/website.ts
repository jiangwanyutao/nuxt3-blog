import requestUtil from '~/composables/requestUtil'

/**
 * 网站统计数据类型
 */
export interface WebsiteStats {
  articleCount: number
  runningDays: number
  visitCount: number
}

/**
 * 获取网站统计数据
 */
export const apiGetWebsiteStats = (): Promise<WebsiteStats> => {
  return requestUtil.get('/website-config/stats')
}

/** 站点数据看板概览数字 */
export interface SiteStatsOverview {
  articleCount: number
  wordCount: number
  viewCount: number
  likeCount: number
  commentCount: number
  categoryCount: number
  tagCount: number
  runningDays: number
}

export interface NameValue {
  name: string
  value: number
}

export interface SiteStats {
  overview: SiteStatsOverview
  categories: NameValue[]
  tags: NameValue[]
  trend: { month: string; value: number }[]
}

/** 站点数据看板（公开）：概览数字 + 分类分布 + 标签词频 + 发文趋势 */
export const getSiteStats = () => {
  return requestUtil.get('/website-config/site-stats', {}, { isToken: false })
}

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

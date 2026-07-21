const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * 把时间格式化为「刚刚 / N 分钟前 / N 小时前 / N 天前」，超过一周退回具体日期。
 * 评论区与留言墙共用，避免两处各写一份导致文案不一致。
 */
export const formatRelativeTime = (dateString?: string | null): string => {
  if (!dateString) return ''

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''

  const diff = Date.now() - date.getTime()

  // 服务端与客户端存在轻微时钟差时可能得到负值，统一按「刚刚」处理
  if (diff < MINUTE) return '刚刚'
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} 分钟前`
  if (diff < DAY) return `${Math.floor(diff / HOUR)} 小时前`
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)} 天前`

  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

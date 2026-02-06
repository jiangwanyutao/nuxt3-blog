import requestUtil from '~/composables/requestUtil'

/**
 * 获取说说评论列表
 * @param momentId 说说ID（传0表示获取页面级评论）
 * @param pageNum 页码
 * @param pageSize 每页数量
 */
export const getMomentsCommentList = (momentId: number = 0, pageNum: number = 1, pageSize: number = 10) => {
  return requestUtil.get(`/moments/${momentId}/comments`, {
    pageNum,
    pageSize
  }, { isToken: false })
}

/**
 * 添加说说评论（游客）
 * @param momentId 说说ID（传0表示页面级评论）
 * @param commentData 评论数据
 */
export const addMomentsComment = (momentId: number = 0, commentData: {
  content: string
  parentId?: number
  name: string
  email: string
  website?: string
  captcha: string
  captchaUuid: string
  clientIp?: string
  browser?: string
  os?: string
}) => {
  return requestUtil.post(`/moments/${momentId}/comments/guest`, commentData, { isToken: false })
}

/**
 * 获取回复列表
 * @param parentId 父评论ID
 * @param pageNum 页码
 * @param pageSize 每页数量
 */
export const getMomentsReplyList = (parentId: number, pageNum: number = 1, pageSize: number = 10) => {
  return requestUtil.get('/moments/comments/replies', {
    parentId,
    pageNum,
    pageSize
  }, { isToken: false })
}

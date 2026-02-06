import requestUtil from '~/composables/requestUtil'

// 评论相关接口

/**
 * 获取文章评论列表
 * @param articleId 文章ID
 * @param pageNum 页码
 * @param pageSize 每页数量
 */
export const getCommentList = (articleId: number, pageNum: number = 1, pageSize: number = 10) => {
  return requestUtil.get('/comment/page', {
    articleId,
    pageNum,
    pageSize
  }, { isToken: false })
}

/**
 * 获取回复列表
 * @param parentId 父评论ID
 * @param pageNum 页码
 * @param pageSize 每页数量
 */
export const getReplyList = (parentId: number, pageNum: number = 1, pageSize: number = 10) => {
  return requestUtil.get('/comment/replyPage', {
    parentId,
    pageNum,
    pageSize
  }, { isToken: false })
}

/**
 * 添加评论（游客评论，不需要登录）
 * @param commentData 评论数据
 */
export const addComment = (commentData: {
  articleId: number
  content: string
  parentId?: number
  replyUserId?: number
  name: string
  email: string
  website?: string
  captcha: string
  captchaUuid: string
}) => {
  return requestUtil.post('/comment/guest/save', commentData, { isToken: false })
}

/**
 * 添加评论（需要登录）
 * @param commentData 评论数据
 */
export const addUserComment = (commentData: {
  articleId: number
  content: string
  parentId?: number
  replyUserId?: number
}) => {
  return requestUtil.post('/comment/save', commentData, { isToken: true })
}

/**
 * 删除评论（需要登录）
 * @param commentId 评论ID
 */
export const deleteComment = (commentId: number) => {
  return requestUtil.delete(`/comment/remove/${commentId}`, {}, { isToken: true })
}

/**
 * 评论点赞（需要登录）
 * @param commentId 评论ID
 * @param status 点赞状态 1-点赞 0-取消点赞
 */
export const likeComment = (commentId: number, status: number) => {
  return requestUtil.post('/comment/liked', {
    commentId,
    status
  }, { isToken: true })
}

/**
 * 获取用户点赞评论列表（需要登录）
 * @param userId 用户ID
 */
export const getUserLikedComments = (userId: number) => {
  return requestUtil.get(`/comment/cidList/${userId}`, {}, { isToken: true })
}

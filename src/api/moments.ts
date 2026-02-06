import requestUtil from '~/composables/requestUtil'
import type { ApiResponse, PageData } from '~/types/api'

// 说说接口定义
export interface MomentItem {
  id: number
  userId: number
  content: string
  images?: string[]
  linkUrl?: string
  linkTitle?: string
  linkDescription?: string
  linkImage?: string
  topics?: string[]
  location?: string
  isPublic: boolean
  allowComment: boolean
  likeCount: number
  commentCount: number
  shareCount: number
  viewCount: number
  createTime: string
  updateTime: string
  user?: {
    userId: number
    userName: string
    nickName: string
    avatar?: string
  }
  isLiked?: boolean
}

// 分页查询参数
export interface MomentsQuery {
  page?: number
  size?: number
  userId?: number
  keyword?: string
  isPublic?: boolean
}

// 说说分页响应数据
export type MomentsPageData = PageData<MomentItem>

/**
 * 获取说说列表（前端使用，只获取公开的说说）
 */
export const getMomentsList = (query: MomentsQuery = {}) => {
  const params = {
    page: query.page || 1,
    size: query.size || 10,
    isPublic: true, // 前端只获取公开的说说
    ...query
  }
  return requestUtil.get('/moments', params, { isToken: false }) as Promise<ApiResponse<MomentsPageData>>
}

/**
 * 获取说说详情
 */
export const getMomentDetail = (id: number) => {
  return requestUtil.get(`/moments/${id}`, {}, { isToken: false }) as Promise<ApiResponse<MomentItem>>
}

/**
 * 发布说说（需要登录）
 */
export const createMoment = (data: {
  content: string
  images?: string[]
  linkUrl?: string
  topics?: string[]
  location?: string
  isPublic?: boolean
  allowComment?: boolean
}) => {
  return requestUtil.post('/moments', data) as Promise<ApiResponse<MomentItem>>
}

/**
 * 点赞/取消点赞（需要登录）
 */
export const toggleMomentLike = (id: number) => {
  return requestUtil.post(`/moments/${id}/like`) as Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>>
}

/**
 * 获取说说评论
 */
export const getMomentComments = (id: number, page: number = 1, size: number = 10) => {
  return requestUtil.get(`/moments/${id}/comments`, { page, size }, { isToken: false }) as Promise<ApiResponse<any>>
}

/**
 * 添加评论（需要登录）
 */
export const addMomentComment = (id: number, data: {
  content: string
  parentId?: number
}) => {
  return requestUtil.post(`/moments/${id}/comments`, data) as Promise<ApiResponse<any>>
}

/**
 * 获取链接预览
 */
export const getLinkPreview = (url: string) => {
  return requestUtil.post('/moments/link-preview', { url }, { isToken: false }) as Promise<ApiResponse<{
    title: string
    description: string
    image: string
    url: string
  }>>
}

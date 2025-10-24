import requestUtil from '~/composables/requestUtil'

// 友链接口类型定义
export interface FriendLink {
  id?: number
  name: string
  description: string
  url: string
  email: string
  logo: string
  cover: string
  status?: string
  sort?: number
  visible?: string
  createTime?: string
  updateTime?: string
}

/**
 * 获取已通过的友链列表（前台）
 */
export const getApprovedFriendLinks = () => {
  return requestUtil.get('/public/friend-link/list', {}, { isToken: false })
}

/**
 * 申请友链（前台）
 */
export const applyFriendLink = (data: FriendLink) => {
  return requestUtil.post('/public/friend-link/apply', data, { isToken: false, toast: true })
}

import requestUtil from '~/composables/requestUtil'

// 留言墙相关接口

export interface WallCate {
  id: number
  name: string
  mark: string
  sort: number
}

export interface WallItem {
  id: number
  cateId: number
  name?: string
  content: string
  color: string
  address?: string
  createTime: string
  cate?: WallCate
}

/** 获取留言分类列表 */
export const getWallCateList = () => {
  return requestUtil.get('/wall/cate', {}, { isToken: false })
}

/**
 * 获取已通过审核的留言
 * @param cateId 分类ID，0 表示全部
 */
export const getWallList = (cateId: number = 0, pageNum: number = 1, pageSize: number = 60) => {
  return requestUtil.get('/wall/list', { cateId, pageNum, pageSize }, { isToken: false })
}

/** 游客提交留言 */
export const addWall = (data: {
  cateId: number
  content: string
  name?: string
  email?: string
  color?: string
  captcha: string
  captchaUuid: string
}) => {
  return requestUtil.post('/wall/guest/save', data, { isToken: false })
}

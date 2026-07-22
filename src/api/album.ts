import requestUtil from '~/composables/requestUtil'

export interface AlbumItem {
  id: number
  name: string
  description?: string
  cover?: string
  /** 由后端聚合，前台只读 */
  photoCount?: number
  createTime?: string
}

export interface PhotoItem {
  id: number
  name?: string
  description?: string
  url: string
  /** 后台上传时记录的原始尺寸，前台靠它算占位比例，避免加载时布局跳动 */
  width?: number
  height?: number
  size?: number
  createTime?: string
}

/** 公开相册列表（仅前台可见的相册） */
export const getAlbumList = () => {
  return requestUtil.get('/album/list', {}, { isToken: false })
}

/** 相册内照片，分页 */
export const getAlbumPhotos = (albumId: number, params: { page?: number; size?: number } = {}) => {
  return requestUtil.get(`/album/${albumId}/photos`, params, { isToken: false })
}

/**
 * 通用 API 响应接口
 * 用于统一所有 API 请求的响应格式
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message?: string
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  page?: number
  size?: number
}

/**
 * 分页响应数据
 */
export interface PageData<T = any> {
  list: T[]
  total: number
  page: number
  size: number
}

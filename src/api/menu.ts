import requestUtil from '~/composables/requestUtil'
import type { ApiResponse } from '~/types/api'

// 菜单项接口定义
export interface MenuTreeItem {
  menuId: number
  icon?: string
  text: string
  path?: string | null
  class?: string | null
  sort: number
  parentId?: number | null
  isExternal: string
  visible: string
  enabled: string
  children?: MenuTreeItem[]
}

/**
 * 获取网站菜单树形结构（前端使用）
 */
export const getMenuTree = () => {
  return requestUtil.get('/website-menu/list', {}, { isToken: false }) as Promise<ApiResponse<MenuTreeItem[]>>
}

/**
 * 获取所有菜单（管理后台使用）
 */
export const getAllMenus = (query?: any) => {
  return requestUtil.get('/website-menu/admin/list', query) as Promise<ApiResponse<MenuTreeItem[]>>
}

/**
 * 获取菜单树形结构（管理后台使用）
 */
export const getAllMenuTree = () => {
  return requestUtil.get('/website-menu/admin/tree') as Promise<ApiResponse<MenuTreeItem[]>>
}

/**
 * 根据ID获取菜单
 */
export const getMenuById = (id: number) => {
  return requestUtil.get(`/website-menu/${id}`) as Promise<ApiResponse<MenuTreeItem>>
}

/**
 * 创建菜单
 */
export const createMenu = (data: Partial<MenuTreeItem>) => {
  return requestUtil.post('/website-menu', data) as Promise<ApiResponse<MenuTreeItem>>
}

/**
 * 更新菜单
 */
export const updateMenu = (id: number, data: Partial<MenuTreeItem>) => {
  return requestUtil.put(`/website-menu/${id}`, data) as Promise<ApiResponse<MenuTreeItem>>
}

/**
 * 删除菜单
 */
export const deleteMenu = (id: number) => {
  return requestUtil.delete(`/website-menu/${id}`) as Promise<ApiResponse<any>>
}

/**
 * 批量更新排序
 */
export const batchUpdateSort = (items: Array<{ menuId: number; sort: number; parentId?: number }>) => {
  return requestUtil.put('/website-menu/batch-sort', { items }) as Promise<ApiResponse<any>>
}

/**
 * 初始化默认菜单数据
 */
export const initDefaultMenus = () => {
  return requestUtil.post('/website-menu/init') as Promise<ApiResponse<any>>
}

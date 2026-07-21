import requestUtil from '~/composables/requestUtil'

// 足迹相关接口

export interface FootprintItem {
  id: number
  title: string
  address: string
  content?: string
  /** 经纬度，格式 "lng,lat" */
  position: string
  images?: string[]
  eventDate: string
}

export interface GaodeConfig {
  key: string
  securityCode: string
}

/** 获取足迹列表（按到访时间倒序，一次性返回供地图打点） */
export const getFootprintList = () => {
  return requestUtil.get('/footprint/list', {}, { isToken: false })
}

/** 获取高德地图配置（站长在后台「参数设置」中填写） */
export const getGaodeConfig = () => {
  return requestUtil.get('/footprint/gaode-config', {}, { isToken: false })
}

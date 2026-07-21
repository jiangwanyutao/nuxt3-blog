import requestUtil from '~/composables/requestUtil'

// 里程碑相关接口

export interface MilestoneItem {
  id: number
  title: string
  description?: string
  image?: string
  tags?: string[]
  eventDate: string
}

/** 获取里程碑列表（按事件时间倒序，一次性返回） */
export const getMilestoneList = () => {
  return requestUtil.get('/milestone/list', {}, { isToken: false })
}

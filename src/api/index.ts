import * as poetry from './poetry'
import * as common from './common'
import * as auth from './auth'
import * as menu from './menu'
import * as moments from './moments'
import * as article from './article'
import * as comment from './comment'
import * as friendLink from './friendLink'
import * as momentsComment from './moments-comment'
import * as website from './website'
import * as captcha from './captcha'

// 命名空间风格导出（供 api.auth.xxx 调用）
export default {
  poetry,
  common,
  auth,
  menu,
  moments,
  article,
  comment,
  friendLink,
  momentsComment,
  website,
  captcha,
}

// 按模块 re-export（供直接 import { getArticleList } from '~/api' 使用）
export * from './article'
export * from './auth'
export * from './comment'
export * from './moments'
export * from './moments-comment'
export * from './friendLink'
export * from './website'
export * from './captcha'
export * from './common'
export * from './menu'
export * from './poetry'

import requestUtil from '~/composables/requestUtil'

// 验证码相关接口

/**
 * 获取验证码图片
 * @returns 验证码数据
 */
export const getCaptcha = () => {
  return requestUtil.get('/captchaImage', {}, { isToken: false })
}

/**
 * 验证验证码
 * @param captcha 验证码文本
 * @param uuid 验证码UUID
 */
export const verifyCaptcha = (captcha: string, uuid: string) => {
  return requestUtil.post('/verifyCaptcha', {
    captcha,
    uuid
  }, { isToken: false })
}

// 验证码数据类型
export interface CaptchaData {
  captchaEnabled: boolean
  img: string
  uuid: string
}

/**
 * 封装请求 (SSR 兼容)
 *
 * @param url
 * @param opt
 * @param custom
 */
const fetch = async (url: string, opt: object = {}, custom: any = { isToken: true }) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL

  try {
    // 仅客户端显示 loading
    if (process.client) {
      utilMsg.$loadingBar.start()
    }

    //判断是否需要设置token
    const isToken = custom.isToken
    let authorization = ''
    if (isToken && process.client) {
      authorization = 'Bearer ' + localStorage.getItem('sj_token')
    }

    // 使用 $fetch 替代 useFetch
    const response: any = await $fetch(url, {
      ...opt,
      baseURL,
      headers: {
        authorization
      }
    })

    // 仅客户端隐藏 loading
    if (process.client) {
      utilMsg.$loadingBar.finish()
    }

    // 根据参数, 判断是否显示成功的消息
    if (process.client && custom?.toast && response?.msg) {
      utilMsg.$message.success(response.msg)
    }

    return response
  } catch (error: any) {
    // 仅客户端处理 UI 反馈
    if (process.client) {
      utilMsg.$loadingBar.finish()

      if (error?.data?.code === 401) {
        utilMsg.$message.error('请先登录')
      } else if (error?.data?.message) {
        utilMsg.$message.error(error.data.message)
      } else {
        utilMsg.$message.error('请求失败')
      }
    } else {
      // 服务端打印错误日志
      console.error('[SSR Request Error]', url, error?.data?.message || error?.message)
    }

    // 如果需要catch返回，则进行reject
    if (custom?.catch) {
      throw error
    }

    return null
  }
}

export default {
  get(url: string, params: object = {}, custom: object = {}) {
    return fetch(url, { method: 'get', params }, custom)
  },

  post(url: string, body: object = {}, custom: object = {}) {
    return fetch(url, { method: 'post', body }, custom)
  },

  put(url: string, body: object = {}, custom: object = {}) {
    return fetch(url, { method: 'put', body }, custom)
  },

  delete(url: string, body: object = {}, custom: object = {}) {
    return fetch(url, { method: 'delete', body }, custom)
  }
}

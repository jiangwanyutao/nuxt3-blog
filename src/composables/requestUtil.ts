/**
 * 封装请求
 *
 * @param url
 * @param opt
 * @param custom
 */
const fetch = async (url: string, opt: object = {}, custom: any = { isToken: true }) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL

  try {
    // 请求开始的时候, 显示加载 loading
    utilMsg.$loadingBar.start()

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

    // 隐藏Loading
    utilMsg.$loadingBar.finish()

    // 根据参数, 判断是否显示成功的消息
    if (custom?.toast && response?.message) {
      utilMsg.$message.success(response.message)
    }

    return response
  } catch (error: any) {
    // 隐藏Loading
    utilMsg.$loadingBar.finish()

    // 处理错误
    if (error?.data?.code === 401) {
      // 重定向到登录
      utilMsg.$message.error('请先登录')
    } else if (error?.data?.message) {
      utilMsg.$message.error(error.data.message)
    } else {
      utilMsg.$message.error('请求失败')
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

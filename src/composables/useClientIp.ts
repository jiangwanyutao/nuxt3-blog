/**
 * 获取客户端真实IP地址
 */
export const useClientIp = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL || 'http://localhost:8080'
  console.log(baseURL,'请求的api地址1')

  /**
   * 获取客户端IP（快速版本，使用自己的后端接口）
   */
  const getClientIp = async (): Promise<string> => {
    try {
      // 优先使用自己的后端接口（速度快，不依赖第三方）
      const response = await fetch(`${baseURL}/ip/current`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.code === 200 && result.data?.ip) {
          console.log('从后端接口获取到IP:', result.data.ip)
          return result.data.ip
        }
      }
    } catch (error) {
      console.error('从后端获取IP失败:', error)
    }

    // 备用方案：返回空字符串（后端会自动从请求中提取IP）
    console.log('使用备用方案，后端将自动提取IP')
    return ''
  }

  /**
   * 获取客户端IP和地区信息
   */
  const getClientIpInfo = async (): Promise<{ ip: string; region: string; regionFormatted: string }> => {
    try {
      const response = await fetch(`${baseURL}/ip/info`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.code === 200 && result.data) {
          console.log('获取到IP信息:', result.data)
          return {
            ip: result.data.ip || '',
            region: result.data.region || '',
            regionFormatted: result.data.regionFormatted || '',
          }
        }
      }
    } catch (error) {
      console.error('获取IP信息失败:', error)
    }

    return {
      ip: '',
      region: '',
      regionFormatted: '',
    }
  }

  return {
    getClientIp,
    getClientIpInfo,
  }
}

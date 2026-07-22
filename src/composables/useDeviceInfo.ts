/**
 * 获取设备和浏览器信息
 */
export const useDeviceInfo = () => {
  /**
   * 获取浏览器信息
   */
  const getBrowserInfo = (): string => {
    const ua = navigator.userAgent
    let browser = 'Unknown'
    let version = ''

    // 检测浏览器类型
    if (ua.indexOf('Edge') > -1 || ua.indexOf('Edg') > -1) {
      browser = 'Edge'
      const match = ua.match(/Edg[e]?\/(\d+\.\d+\.\d+\.\d+)/)
      version = match ? match[1] : ''
    } else if (ua.indexOf('Chrome') > -1 && ua.indexOf('Safari') > -1) {
      browser = 'Chrome'
      const match = ua.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/)
      version = match ? match[1] : ''
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      browser = 'Safari'
      const match = ua.match(/Version\/(\d+\.\d+)/)
      version = match ? match[1] : ''
    } else if (ua.indexOf('Firefox') > -1) {
      browser = 'Firefox'
      const match = ua.match(/Firefox\/(\d+\.\d+)/)
      version = match ? match[1] : ''
    } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
      browser = 'IE'
      const match = ua.match(/(?:MSIE |rv:)(\d+\.\d+)/)
      version = match ? match[1] : ''
    }

    return version ? `${browser} ${version}` : browser
  }

  /**
   * Windows 11 的 UA 与 Windows 10 完全相同（均为 Windows NT 10.0），
   * 只能通过 User-Agent Client Hints 的 platformVersion 区分：主版本 >= 13 即 Win11。
   * 浏览器不支持 UA-CH 时返回空字符串，由调用方回退到 UA 判断。
   */
  const detectWindowsVersionByHints = async (): Promise<string> => {
    const uaData = (navigator as any).userAgentData
    if (!uaData?.getHighEntropyValues) return ''

    try {
      const hints = await uaData.getHighEntropyValues(['platformVersion'])
      const major = parseInt(String(hints?.platformVersion || '0').split('.')[0], 10)
      if (!Number.isFinite(major) || major <= 0) return ''
      return major >= 13 ? '11' : '10'
    } catch {
      return ''
    }
  }

  /**
   * 获取操作系统信息（Windows 走 UA-CH 精确识别 10/11）
   */
  const getOSInfo = async (): Promise<string> => {
    const ua = navigator.userAgent
    let os = 'Unknown'
    let version = ''

    if (ua.indexOf('Win') > -1) {
      os = 'Windows'
      if (ua.indexOf('Windows NT 10.0') > -1) {
        version = (await detectWindowsVersionByHints()) || '10'
      } else if (ua.indexOf('Windows NT 6.3') > -1) version = '8.1'
      else if (ua.indexOf('Windows NT 6.2') > -1) version = '8'
      else if (ua.indexOf('Windows NT 6.1') > -1) version = '7'
    } else if (ua.indexOf('Mac') > -1) {
      os = 'macOS'
      const match = ua.match(/Mac OS X (\d+[._]\d+[._]\d+)/)
      if (match) {
        version = match[1].replace(/_/g, '.')
      }
    } else if (ua.indexOf('Linux') > -1) {
      os = 'Linux'
    } else if (ua.indexOf('Android') > -1) {
      os = 'Android'
      const match = ua.match(/Android (\d+\.\d+)/)
      version = match ? match[1] : ''
    } else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
      os = 'iOS'
      const match = ua.match(/OS (\d+_\d+)/)
      if (match) {
        version = match[1].replace(/_/g, '.')
      }
    }

    return version ? `${os} ${version}` : os
  }

  /**
   * 获取设备类型
   */
  const getDeviceType = (): string => {
    const ua = navigator.userAgent

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet'
    }
    if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return 'Mobile'
    }
    return 'Desktop'
  }

  /**
   * 获取完整的设备信息
   */
  const getDeviceInfo = async () => {
    const browser = getBrowserInfo()
    const os = await getOSInfo()
    const deviceType = getDeviceType()

    return {
      browser,
      os,
      deviceType,
      userAgent: navigator.userAgent
    }
  }

  return {
    getBrowserInfo,
    getOSInfo,
    getDeviceType,
    getDeviceInfo
  }
}

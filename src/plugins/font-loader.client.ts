/**
 * 字体加载检测插件
 * 
 * 功能：
 * 1. 检测 Google Fonts CDN 字体是否加载成功
 * 2. 加载成功后添加 .fonts-loaded 类
 * 3. 加载失败后添加 .fonts-failed 类，降级到本地字体
 * 4. 使用 Font Loading API 进行精确检测
 */

export default defineNuxtPlugin(() => {
  if (process.client) {
    // 检查浏览器是否支持 Font Loading API
    if ('fonts' in document) {
      // 要检测的字体列表
      const fontsToLoad = [
        { family: 'Noto Sans SC', weight: '400' },
        { family: 'Noto Sans SC', weight: '700' }
      ]

      // 创建字体检测 Promise 数组
      const fontPromises = fontsToLoad.map(font => 
        document.fonts.load(`${font.weight} 16px "${font.family}"`)
      )

      // 设置超时时间（3秒）
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Font loading timeout')), 3000)
      )

      // 竞速：字体加载 vs 超时
      Promise.race([
        Promise.all(fontPromises),
        timeoutPromise
      ])
        .then(() => {
          // ✅ CDN 字体加载成功
          console.log('[Font Loader] ✅ Google Fonts loaded successfully')
          document.documentElement.classList.add('fonts-loaded')
          
          // 移除可能存在的失败标记
          document.documentElement.classList.remove('fonts-failed')
          
          // 存储加载状态到 localStorage
          localStorage.setItem('fonts-loaded', 'true')
        })
        .catch((error) => {
          // ❌ CDN 字体加载失败，降级到本地字体
          console.warn('[Font Loader] ⚠️ CDN fonts failed, falling back to local fonts:', error.message)
          document.documentElement.classList.add('fonts-failed')
          
          // 尝试加载本地备份字体
          tryLoadLocalFonts()
        })
    } else {
      // 浏览器不支持 Font Loading API，直接使用本地字体
      console.warn('[Font Loader] ⚠️ Font Loading API not supported, using local fonts')
      document.documentElement.classList.add('fonts-failed')
      tryLoadLocalFonts()
    }
  }
})

/**
 * 尝试加载本地备份字体
 */
function tryLoadLocalFonts() {
  // 检查本地字体是否可用
  if ('fonts' in document) {
    const localFontPromises = [
      document.fonts.load('400 16px "MiSans Local"'),
      document.fonts.load('700 16px "MiSans Local"')
    ]

    Promise.all(localFontPromises)
      .then(() => {
        console.log('[Font Loader] ✅ Local backup fonts loaded')
        document.documentElement.classList.add('fonts-loaded')
        document.documentElement.classList.remove('fonts-failed')
      })
      .catch(() => {
        console.error('[Font Loader] ❌ Both CDN and local fonts failed, using system fonts')
        // 保持 fonts-failed 类，使用系统字体
      })
  }
}

/**
 * 字体加载性能监控（可选）
 */
if (process.client && process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    // 使用 Performance API 监控字体加载时间
    const fontEntries = performance.getEntriesByType('resource').filter(
      (entry: any) => entry.name.includes('fonts.googleapis.com') || entry.name.includes('fonts.gstatic.com')
    )

    if (fontEntries.length > 0) {
      const totalSize = fontEntries.reduce((sum: number, entry: any) => sum + (entry.transferSize || 0), 0)
      const avgDuration = fontEntries.reduce((sum: number, entry: any) => sum + entry.duration, 0) / fontEntries.length
      const cached = fontEntries.filter((entry: any) => !entry.transferSize).length
      
      console.log(
        `[Font Loader] 📊 Loaded ${fontEntries.length} fonts (${cached} cached) - ` +
        `Avg: ${avgDuration.toFixed(0)}ms, Total: ${(totalSize / 1024).toFixed(1)}KB`
      )
    }
  })
}

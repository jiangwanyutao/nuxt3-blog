import packageJson from '../../package.json'

export default defineNuxtPlugin(() => {
  if (process.client) {
    // 版本信息
    const version = packageJson.version || '1.0.0'
    const buildDate = new Date().toISOString().split('T')[0]
    
    // 样式配置
    const styles = {
      title: 'color: #ec4899; font-size: 20px; font-weight: bold;',
      info: 'color: #10b981; font-weight: bold;',
      label: 'color: #6b7280;'
    }
    
    // 简洁的启动信息
    console.log('%c🌸 思境 Blog v' + version + ' %c- Build ' + buildDate, styles.title, styles.label)
    console.log('%c• %cNuxt3 + NestJS %c| %chttps://jwyt.xyz', styles.label, styles.info, styles.label, 'color: #3b82f6;')
    
    // 彩蛋：检测 Konami Code
    let konamiCode = []
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    
    window.addEventListener('keydown', (e) => {
      konamiCode.push(e.key)
      if (konamiCode.length > 10) konamiCode.shift()
      
      if (konamiCode.join(',') === konamiPattern.join(',')) {
        console.clear()
        console.log(
          '%c🎮 Konami Code Activated! 🎮',
          'color: #ff0; background: #000; font-size: 24px; font-weight: bold; padding: 20px; text-align: center;'
        )
        console.log(
          '%c✨ 你发现了隐藏彩蛋！恭喜你是一位资深玩家～',
          'color: #4ade80; font-size: 18px; font-weight: bold;'
        )
        console.log(
          '%c🎁 送你一个神秘代码: %cBLOG-2026-EASTER-EGG',
          'color: #a78bfa; font-size: 14px;',
          'color: #fbbf24; font-size: 16px; font-weight: bold; background: #1f2937; padding: 4px 8px; border-radius: 4px;'
        )
        konamiCode = []
      }
    })
  }
})

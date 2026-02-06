// 字体加载优化插件
export default defineNuxtPlugin(() => {
  // 创建字体加载状态管理
  const fontLoaded = ref(false)
  
  // 监听字体加载完成
  if ('fonts' in document) {
    Promise.all([
      document.fonts.load('400 1em misans'),
      document.fonts.load('bold 1em kitty')
    ]).then(() => {
      fontLoaded.value = true
      document.documentElement.classList.add('fonts-loaded')
    }).catch(() => {
      console.warn('字体加载失败，使用系统字体')
    })
  }

  // 提供全局状态
  return {
    provide: {
      fontLoaded
    }
  }
})

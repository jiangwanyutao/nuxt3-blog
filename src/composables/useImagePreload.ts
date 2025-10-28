/**
 * 图片预加载 Composable
 * 用于按需预加载图片，避免首屏加载过多资源
 */

export const useImagePreload = () => {
  const preloadedImages = new Set<string>()

  /**
   * 预加载单张图片
   */
  const preloadImage = (url: string): Promise<void> => {
    if (preloadedImages.has(url)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        preloadedImages.add(url)
        resolve()
      }
      img.onerror = reject
      img.src = url
    })
  }

  /**
   * 批量预加载图片
   */
  const preloadImages = (urls: string[]): Promise<void[]> => {
    return Promise.all(urls.map(url => preloadImage(url)))
  }

  /**
   * 预加载 About 页面图片
   */
  const preloadAboutImages = () => {
    const aboutImages = [
      '/images/about/1.jpg',
      '/images/about/2.jpg',
      '/images/about/3.jpg',
      '/images/about/4.jpg',
      '/images/about/5.png',
      '/images/about/loading-bar.png'
    ]
    return preloadImages(aboutImages)
  }

  /**
   * 预加载 Banner 图片
   */
  const preloadBannerImages = () => {
    const bannerImages = [
      '/images/banner/1.jpg',
      '/images/banner/2.jpg',
      '/images/banner/3.jpg',
      '/images/banner/4.jpg',
      '/images/banner/5.jpg',
      '/images/banner/6.png',
      '/images/banner/7.jpg',
      '/images/banner/8.jpg'
    ]
    return preloadImages(bannerImages)
  }

  /**
   * 检查图片是否已预加载
   */
  const isPreloaded = (url: string): boolean => {
    return preloadedImages.has(url)
  }

  return {
    preloadImage,
    preloadImages,
    preloadAboutImages,
    preloadBannerImages,
    isPreloaded
  }
}

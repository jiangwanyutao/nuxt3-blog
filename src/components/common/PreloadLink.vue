<template>
  <NuxtLink
    :to="to"
    v-bind="$attrs"
    @mouseenter="handleMouseEnter"
    @touchstart="handleTouchStart"
    @click="handleClick"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
/**
 * 智能预加载链接组件
 * 鼠标悬停时预加载目标页面的关键资源
 */
import { useImagePreload } from '~/composables/useImagePreload'

// 继承所有属性（如 class, style 等）
defineOptions({
  inheritAttrs: false
})

interface Props {
  to: string
  preloadType?: 'about' | 'banner' | 'custom'
  customImages?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  preloadType: undefined,
  customImages: () => []
})

const { preloadAboutImages, preloadBannerImages, preloadImages } = useImagePreload()

let preloaded = false

const handleMouseEnter = () => {
  if (preloaded) return
  startPreload()
}

const handleTouchStart = () => {
  if (preloaded) return
  startPreload()
}

const handleClick = (e: MouseEvent) => {
  // 确保点击事件正常传递，不做任何阻止
  console.log('PreloadLink clicked:', props.to)
}

const startPreload = () => {
  preloaded = true

  // 根据类型预加载对应图片
  if (props.preloadType === 'about') {
    preloadAboutImages().catch((err: unknown) => {
      console.warn('About 图片预加载失败:', err)
    })
  } else if (props.preloadType === 'banner') {
    preloadBannerImages().catch((err: unknown) => {
      console.warn('Banner 图片预加载失败:', err)
    })
  } else if (props.preloadType === 'custom' && props.customImages.length > 0) {
    preloadImages(props.customImages).catch((err: unknown) => {
      console.warn('自定义图片预加载失败:', err)
    })
  }
}
</script>

<template>
  <div class="lazy-image-wrapper" :style="{ paddingBottom: aspectRatio }">
    <img
      v-if="isVisible || !lazy"
      :src="currentSrc"
      :alt="alt"
      :class="['lazy-image', { 'is-loaded': isLoaded }]"
      :loading="lazy ? 'lazy' : 'eager'"
      :fetchpriority="priority"
      @load="handleLoad"
      @error="handleError"
    />
    <div v-else class="lazy-image-placeholder" :style="{ backgroundColor: placeholderColor }">
      <div class="lazy-image-spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  lazy?: boolean
  priority?: 'high' | 'low' | 'auto'
  aspectRatio?: string
  placeholderColor?: string
  webp?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  lazy: true,
  priority: 'auto',
  aspectRatio: '56.25%', // 16:9 默认比例
  placeholderColor: '#f0f0f0',
  webp: true
})

const isVisible = ref(false)
const isLoaded = ref(false)
const hasError = ref(false)
const imageRef = ref<HTMLElement | null>(null)

// 根据是否支持 WebP 选择图片格式
const currentSrc = computed(() => {
  if (props.webp && supportsWebP.value) {
    // 尝试使用 WebP 格式
    const webpSrc = props.src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    return webpSrc
  }
  return props.src
})

// 检测浏览器是否支持 WebP
const supportsWebP = ref(true)

// 图片加载完成
const handleLoad = () => {
  isLoaded.value = true
}

// 图片加载失败，降级到原格式
const handleError = () => {
  if (props.webp && currentSrc.value.endsWith('.webp')) {
    // WebP 加载失败，使用原格式
    supportsWebP.value = false
  }
  hasError.value = true
}

// 使用 Intersection Observer 实现懒加载
onMounted(() => {
  if (!props.lazy) {
    isVisible.value = true
    return
  }

  if (process.client && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px' // 提前 50px 开始加载
      }
    )

    const element = imageRef.value
    if (element) {
      observer.observe(element)
    }

    onBeforeUnmount(() => {
      observer.disconnect()
    })
  } else {
    // 不支持 IntersectionObserver，直接显示
    isVisible.value = true
  }
})
</script>

<style scoped>
.lazy-image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.lazy-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.lazy-image.is-loaded {
  opacity: 1;
}

.lazy-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lazy-image-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

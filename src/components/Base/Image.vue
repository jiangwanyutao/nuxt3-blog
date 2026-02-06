<script setup lang="ts">
import loadingImgUrl from '@/assets/img/loading/loading.gif'
import errorImgUrl from '@/assets/img/404/404.gif'

interface Props {
  src: string
  lazy?: boolean // 是否懒加载，默认 true
  priority?: 'high' | 'low' | 'auto' // 加载优先级
  placeholderColor?: string // 占位符颜色
}
const props = withDefaults(defineProps<Props>(), {
  lazy: true,
  priority: 'auto',
  placeholderColor: '#f0f0f0'
})

const imgRef = ref<HTMLElement | null>(null)
const imgSrc = ref(loadingImgUrl)
const isLoaded = ref(false)

const loadingImage = () => {
  const img = new Image()
  img.src = props.src
  img.onload = () => {
    imgSrc.value = props.src
    isLoaded.value = true
  }
  img.onerror = () => {
    imgSrc.value = errorImgUrl
    isLoaded.value = true
  }
}

onMounted(() => {
  // 如果不需要懒加载，直接加载
  if (!props.lazy) {
    loadingImage()
    return
  }

  // 图片懒加载
  const observer = new IntersectionObserver((arr) => {
    if (arr[0].isIntersecting) {
      // 进入可视区，加载图片
      loadingImage()
      imgRef.value && observer.unobserve(imgRef.value)
    }
  })

  imgRef.value && observer.observe(imgRef.value)
})
</script>

<template>
  <div 
    ref="imgRef" 
    class="group/img h-full w-full relative"
  >
    <img
        class="h-full w-full rounded-[inherit] object-cover transition-all duration-500 group-hover/img:scale-110"
        :src="imgSrc"
        :loading="lazy ? 'lazy' : 'eager'"
        :fetchpriority="priority"
        alt=""
    />
  </div>
</template>

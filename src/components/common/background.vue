<template>
  <div class="containers relative">
    <!--    首屏100动画-->
    <div
      style="width: 100%; height: 100vh"
      ref="vantaRef"
      :class="['bg saturate-100', `bg-${currentBgIndex}`]"
    >
      <div
        id="headertop"
        class="relative h-screen"
      >
        <figure
          class="headertop-bg relative h-full w-full animate-[home-bg_1.5s] bg-cover bg-center bg-no-repeat dark:bg-neutral-800 md:bg-fixed"
        >
          <div
            class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center transition-[top] duration-700"
          >
            <h1
              class="mb-5 cursor-pointer text-7xl font-bold glitch"
              :data-text="slogan"
            >
              {{ slogan }}
            </h1>
            <div
              class="centerbg-info rounded-lg bg-[rgba(0,0,0,.5)] p-3.5 max-md:w-[350px] md:min-w-[500px]"
            >
              <p class="mb-1 text-base font-bold text-gray-300">
                <Icon name="ooui:quotes-ltr" />
                <span id="typed"></span>
                <Icon name="ooui:quotes-rtl" />
              </p>
              <div class="text-3xl">
                <Icon
                  name="ic:round-keyboard-double-arrow-left"
                  class="mr-4 cursor-pointer"
                  color="#3b82f6"
                  @click="handleLeft"
                />
                <!-- 动态渲染联系方式图标 -->
                <template v-if="blogStore.blogConfig?.contactList && blogStore.blogConfig.contactList.length > 0">
                  <a
                    v-for="(contact, index) in blogStore.blogConfig.contactList"
                    :key="index"
                    target="_blank"
                    rel="noopener noreferrer"
                    :href="contact.link"
                    :title="contact.name"
                  >
                    <img
                      v-if="contact.icon.startsWith('http')"
                      :src="contact.icon"
                      :alt="contact.name"
                      class="mx-1.5 cursor-pointer inline-block w-8 h-8 object-contain"
                    />
                    <Icon
                      v-else
                      :name="contact.icon"
                      class="mx-1.5 cursor-pointer"
                    />
                  </a>
                </template>
                <!-- 默认图标（如果没有配置） -->
                <template v-else>
                  <a target="_blank" rel="noopener noreferrer" :href="gitHub">
                    <Icon name="tdesign:logo-github-filled" class="mx-1.5 cursor-pointer" />
                  </a>
                  <a target="_blank" rel="noopener noreferrer" :href="gitee">
                    <Icon name="simple-icons:gitee" class="mx-1.5 cursor-pointer" color="#be3020" />
                  </a>
                  <a target="_blank" rel="noopener noreferrer" :href="bilibili">
                    <Icon name="tabler:brand-bilibili" class="mx-1.5 cursor-pointer" color="#38acea" />
                  </a>
                </template>
                <Icon
                  name="ic:baseline-keyboard-double-arrow-right"
                  class="ml-4 cursor-pointer"
                  color="#3b82f6"
                  @click="handleRight"
                />
              </div>
            </div>
          </div>
        </figure>
      </div>
      <!--向下箭头-->
      <CommonDown></CommonDown>
      <!--海浪-->
      <CommonWave></CommonWave>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import Typed from 'typed.js'
import { useBlogStore } from '@/stores/blogStore'

const vantaRef = ref(null)
let vantaEffect: any = null
const colorMode = useColorMode()
const nuxtApp = useNuxtApp()
const blogStore = useBlogStore()

// 计算属性：获取标语
const slogan = computed(() => blogStore.blogConfig?.slogan || 'Hi, 江晚')

// watch 监听深色模式变化
watch(colorMode, (newVal) => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
  init()
})
const birds = ref([])

// 定义社交媒体链接
const gitHub = 'https://github.com'
const gitee = 'https://gitee.com'
const bilibili = 'https://bilibili.com'

// 背景图片列表（使用 public 目录，支持预加载）
const bgImages = [
  '/images/banner/1.jpg',
  '/images/banner/2.jpg',
  '/images/banner/3.jpg',
  '/images/banner/4.jpg',
  '/images/banner/5.jpg',
  '/images/banner/6.png',
  '/images/banner/7.jpg',
  '/images/banner/8.jpg',
]

const currentBgIndex = ref(2)
let bgInterval: ReturnType<typeof setInterval> | null = null

const opacity = ref(1)
const nextBgIndex = computed(() => (currentBgIndex.value + 1) % bgImages.length)

// 修改切换背景的函数
const changeBg = async () => {
  // 淡出当前背景
  opacity.value = 0

  // 等待动画完成
  await new Promise(resolve => setTimeout(resolve, 500))

  // 切换到下一张图
  currentBgIndex.value = (currentBgIndex.value + 1) % bgImages.length

  // 重置透明度
  opacity.value = 1
}

// 初始化 - 优化版本
async function init() {
  // 只在客户端导入 vanta
  if (process.client) {
    try {
      // 性能监控开始
      const startTime = performance.now()
      
      // 显示加载状态
      const loadingElement = document.createElement('div')
      loadingElement.className = 'vanta-loading'
      loadingElement.textContent = '加载动画中...'
      vantaRef.value?.appendChild(loadingElement)
      
      // 动态导入 + 超时控制
      const vantaPromise = import('vanta/dist/vanta.birds.min')
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Vanta加载超时')), 5000)
      )
      
      const { default: BIRDS } = await Promise.race([vantaPromise, timeoutPromise])
      
      // 检查设备性能
      const isLowEndDevice = navigator.hardwareConcurrency <= 4 || 
                           /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // 根据设备性能调整参数
      const config = isLowEndDevice ? {
        el: vantaRef.value,
        THREE: THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 0.5,
        backgroundAlpha: 0.0,
        birdSize: 1.0,
        wingSpan: 15.0,
        quantity: 2.0,
        speedLimit: 2.0
      } : {
        el: vantaRef.value,
        THREE: THREE,
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 2.0,
        scaleMobile: 1.0,
        backgroundAlpha: 0.0,
        birdSize: 1.5,
        wingSpan: 20.0,
        quantity: 3.0,
        speedLimit: 4.0
      }
      
      vantaEffect = BIRDS(config)
      
      // 移除加载提示
      loadingElement.remove()
      
      // 性能监控结束
      const loadTime = performance.now() - startTime
      console.log(`Vanta.js 加载耗时: ${loadTime.toFixed(2)}ms`)
      
      // 如果加载时间过长，记录警告
      if (loadTime > 3000) {
        console.warn('Vanta.js 加载时间过长，建议使用降级方案')
      }
      
    } catch (error) {
      console.error('Vanta.js 加载失败:', error)
      // 降级方案：显示静态背景
      initFallbackBackground()
    }
  }
}

// 降级方案：静态背景动画
function initFallbackBackground() {
  if (!vantaRef.value) return
  
  // 创建CSS动画背景作为降级方案
  vantaRef.value.innerHTML = `
    <div class="fallback-background">
      <div class="floating-particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
    </div>
  `
  
  // 添加降级样式
  const style = document.createElement('style')
  style.textContent = `
    .fallback-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      overflow: hidden;
    }
    
    .floating-particles {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    
    .particle {
      position: absolute;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }
    
    .particle:nth-child(1) {
      width: 80px;
      height: 80px;
      left: 10%;
      animation-delay: 0s;
    }
    
    .particle:nth-child(2) {
      width: 60px;
      height: 60px;
      left: 70%;
      animation-delay: 2s;
    }
    
    .particle:nth-child(3) {
      width: 40px;
      height: 40px;
      left: 40%;
      animation-delay: 4s;
    }
    
    .particle:nth-child(4) {
      width: 100px;
      height: 100px;
      left: 80%;
      animation-delay: 1s;
    }
    
    .particle:nth-child(5) {
      width: 50px;
      height: 50px;
      left: 20%;
      animation-delay: 3s;
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
        opacity: 0.7;
      }
      50% {
        transform: translateY(-100px) rotate(180deg);
        opacity: 0.3;
      }
    }
  `
  document.head.appendChild(style)
}

onMounted(() => {
  nextTick(() => {
    // 延迟初始化，优先保证页面主要内容加载
    setTimeout(() => {
      init()
    }, 100)
    
    initTyped()
    preloadImages() // 预加载其他背景图片
    
    // 添加用户交互检测
    let userInteracted = false
    const handleInteraction = () => {
      if (!userInteracted) {
        userInteracted = true
        // 用户交互后，如果Vanta还未加载，优先加载
        if (!vantaEffect) {
          init()
        }
      }
    }
    
    // 监听用户交互事件
    document.addEventListener('click', handleInteraction, { once: true })
    document.addEventListener('scroll', handleInteraction, { once: true })
    document.addEventListener('mousemove', handleInteraction, { once: true })
    
    // 每5秒切换一次背景
    // bgInterval = setInterval(changeBg, 5000)
  })
})

// 预加载其他背景图片
const preloadImages = () => {
  // 首屏图片已经通过 CSS 加载，这里预加载其他图片
  bgImages.slice(1).forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
  // 清理定时器
  if (bgInterval) {
    clearInterval(bgInterval)
  }
})

// 是否正在切换（防止快速点击）
const isSwitching = ref(false)

// 平滑切换背景图片
const smoothSwitchBg = async (newIndex: number) => {
  if (isSwitching.value) return // 防止重复点击
  
  isSwitching.value = true
  
  // 预加载目标图片
  const targetImg = new Image()
  targetImg.src = bgImages[newIndex]
  
  // 等待图片加载完成
  await new Promise((resolve) => {
    targetImg.onload = resolve
    targetImg.onerror = resolve // 即使加载失败也继续
  })
  
  // 切换索引
  currentBgIndex.value = newIndex
  
  // 短暂延迟后允许下次切换
  setTimeout(() => {
    isSwitching.value = false
  }, 300)
}

// 切换到下一张背景图片
const handleRight = () => {
  const nextIndex = (currentBgIndex.value + 1) % bgImages.length
  smoothSwitchBg(nextIndex)
}

// 切换到上一张背景图片
const handleLeft = () => {
  const prevIndex = (currentBgIndex.value - 1 + bgImages.length) % bgImages.length
  smoothSwitchBg(prevIndex)
}

const initTyped = () => {
  new Typed('#typed', {
    strings: ['生老病死,天地万象,尽在吾辈', '挫其锐，解其纷，和其光，同其尘', '坚持你所热爱的，热爱你所坚持的'], //数组：可以放多个打印内容
    typeSpeed: 150, //打印速度，单位是毫秒。
    backSpeed: 40, //回退速度，单位是毫秒。
    loop: true //是否循环播放。
  })
}
</script>
<style scoped lang="scss">
.bg {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 0.6s ease-in-out, opacity 0.3s ease-in-out;
  /* 添加硬件加速 */
  will-change: background-image;
  transform: translateZ(0);
  /* 防止白色闪烁 */
  background-color: #1a1a2e;
}

.bg-0 {
  background-image: url('/images/banner/1.jpg');
  /* 添加模糊占位符 */
  // background-color: #1a1a2e;
}

.bg-1 {
  background-image: url('/images/banner/2.jpg');
  // background-color: #16213e;
}

.bg-2 {
  background-image: url('/images/banner/3.jpg');
  // background-color: #0f3460;
}

.bg-3 {
  background-image: url('/images/banner/4.jpg');
  // background-color: #533483;
}
.bg-4 {
  background-image: url('/images/banner/5.jpg');
  // background-color: #533483;
}
.bg-5 {
  background-image: url('/images/banner/6.png');
  // background-color: #533483;
}
.bg-6 {
  background-image: url('/images/banner/7.jpg');
  // background-color: #533483;
}
.bg-7 {
  background-image: url('/images/banner/8.jpg');
  // background-color: #533483;
}

.glitch {
  position: relative;
  color: #fff;
  mix-blend-mode: lighten;
}

.glitch:before,
.glitch:after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  clip: rect(0, 0, 0, 0);
}

.glitch:before {
  left: -1px;
  text-shadow: 1px 0 #ff3f1a;
}

.glitch:after {
  left: 1px;
  text-shadow: -1px 0 #00a7e0;
}

.glitch:hover:before {
  text-shadow: 5px 0 #ff3f1a;
  animation: glitch-loop-1 0.8s infinite ease-in-out alternate-reverse;
}

.glitch:hover:after {
  text-shadow: -5px 0 #00a7e0;
  animation: glitch-loop-2 0.8s infinite ease-in-out alternate-reverse;
}

@-webkit-keyframes glitch-loop-1 {
  0% {
    clip: rect(36px, 9999px, 9px, 0);
  }

  25% {
    clip: rect(25px, 9999px, 99px, 0);
  }

  50% {
    clip: rect(50px, 9999px, 102px, 0);
  }

  75% {
    clip: rect(30px, 9999px, 92px, 0);
  }

  100% {
    clip: rect(91px, 9999px, 98px, 0);
  }
}

@keyframes glitch-loop-1 {
  0% {
    clip: rect(36px, 9999px, 9px, 0);
  }

  25% {
    clip: rect(25px, 9999px, 99px, 0);
  }

  50% {
    clip: rect(50px, 9999px, 102px, 0);
  }

  75% {
    clip: rect(30px, 9999px, 92px, 0);
  }

  100% {
    clip: rect(91px, 9999px, 98px, 0);
  }
}

@-webkit-keyframes glitch-loop-2 {
  0% {
    top: -1px;
    left: 1px;
    clip: rect(65px, 9999px, 119px, 0);
  }

  25% {
    top: -6px;
    left: 4px;
    clip: rect(79px, 9999px, 19px, 0);
  }

  50% {
    top: -3px;
    left: 2px;
    clip: rect(68px, 9999px, 11px, 0);
  }

  75% {
    top: 0;
    left: -4px;
    clip: rect(95px, 9999px, 53px, 0);
  }

  100% {
    top: -1px;
    left: -1px;
    clip: rect(31px, 9999px, 149px, 0);
  }
}

@keyframes glitch-loop-2 {
  0% {
    top: -1px;
    left: 1px;
    clip: rect(65px, 9999px, 119px, 0);
  }

  25% {
    top: -6px;
    left: 4px;
    clip: rect(79px, 9999px, 19px, 0);
  }

  50% {
    top: -3px;
    left: 2px;
    clip: rect(68px, 9999px, 11px, 0);
  }

  75% {
    top: 0;
    left: -4px;
    clip: rect(95px, 9999px, 53px, 0);
  }

  100% {
    top: -1px;
    left: -1px;
    clip: rect(31px, 9999px, 149px, 0);
  }
}

.bg-container {
  position: relative;
  overflow: hidden;
}

.bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 0.5s ease-in-out;
}
</style>

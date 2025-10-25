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

// 背景图片列表
const bgImages = [
  '/assets/img/banner/1.jpg',
  '/assets/img/banner/2.jpg',
  '/assets/img/banner/3.jpg',
  '/assets/img/banner/4.jpg'
]

const currentBgIndex = ref(0)
let bgInterval: NodeJS.Timer

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

// 初始化
async function init() {
  // 只在客户端导入 vanta
  if (process.client) {
    const BIRDS = (await import('vanta/dist/vanta.birds.min')).default
    vantaEffect = BIRDS({
      el: vantaRef.value,
      THREE: THREE, // 也可以换成 p5，但我没试过
      mouseControls: true, // 是否允许动画和鼠标手势交互，想启用的话改成true
      touchControls: false, // 触摸屏交互
      gyroControls: false, // 加速度交互，应该是晃动手机的效果
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 2.0,
      scaleMobile: 1.0,
      backgroundAlpha: 0.0,
      birdSize: 1.5, // 鸟的大小
      wingSpan: 20.0, // 翅膀展开的角度
      quantity: 3.0, // 鸟的数量
      speedLimit: 4.0 // 速度限制
    })
  }
}

onMounted(() => {
  nextTick(() => {
    init()
    initTyped()
    // 每5秒切换一次背景
    // bgInterval = setInterval(changeBg, 50000)
  })
})

onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
  // 清理定时器
  clearInterval(bgInterval)
})

const handleRight = () => {
  // nuxtApp.router.push("/home");
}

const handleLeft = () => {
  // nuxtApp.router.push("/home");
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
  transition: background-image 0.5s ease-in-out;
}

.bg-0 {
  background-image: url('@/assets/img/banner/1.png');
}

.bg-1 {
  background-image: url('@/assets/img/banner/2.jpg');
}

.bg-2 {
  background-image: url('@/assets/img/banner/3.png');
}

.bg-3 {
  background-image: url('@/assets/img/banner/4.jpg');
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

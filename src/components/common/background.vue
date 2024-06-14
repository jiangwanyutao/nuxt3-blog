<template>
  <div  style="height: 100vh;" ref="vantaRef" class="bg"></div>
  <div  style="height: 100vh;" class="bg">
    <div  class="bg birds" ref="birds">
      <div id="headertop" class="relative h-screen">
        <figure
            class="headertop-bg relative h-full w-full animate-[home-bg_1.5s] bg-cover bg-center bg-no-repeat dark:bg-neutral-800 md:bg-fixed"
        >
          <div
              class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center transition-[top] duration-700"
          >
            <h1
                class="mb-5  cursor-pointer   text-7xl font-bold"
            >
              江晚
            </h1>
            <div
                class="centerbg-info rounded-lg bg-[rgba(0,0,0,.5)] p-3.5 max-md:w-[350px] md:min-w-[500px]"
            >
              <p class="mb-1 text-base font-bold text-gray-300">
                <Icon name="ooui:quotes-ltr" />
                生老病死,天地万象,尽在吾辈
                <Icon name="ooui:quotes-rtl" />
              </p>
              <div class="text-3xl">
                <Icon
                    name="ic:round-keyboard-double-arrow-left"
                    class="mr-4 cursor-pointer"
                    color="#3b82f6"
                    @click="handleLeft"
                />
                <nuxt-link  target="_blank" :to="gitHub">
                  <Icon name="grommet-icons:github" class="mx-1.5 cursor-pointer" />
                </nuxt-link>
                <nuxt-link  target="_blank" :to="gitee">
                  <Icon name="simple-icons:gitee" class="mx-1.5 cursor-pointer" color="#be3020" />
                </nuxt-link>
                <nuxt-link  target="_blank" :to="bilibili">
                  <Icon name="tabler:brand-bilibili" class="mx-1.5 cursor-pointer" color="#38acea" />
                </nuxt-link>
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
    </div>
  </div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import BIRDS from "vanta/dist/vanta.birds.min"
import * as DynamicColor from '~/utils/color';
import {ref} from "vue";
const vantaRef = ref(null)
let vantaEffect: any = null
const colorMode = useColorMode()

// watch 监听深色模式变化
watch(
    colorMode,
    (newVal) => {
      if (vantaEffect) {
        vantaEffect.destroy()
      }
      init()
    }
)
const birds = ref([])
// 初始化
function init(){
  vantaEffect = BIRDS({
    el: vantaRef.value,
    THREE: THREE,	// 也可以换成 p5，但我没试过
    mouseControls: true,	// 是否允许动画和鼠标手势交互，想启用的话改成true
    touchControls: false,	// 触摸屏交互
    gyroControls: false,	// 加速度交互，应该是晃动手机的效果
    speed: 0.5,		// 动画速度，不喜欢太快的动画，所以设得小一些
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 2.00,
    scaleMobile: 1.00,
    backgroundAlpha: 0.00,
    birdSize: 1.50,
    wingSpan: 20.00,
    quantity: 3.00,
  })
  //ref获取birds dom 设置200毫秒后设置样式
  setTimeout(() => {
    birds.value = document.querySelectorAll('.birds')
    birds.value.forEach((item: any) => {
      item.style.setProperty('opacity', `1`)
      item.style.setProperty('filter', `0px`)
    })
  }, 200);


}

onMounted(() => {
  if(process.client){
    setTimeout(() => {
      init()
    }, 1000);
  }
})

onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
})
</script>
<style scoped lang="scss">
.bg{
  background: url("https://cdn.qiniu.jwyt.cloud/common/298f491fc98a464b9b434564c42bf4aa.jpg") no-repeat center center fixed;
}

</style>

<template>
  <div class="contonter">
    <div  style="height: 100vh;" ref="vantaRef">
      <h1 class="text-3xl font-bold underline" style="padding-top: 96px;">
        我是首页我是首页
        hello world
        <n-button>
          深色
        </n-button>
        <n-button>
          浅色
        </n-button>
      </h1>
    </div>
    <div  style="height: 100px;" >
      <h1 class="">
        123123123
        </h1>
    </div>
  </div>

</template>
<script setup lang="ts">
// import { onMounted, onBeforeUnmount, ref,watch } from 'vue'
import * as THREE from 'three'
import CLOUDS from "vanta/dist/vanta.clouds.min"

import * as DynamicColor from '~/utils/color';		// 上面的代码形成的color.ts文件

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

// 初始化
function init(){
  //监听深色模式变化 改变当前颜色
  const currSkyColor = DynamicColor.getSkyColor()
  const currCloudColor = DynamicColor.getCloudColor()
  const currSunColor = DynamicColor.getSunColor()
  const currSunGlareColor = DynamicColor.getSunGlareColor()

  vantaEffect = CLOUDS({
    el: vantaRef.value,
    THREE: THREE,	// 也可以换成 p5，但我没试过
    skyColor: currSkyColor,
    cloudColor: currCloudColor,
    cloudShadowColor: '#262646',	// 偷懒直接给了个固定值
    sunColor: currSunColor,
    sunlightColor: currSunColor,	// 偷懒用了太阳颜色
    sunGlareColor: currSunGlareColor,
    mouseControls: true,	// 是否允许动画和鼠标手势交互，想启用的话改成true
    touchControls: false,	// 触摸屏交互
    gyroControls: false,	// 加速度交互，应该是晃动手机的效果
    speed: 0.5,		// 动画速度，不喜欢太快的动画，所以设得小一些
    minHeight: 200.00,
    minWidth: 200.00
  })

}

onMounted(() => {
init();
})

onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
})
</script>
<style scoped lang="scss">
.contonter{
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
.colors {
  color: $textColor;
}
</style>
<template>
  <div class="containers relative">
    <!--    首屏100动画-->
    <div
      style="width: 100%; height: 100vh"
      ref="vantaRef"
      class="bg saturate-100"
    >
      <div id="headertop" class="relative h-screen">
        <figure
          class="headertop-bg relative h-full w-full animate-[home-bg_1.5s] bg-cover bg-center bg-no-repeat dark:bg-neutral-800 md:bg-fixed"
        >
          <div
            class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center transition-[top] duration-700"
          >
            <h1
              class="mb-5 cursor-pointer text-7xl font-bold glitch"
              data-text="Hi, 江晚"
            >
              Hi, 江晚
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
                <nuxt-link target="_blank" :to="gitHub">
                  <Icon
                    name="tdesign:logo-github-filled"
                    class="mx-1.5 cursor-pointer"
                  />
                </nuxt-link>
                <nuxt-link target="_blank" :to="gitee">
                  <Icon
                    name="simple-icons:gitee"
                    class="mx-1.5 cursor-pointer"
                    color="#be3020"
                  />
                </nuxt-link>
                <nuxt-link target="_blank" :to="bilibili">
                  <Icon
                    name="tabler:brand-bilibili"
                    class="mx-1.5 cursor-pointer"
                    color="#38acea"
                  />
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
      <!--向下箭头-->
      <CommonDown></CommonDown>
      <!--海浪-->
      <CommonWave></CommonWave>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as THREE from "three";
import BIRDS from "vanta/dist/vanta.birds.min";
import { ref } from "vue";
const vantaRef = ref(null);
let vantaEffect: any = null;
const colorMode = useColorMode();
const nuxtApp = useNuxtApp();

// watch 监听深色模式变化
watch(colorMode, (newVal) => {
  if (vantaEffect) {
    vantaEffect.destroy();
  }
  init();
});
const birds = ref([]);
// 初始化
function init() {
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
    speedLimit: 4.0, // 速度限制
  });
}

onMounted(() => {});

nuxtApp.hook("page:start", () => {
  init();
});

onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy();
  }
});
</script>
<style scoped lang="scss">
.bg {
  background: url("https://cdn.qiniu.jwyt.cloud/common/298f491fc98a464b9b434564c42bf4aa.jpg")
    no-repeat center center;
  background-size: cover;
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
</style>

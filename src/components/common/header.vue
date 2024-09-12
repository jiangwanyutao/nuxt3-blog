<template>
  <header
    class="headerclass fixed top-0 left-0 right-0 css-animation bg-[rgba(255,255,255,0.7)] px-4 transition-colors duration-700 dark:bg-[rgba(38,38,38,0.7)]"
    style="z-index: 9999"
    :class="{ 'frosted-glass': !showMenu, 'bg-transparent': showMenu }"
  >
    <div
      class="container flex  mx-auto nav-height"
      ref="el"
    >
      <CommonLogo></CommonLogo>
      <CommonNavbar></CommonNavbar>
      <div
        class="flex justify-center items-center content-center"
        style="width: 30%"
      >
        <span class="m-2">
          <BaseDarkToggle />
        </span>
        <span class="m-2">登录</span>
      </div>
    </div>
  </header>
  <!-- <div class="h-20"></div> -->
</template>

<script setup lang="ts">
//获取滚动条位置
const { y } = useWindowScroll()
const showMenu = computed(() => y.value === 0)
</script>

<style scoped lang="scss">
.container {
  transition: transform 0.3s, -webkit-transform 0.3s;
  width: 100%;
}
.headerclass {
  border-radius: 0 0 0.6rem 0.6rem;
  //box-shadow: 0 0.2rem 1rem 0 hsl(0deg 0% 15% / 4%);
}
.nav-height {
  height: 64px;
}

.css-animation {
  transition-duration: 0.25s;
  transition-timing-function: ease-in;
}

.frosted-glass {
  /**
  高度从0到100%的过渡动画
   */
  animation: glass 0.5s;
}
@keyframes glass {
  0% {
    backdrop-filter: blur(0);
    opacity: 0; /* 初始透明 */
  }
  100% {
    backdrop-filter: blur(10px);
    opacity: 1; /* 完全可见 */
  }
}

</style>

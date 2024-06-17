<template>
  <header
    class="fixed top-0 left-0 right-0 css-animation bg-[rgba(255,255,255,0.7)] px-4 transition-colors duration-700 dark:bg-[rgba(38,38,38,0.7)] "
    style="z-index: 9999;" :class="{ 'frosted-glass': !showMenu, 'bg-transparent': showMenu, }">
    <div class="container flex justify-center items-center content-center mx-auto h-20" ref="el">
      <CommonLogo></CommonLogo>
      <nav style="height: 90px; overflow: hidden;">
        <ul class="AppHeader flex h-20 justify-center items-center content-center"
          :class="{ 'is-showUp': isScrollUp, 'is-showdown': !isScrollUp }">
          <li v-for="( item, index ) in  blogStore.menuList " :key="index" :class="item.class">
            <NuxtLink :to="`${item.path}`" class="flex items-center">
              <Icon size="20" :name="item.icon" />
              <span class="pl-1" style="margin-right: 20px">{{ item.text }}</span>
            </NuxtLink>
          </li>
        </ul>
        <ul class="h-20 flex justify-center items-center content-center"
          :class="{ 'is-showUp': isScrollUp, 'is-showdown': !isScrollUp, 'invisible': !isScrollUp }">
          <span class="py-1.5">
<!--            <CommonLogo></CommonLogo>-->
          </span>
          <li class="flex items-center">
            <span class="pl-1">江晚正愁余 旅途总有一天会迎来终点,不必匆忙</span>
          </li>
        </ul>
      </nav>
      <div class="flex justify-center items-center content-center" style="flex: 1">
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
const blogStore = useBlogStore()
//滚动条
const isScrollUp = ref(false)
//导航栏是否固定
const lastScrollPosition = ref()

//获取滚动条位置
const { y } = useWindowScroll()
const showMenu = computed(() => y.value === 0)

// 监听滚动条事件
const handleScroll = () => {
  const currentScrollPosition = window.scrollY
  if (currentScrollPosition > lastScrollPosition.value) {
    // 向下滚动
    isScrollUp.value = true
  } else {
    // 向上滚动
    isScrollUp.value = false
  }
  lastScrollPosition.value = currentScrollPosition
}

onMounted(() => {
  lastScrollPosition.value = window.scrollY
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})


</script>

<style>
.container {
  transition: transform .3s, -webkit-transform .3s;
  width: 100%;
}

.is-showUp {
  transform: translateY(-100%);
  transition: transform .3s, -webkit-transform .3s;
}

.is-showdown {
  transform: translateY(0);
  transition: transform .3s, -webkit-transform .3s;
}

.css-animation {
  transition-duration: 0.25s;
  transition-timing-function: ease-in;
}

/**毛玻璃 */
.frosted-glass{
  box-shadow: 0 0.3px 0.3px rgba(0, 0, 0, 0.1), 0 0.7px 1px rgba(0, 0, 0, 0.15), 0 1.2px 2.5px rgba(0, 0, 0, 0.2), 0 1.4px 5px rgba(0, 0, 0, 0.25), 0 8px 15px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(1px);
}

.frosted-glass:hover {
  box-shadow: 0 0.7px 1px rgba(0, 0, 0, 0.157), 0 1.7px 2.6px rgba(0, 0, 0, 0.224), 0 3.5px 5.3px rgba(0, 0, 0, 0.28), 0 7.3px 11px rgba(0, 0, 0, 0.346), 0 20px 30px rgba(0, 0, 0, 0.5);
}
</style>

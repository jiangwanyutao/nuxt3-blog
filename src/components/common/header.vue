<template>
  <header class="fixed top-0 left-0 right-0 css-animation bg-[rgba(255,255,255,0.7)] px-4 transition-colors duration-700 dark:bg-[rgba(38,38,38,0.7)] " style="z-index: 9999;" :class="{'shadow-md': !showMenu ,'bg-transparent': showMenu ,'bg-zinc-50':!showMenu}">
    <div class="container mx-auto h-24" ref="el">
      <nav style="height: 90px; overflow: hidden;">
        <ul class="AppHeader flex h-24 justify-center items-center content-center"
          :class=" { 'is-showUp': isScrollUp, 'is-showdown': !isScrollUp } ">
          <span class="py-1.5">
            logo
          </span>
          <li v-for="( item, index ) in  blogStore.menuList " :key=" index " :class=" item.class ">
            <NuxtLink :to=" `${item.path}` " class="flex items-center">
              <Icon size="20" :name="item.icon" />
              <span class="pl-1">{{ item.text }}</span>
            </NuxtLink>
          </li>
          <span class="m-2">
            <BaseDarkToggle />
          </span>
          <span class="m-2">登录</span>
        </ul>
        <ul class="h-24 flex justify-center items-center content-center"
          :class=" { 'is-showUp': isScrollUp, 'is-showdown': !isScrollUp , 'invisible': !isScrollUp } ">
          <span class="py-1.5">
            logo
          </span>
          <li class="flex items-center">
            <span class="pl-1">当前文章标题</span>
          </li>
          <span class="m-2">
            <BaseDarkToggle />
          </span>
          <span class="m-2">登录</span>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted,computed } from 'vue'
const blogStore = useBlogStore()
//滚动条
const isScrollUp = ref(false)
//导航栏是否固定
const isFixed = ref(false)
const lastScrollPosition = ref()

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

.css-animation{
  transition-duration:0.25s;
  transition-timing-function:ease-in;
}

</style>
<template>
  <header
    class="headerclass fixed top-0 left-0 right-0 css-animation bg-[rgba(255,255,255,0.7)] px-4 transition-colors duration-700 dark:bg-[rgba(38,38,38,0.7)] "
    style="z-index: 9999;" :class="{ 'frosted-glass': !showMenu, 'bg-transparent': showMenu, }">
    <div class="container flex justify-center items-center content-center mx-auto nav-height" ref="el">
      <CommonLogo></CommonLogo>
      <nav style="height: 54px;" @mouseleave="menusMouseLeave">
        <ul class="AppHeader flex nav-height justify-center items-center content-center"
            :class="{ 'is-showUp': isScrollUp, 'is-showdown': !isScrollUp }">
<!--          @mouseover="menusMouseOver(index)" @mouseleave="menusMouseLeave"-->
          <li v-for="(item, index) in blogStore.menuList" :key="index" :class="item.class" @mouseover="menusMouseOver(index)">
            <NuxtLink :to="`${item.path}`" class="flex items-center">
              <Icon size="20" :name="item.icon" />
              <span class="pl-1" style="margin-right: 20px">{{ item.text }}</span>
            </NuxtLink>
<!--            v-show="menus_child_state === index"-->
            <div v-show="menus_child_state === index">
              <ol class="menus_child slide-up-my">
                <li v-for="(child, childIndex) in item.children" :key="childIndex" :class="item.class">
                  <div class="menus_child_item">
                    <Icon size="20" :name="child.icon" />
                    &nbsp;
                    <h2 style="width: 100px">{{ child.text }}</h2>
                  </div>
                </li>
              </ol>
            </div>
          </li>
        </ul>
        <ul class="nav-height flex justify-center items-center content-center"
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


// ------------------- 导航栏鼠标悬停移开显示消失START------------------------
let menus_child_state = ref(-99);

function menusMouseOver(type) {
    menus_child_state.value = type;
}

  function menusMouseLeave() {
    menus_child_state.value = -99;
  }

// ------------------- 导航栏鼠标悬停移开显示消失END------------------------

  onMounted(() => {
    lastScrollPosition.value = window.scrollY
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })



</script>

<style>
.headerclass{
  border-radius: 0 0 .6rem .6rem;
  box-shadow: 0 .2rem 1rem 0 hsl(0deg 0% 15% / 4%);
}
.AppHeader{
  ul > li > span:hover {
    background-color: #425aef;
    color: #fff !important;
  }
}
.container {
  transition: transform .3s, -webkit-transform .3s;
  width: 100%;
}

.nav-height {
  height: 64px;
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

.menus_child {
  position: absolute;
  top: 50px;
  border-radius: 55px;
  background-color: #fff;
  color: #000;
  display: flex;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.menus_child li {
  padding: 8px 15px;
}

.menus_child_item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menus_child li > div {
  padding: 0 10px;
}

.menus_child li > div:hover {
  border-radius: 15px;
  background-color: #425aef;
  color: #fff;
}

.menus_child_item h2 {
  width: 45px;
}

@keyframes slide-up-my {
  0% {
    transform: translate(-40%, -10%);
    opacity: 0;
  }

  100% {
    transform: translate(-40%, 0);
    opacity: 1;
  }
}

.slide-up-my {
  animation: slide-up-my 0.3s ease both;
}

.dbNav_yddhl {
  margin-left: auto;
  width: 100px;
  display: none;
}
</style>

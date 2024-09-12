<script setup lang="ts">
const blogStore = useBlogStore()
//滚动条
const isScrollUp = ref(false)
//导航栏是否固定
const lastScrollPosition = ref()

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
let menus_child_state = ref(-99)

function menusMouseOver(type) {
  menus_child_state.value = type
}

function menusMouseLeave() {
  menus_child_state.value = -99
}

// ------------------- 导航栏鼠标悬停移开显示消失END------------------------

const isExternalLink = (path) => {
  // 判断是否为外链
  return /^(http|https):\/\//.test(path)
}

onMounted(() => {
  lastScrollPosition.value = window.scrollY
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!--  @mouseleave="menusMouseLeave"-->
  <nav
    style="height: 64px; width: 40%"
    @mouseleave="menusMouseLeave"
  >
    <ul
      class="AppHeader flex nav-height justify-center items-center content-center frosted-glass"
      :class="{ 'is-showUp': isScrollUp, 'is-showdown': !isScrollUp }"
    >
      <li
        v-for="(item, index) in blogStore.menuList"
        :key="index"
        :class="item.class"
        @mouseover="menusMouseOver(index)"
      >
        <NuxtLink
          :target="isExternalLink(item.path) ? '_blank' : '_self'"
          :to="`${item.path}`"
          class="flex items-center blog_menu"
        >
          <span
            class="pl-1"
            style="margin-right: 20px"
            >{{ item.text }}</span
          >
        </NuxtLink>
        <!--            开始浏览样式-->
        <div v-if="menus_child_state === index">
          <ul class="menus_child slide-up-my">
            <li
              class="submenu-item"
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              :class="item.class"
            >
              <NuxtLink
                :target="isExternalLink(child.path) ? '_blank' : '_self'"
                :to="`${child.path}`"
                class="flex items-center"
              >
                <Icon
                  size="20"
                  :name="child.icon"
                />
                &nbsp;
                <h2 style="width: fit-content; font-size: 16px; font-weight: bold">
                  {{ child.text }}
                </h2>
                <Icon
                  name="mynaui:chevron-right"
                  class="ml-2"
                />
              </NuxtLink>

              <ul class="submenu">
                <li
                  class="menus_child_item"
                  v-for="(childs, childIndexs) in child.children"
                  :key="childIndexs"
                  :class="item.class"
                >
                  <NuxtLink
                    :to="`${childs.path}`"
                    :target="isExternalLink(childs.path) ? '_blank' : '_self'"
                    class="flex items-center menus_child_menu"
                  >
                    <Icon
                      v-if="childs.icon"
                      size="20"
                      :name="childs.icon"
                    />
                    &nbsp;
                    <h4 style="width: fit-content; text-align: center">{{ childs.text }}</h4>
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <ul
      class="nav-height flex justify-center items-center content-center"
      :class="{ 'is-showUp': isScrollUp, 'is-showdown': !isScrollUp, invisible: !isScrollUp }"
    >
      <span class="py-1.5"> </span>
      <li class="flex items-center">
        <span class="pl-1">旅途总有一天会迎来终点,不必匆忙</span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.submenu {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  /* 子菜单缩进 */
  padding: 0 0 0 20px;
}

.submenu-item {
  padding: 5px 0;
}
.submenu-item:hover {
  background: #fef7d9;
  border-radius: 10px;
}
.blog_menu {
  padding: 0 10px;
  color: #000;
  font-weight: 500;
  cursor: pointer;
}


.AppHeader {
  ul > li > span:hover {
    background-color: #425aef;
    color: #fff !important;
  }
}

.nav-height {
  height: 64px;
}

.is-showUp {
  transform: translateY(-100%);
  transition: transform 0.3s, -webkit-transform 0.3s;
}

.is-showdown {
  transform: translateY(0);
  transition: transform 0.3s, -webkit-transform 0.3s;
}

/**毛玻璃 */
.frosted-glass {
  //box-shadow: 0 0.3px 0.3px rgba(0, 0, 0, 0.1), 0 0.7px 1px rgba(0, 0, 0, 0.15), 0 1.2px 2.5px rgba(0, 0, 0, 0.2), 0 1.4px 5px rgba(0, 0, 0, 0.25), 0 8px 15px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(1px);
}

.frosted-glass:hover {
  //box-shadow: 0 0.7px 1px rgba(0, 0, 0, 0.157), 0 1.7px 2.6px rgba(0, 0, 0, 0.224), 0 3.5px 5.3px rgba(0, 0, 0, 0.28), 0 7.3px 11px rgba(0, 0, 0, 0.346), 0 20px 30px rgba(0, 0, 0, 0.5);
}

.menus_child {
  width: 300px;
  position: absolute;
  top: 50px;
  border-radius: 10px;
  background-color: #fff;
  color: #000;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.menus_child li {
  margin: 8px 8px;
  animation: slide-in-from-right 0.8s ease both;
  opacity: 0; /* 初始透明 */
  animation-fill-mode: forwards; /* 保持最后状态 */
}

/* 为每个菜单项设置不同的延迟 */
.menus_child li:nth-child(1) {
  animation-delay: 0s;
}
.menus_child li:nth-child(2) {
  animation-delay: 0.2s;
}
.menus_child li:nth-child(3) {
  animation-delay: 0.3s;
}
.menus_child li:nth-child(4) {
  animation-delay: 0.4s;
}

/* 定义动画 */
@keyframes slide-in-from-right {
  0% {
    transform: translate(80%, 0);
    opacity: 0;
  }

  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
}



.menus_child_item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menus_child li > div {
  padding: 0 10px;
}

.menus_child_menu {
  padding: 5px 10px;
  color: #000;
  font-weight: 500;
  cursor: pointer;
}

.menus_child_menu:hover {
  --tw-text-opacity: 1;
  color: rgb(249 115 22 / var(--tw-text-opacity));
  border-radius: 15px;
  background-color: #fceba1;
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

/* 新增的动画效果 */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.8s ease;
}

.slide-fade-enter, .slide-fade-leave-to /* .slide-fade-leave-active在Vue 2中使用 */ {
  opacity: 0;
  transform: translateX(20px); /* 从右边进入 */
}
</style>

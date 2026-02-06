<script setup lang="ts">
import { getMenuTree, type MenuTreeItem } from '~/api/menu'
import { useBlogStore } from '~/stores/blogStore'

// 菜单数据
const menuTree = ref<MenuTreeItem[]>([])
const isMenuVisible = ref(false)
const activeMenuId = ref<number | null>(null)
let hoverTimeout: NodeJS.Timeout | null = null

// 使用 store
const blogStore = useBlogStore()

// 滚动相关
const isScrollUp = ref(false)
const lastScrollPosition = ref(0)
const route = useRoute()

// 判断是否为文章页
const isArticlePage = computed(() => {
  return route.path.startsWith('/article/')
})

// 监听滚动事件
const handleScroll = () => {
  const currentScrollPosition = window.scrollY
  if (currentScrollPosition > lastScrollPosition.value && currentScrollPosition > 100) {
    // 向下滚动且超过100px
    isScrollUp.value = true
  } else {
    // 向上滚动
    isScrollUp.value = false
  }
  lastScrollPosition.value = currentScrollPosition
}

// 显示的文字
const scrollText = computed(() => {
  if (isArticlePage.value && blogStore.currentArticleTitle) {
    return `正在阅读：${blogStore.currentArticleTitle}`
  }
  return '旅途总有一天会迎来终点,不必匆忙'
})

// 获取菜单数据
const fetchMenuTree = async () => {
  try {
    const response = await getMenuTree()
    if (response && response.code === 200) {
      menuTree.value = response.data || []
    } else {
      menuTree.value = getDefaultMenuData()
    }
  } catch (error) {
    console.error('获取菜单数据失败:', error)
    // 使用默认菜单数据作为fallback
    menuTree.value = getDefaultMenuData()
  }
}

// 默认菜单数据（作为fallback）
const getDefaultMenuData = (): MenuTreeItem[] => {
  return [
    {
      menuId: 1,
      icon: 'noto:house-with-garden',
      text: '开始浏览',
      path: '/',
      class: 'menu-item-home',
      sort: 1,
      parentId: undefined,
      isExternal: '0',
      visible: '0',
      enabled: '0',
      children: [
        {
          menuId: 2,
          icon: 'mynaui:sparkles',
          text: '网站',
          path: undefined,
          class: undefined,
          sort: 1,
          parentId: 1,
          isExternal: '0',
          visible: '0',
          enabled: '0',
          children: [
            {
              menuId: 3,
              icon: '',
              text: '个人主页',
              path: '/',
              class: undefined,
              sort: 1,
              parentId: 2,
              isExternal: '0',
              visible: '0',
              enabled: '0'
            },
            {
              menuId: 10,
              icon: '',
              text: '摄影展示',
              path: '/photography',
              class: undefined,
              sort: 1.5,
              parentId: 2,
              isExternal: '0',
              visible: '0',
              enabled: '0'
            },
            {
              menuId: 4,
              icon: '',
              text: '云盘主页',
              path: 'https://jwyt.cloud',
              class: undefined,
              sort: 2,
              parentId: 2,
              isExternal: '1',
              visible: '0',
              enabled: '0'
            }
          ]
        },
        {
          menuId: 5,
          icon: 'mynaui:train',
          text: '项目',
          path: undefined,
          class: undefined,
          sort: 2,
          parentId: 1,
          isExternal: '0',
          visible: '0',
          enabled: '0',
          children: [
            {
              menuId: 6,
              icon: '',
              text: 'ChatGpt',
              path: 'https://chat.jwyt.cloud',
              class: undefined,
              sort: 1,
              parentId: 5,
              isExternal: '1',
              visible: '0',
              enabled: '0'
            },
            {
              menuId: 7,
              icon: '',
              text: '网站主题项目',
              path: undefined,
              class: undefined,
              sort: 2,
              parentId: 5,
              isExternal: '0',
              visible: '0',
              enabled: '0'
            }
          ]
        }
      ]
    },
    {
      menuId: 8,
      icon: '',
      text: '关于',
      path: '/about',
      class: 'menu-item-archives',
      sort: 2,
      parentId: undefined,
      isExternal: '0',
      visible: '0',
      enabled: '0'
    }
  ]
}

// 判断是否为外链
const isExternalLink = (path?: string) => {
  return path && /^(http|https):\/\//.test(path)
}

// 显示菜单
const showMenu = (menuId: number) => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  // 防止重复设置相同的菜单
  if (activeMenuId.value === menuId && isMenuVisible.value) {
    return
  }
  activeMenuId.value = menuId
  isMenuVisible.value = true
}

// 隐藏菜单
const hideMenu = () => {
  hoverTimeout = setTimeout(() => {
    activeMenuId.value = null
    isMenuVisible.value = false
  }, 300)
}

// 取消隐藏菜单
const cancelHideMenu = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
}


// 获取当前激活的菜单项
const activeMenu = computed(() => {
  if (!activeMenuId.value) return null
  return menuTree.value.find(menu => menu.menuId === activeMenuId.value)
})

// 组件挂载时获取菜单数据
onMounted(() => {
  fetchMenuTree()
  lastScrollPosition.value = window.scrollY
  window.addEventListener('scroll', handleScroll)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- 背景蒙层 -->
  <div 
    class="overlay" 
    :class="{ show: isMenuVisible }"
  ></div>

  <!-- 导航栏容器 -->
  <div class="navbar-container">
    <!-- 主导航栏 -->
    <nav 
      class="top-navbar" 
      :class="{ 'is-hidden': isScrollUp }"
      @mouseenter="cancelHideMenu"
      @mouseleave="hideMenu"
    >
      <!-- 导航头部 -->
      <div class="nav-header">
        <template v-for="menu in menuTree" :key="menu.menuId">
          <a 
            v-if="menu.children && menu.children.length > 0"
            href="#" 
            class="nav-link has-dropdown"
            :class="{ active: activeMenuId === menu.menuId }"
            @mouseenter="showMenu(menu.menuId)"
          >
            {{ menu.text }}
          </a>
          <!-- 关于页面使用智能预加载 -->
          <CommonPreloadLink 
            v-else-if="menu.path === '/about'"
            :to="menu.path"
            preload-type="about"
            class="nav-link"
          >
            {{ menu.text }}
          </CommonPreloadLink>
          <!-- 其他普通链接 -->
          <a
            v-else-if="isExternalLink(menu.path)"
            :href="menu.path"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-link"
          >
            {{ menu.text }}
          </a>
          <NuxtLink 
            v-else
            :to="menu.path || '#'"
            class="nav-link"
          >
            {{ menu.text }}
          </NuxtLink>
        </template>
      </div>
    </nav>

    <!-- 悬浮菜单框 -->
    <div 
      class="floating-menu" 
      :class="{ show: isMenuVisible && activeMenu }"
      @mouseenter="cancelHideMenu"
      @mouseleave="hideMenu"
    >
      <div v-if="activeMenu" class="menu-content">
      <template v-for="(section, sectionIndex) in activeMenu.children" :key="section.menuId">
        <div 
          class="menu-section" 
          :style="{ animationDelay: `${sectionIndex * 0.1 + 0.1}s` }"
        >
          <a :href="section.path || '#'" class="menu-item" :class="{ 'has-submenu': section.children && section.children.length > 0 }">
            <span v-if="section.icon" class="menu-icon">
              <Icon :name="section.icon" size="20" />
            </span>
            <span v-else class="menu-icon">📁</span>
            {{ section.text }}
          </a>
          
          <div 
            v-if="section.children && section.children.length > 0" 
            class="submenu-items two-column"
          >
            <template v-for="(child, childIndex) in section.children" :key="child.menuId">
              <a
                v-if="isExternalLink(child.path)"
                :href="child.path"
                target="_blank"
                rel="noopener noreferrer"
                class="submenu-item"
                :style="{ animationDelay: `${sectionIndex * 0.1 + childIndex * 0.05 + 0.3}s` }"
              >
                {{ child.text }}
              </a>
              <NuxtLink 
                v-else
                :to="child.path || '#'"
                class="submenu-item"
                :style="{ animationDelay: `${sectionIndex * 0.1 + childIndex * 0.05 + 0.3}s` }"
              >
                {{ child.text }}
              </NuxtLink>
            </template>
          </div>
        </div>
      </template>
      </div>
    </div>

    <!-- 滚动时显示的文字栏 -->
    <div class="scroll-text-bar" :class="{ 'is-visible': isScrollUp }">
      <span>{{ scrollText }}</span>
    </div>
  </div>
</template>

<style scoped>
/* 背景蒙层 - 白色磨砂效果，覆盖除菜单外的所有内容 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 9999;
  pointer-events: none; /* 始终不阻挡点击 */
}

.overlay.show {
  opacity: 1;
  visibility: visible;
  pointer-events: none; /* 确保显示时也不阻挡点击 */
}

/* 导航栏容器 - 适应整体布局 */
.navbar-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10000;
}

/* 顶部导航栏 - 移除背景和阴影 */
.top-navbar {
  background: transparent;
  padding: 0 20px;
  height: 50px;
  overflow: visible;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateY(0);
}

.top-navbar.is-hidden {
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
}

/* 滚动文字栏 */
.scroll-text-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(-100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none; /* 始终不阻挡点击 */
}

.scroll-text-bar.is-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: none; /* 确保可见时也不阻挡点击 */
}

.scroll-text-bar span {
  font-size: 16px;
  color: #333;
  font-weight: 700;
}

/* 悬浮菜单框 - 相对定位 */
.floating-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  padding: 8px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  width: auto;
  min-width: 360px;
  max-width: 90vw;
  height: auto;
  overflow: visible;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(-10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10001;
  margin-top: 10px;
}

.floating-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* 导航头部 */
.nav-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  height: 50px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  font-weight: 700;
  padding: 15px 0;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 15px;
  cursor: pointer; /* 添加手型光标 */
}

.nav-link:hover {
  color: #000;
  cursor: pointer; /* 确保 hover 时也是手型 */
}

/* .nav-link.has-dropdown::after {
  content: '▼';
  font-size: 10px;
  margin-left: 4px;
  color: #666;
  transition: transform 0.3s ease;
} */

.nav-link.active {
  background: rgba(255, 182, 193, 0.2);
  color: #d63384;
  padding: 8px 16px;
  border-radius: 20px;
  margin: -8px 0;
}

.nav-link.active::after {
  transform: rotate(180deg);
  color: #d63384;
}

/* 菜单内容 */
.menu-content {
  box-sizing: border-box;
}

/* 菜单项样式 */
.menu-section {
  padding: 2px;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.menu-section:last-child {
  margin-bottom: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #666;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 500;
  position: relative;
}

/* 有子菜单的一级菜单添加箭头 */
.menu-item.has-submenu::after {
  content: '›';
  font-size: 14px;
  margin-left: 8px;
  color: #999;
  transition: all 0.3s ease;
  font-weight: normal;
}

/* hover整个菜单区域时的背景效果 */
.menu-section:hover {
  background: rgba(255, 182, 193, 0.1);
  border-radius: 8px;
}

/* hover整个菜单区域时，一级菜单文字变色 */
.menu-section:hover > .menu-item {
  color: #d63384;
}

.menu-section:hover > .menu-item.has-submenu::after {
  color: #d63384;
}

/* 当子菜单被hover时箭头变化 */
.menu-section:hover .submenu-items:hover ~ .menu-item.has-submenu::after,
.menu-section .submenu-items:hover + .menu-item.has-submenu::after {
  transform: rotate(90deg);
}

/* 更简单的方法：当子菜单容器被hover时，父级menu-item的箭头旋转 */
.menu-section:has(.submenu-items:hover) .menu-item.has-submenu::after {
  transform: rotate(90deg);
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* 子菜单项 */
.submenu-items {
  margin-left: 16px;
  margin-top: 0px;
  padding-right: 16px;
  box-sizing: border-box;
  width: 100%;
}

.submenu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  color: #666;
  text-decoration: none;
  font-size: 13px;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-bottom: 3px;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
}

.submenu-item:hover {
  background: rgba(255, 182, 193, 0.25);
  color: #d63384;
  font-weight: 500;
}

/* 双列布局 */
.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
}

/* 隐藏滚动条 */
.floating-menu::-webkit-scrollbar {
  display: none;
}

.floating-menu {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 简单的从上往下显示动画 - 所有元素初始状态 */
.menu-section, .menu-item, .submenu-item {
  opacity: 0;
  transform: translateY(-20px);
}

/* 菜单区域按顺序显示 */
.floating-menu.show .menu-section {
  animation: simpleSlideIn 0.3s ease-out forwards;
  /* 延迟由模板中的 :style="{ animationDelay: `${sectionIndex * 0.1 + 0.1}s` }" 控制 */
}

/* 一级菜单项显示 */
.floating-menu.show .menu-section .menu-item {
  animation: simpleSlideIn 0.3s ease-out forwards;
  animation-delay: inherit;
}

/* 子菜单项按顺序显示 */
.floating-menu.show .menu-section .submenu-item {
  animation: simpleSlideIn 0.3s ease-out forwards;
  /* 延迟由模板中的 :style="{ animationDelay: `${sectionIndex * 0.1 + childIndex * 0.05 + 0.3}s` }" 控制 */
}

/* 简单的滑入动画 */
@keyframes simpleSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

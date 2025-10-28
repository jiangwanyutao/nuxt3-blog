<script setup lang="ts">
import { NMessageProvider, NBackTop, NConfigProvider, darkTheme } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

/**
 * 挂载之前
 */
const show = ref(true)
onBeforeMount(() => {
  // 解决 tailwind 覆盖问题, 在挂载之前设置 meta
  // const meta = document.createElement('meta')
  // meta.name = 'naive-ui-style'
  // document.head.appendChild(meta)
})

const color = useColorMode()
const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    // primaryColor: '#409eff',
    // primaryColorHover: '#79bbff'
    primaryColor: '#6366f1',
    primaryColorHover: '#818cf8'
  }
}
const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#f97316',
    primaryColorHover: '#fdba74'
  }
}

// 是否首次加载
const isFullLoading = ref(true)
onMounted(() => {
  setTimeout(() => {
    isFullLoading.value = false
  }, 1000)
})
</script>

<template>
  <n-config-provider
    ref="el"
    inline-theme-disabled
    preflight-style-disabled
    :theme="color.value === 'dark' ? darkTheme : null"
    :theme-overrides="color.value === 'dark' ? darkThemeOverrides : lightThemeOverrides"
  >
    <n-notification-provider :max="3">
      <n-modal-provider>
        <!-- 页面内容始终渲染，loading 作为遮罩层 -->
        <NuxtLayout>
          <!-- 在页面导航之间显示一个进度条 -->
          <NuxtLoadingIndicator />
          <NuxtPage />
          <CommonSideEdge></CommonSideEdge>
        </NuxtLayout>
        
        <!-- Loading 遮罩层 -->
        <Transition name="fade">
          <Loading v-if="isFullLoading" class="loading-overlay"></Loading>
        </Transition>
      </n-modal-provider>
    </n-notification-provider>
    <!-- 回到顶部 -->
  </n-config-provider>
</template>

<style>
/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: all 1s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

/* Loading 遮罩层样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #fff; /* 或者使用你的背景色 */
}

/* Loading 淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

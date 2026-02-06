<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

const color = useColorMode()

const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
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

// =============================================
//  智能 Loading：跟踪真实的页面就绪状态
// =============================================
const isFullLoading = ref(true)
// 最少展示时间，避免闪一下就消失
const MIN_LOADING_MS = 600
const loadStart = Date.now()

onMounted(() => {
  // 页面挂载 = 水合完成，内容已可交互
  const elapsed = Date.now() - loadStart
  const remaining = Math.max(0, MIN_LOADING_MS - elapsed)

  // 确保 loading 至少显示 MIN_LOADING_MS，然后平滑退出
  setTimeout(() => {
    isFullLoading.value = false
  }, remaining)
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
          <NuxtLoadingIndicator />
          <NuxtPage />
          <CommonSideEdge />
        </NuxtLayout>

        <!-- Loading 遮罩层 -->
        <Transition name="loading-fade">
          <LoadingOverlay v-if="isFullLoading" />
        </Transition>
      </n-modal-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style>
/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.6s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.5rem);
}

/* Loading 淡出动画 - 加速退场 + 缩放 */
.loading-fade-leave-active {
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.loading-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>

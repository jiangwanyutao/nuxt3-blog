<script setup lang="ts">
import {
  NMessageProvider,
  NBackTop,
  NConfigProvider,
  darkTheme,
} from "naive-ui";
import type { GlobalThemeOverrides } from "naive-ui";
// const loadings = ref(false);
onMounted(() => {
  // if(process.client) {
  //   setTimeout(() => {
  //     show.value = false;
  //   }, 1000)
  // }
});
/**
 * 挂载之前
 */
const show = ref(true);
onBeforeMount(() => {
  // 解决 tailwind 覆盖问题, 在挂载之前设置 meta
  // const meta = document.createElement('meta')
  // meta.name = 'naive-ui-style'
  // document.head.appendChild(meta)
});

const color = useColorMode();
const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    // primaryColor: '#409eff',
    // primaryColorHover: '#79bbff'
    primaryColor: "#6366f1",
    primaryColorHover: "#818cf8",
  },
};
const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#f97316",
    primaryColorHover: "#fdba74",
  },
};

const nuxtApp = useNuxtApp();

// 是否首次加载
const isFullLoading = ref(true);

nuxtApp.hook("page:start", () => {
  isFullLoading.value = true;
});

nuxtApp.hook("page:finish", () => {
  isFullLoading.value = false;
});
</script>

<template>
  <n-config-provider
    ref="el"
    inline-theme-disabled
    preflight-style-disabled
    :theme="color.value === 'dark' ? darkTheme : null"
    :theme-overrides="
      color.value === 'dark' ? darkThemeOverrides : lightThemeOverrides
    "
  >
    <Loading v-if="isFullLoading"> </Loading>
    <NuxtLayout>
      <!-- 在页面导航之间显示一个进度条 -->
      <NuxtLoadingIndicator />
      <NuxtPage />
      <CommonSideEdge></CommonSideEdge>
    </NuxtLayout>
    <!-- 回到顶部 -->
  </n-config-provider>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>

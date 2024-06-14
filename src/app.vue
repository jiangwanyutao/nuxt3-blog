<script setup lang="ts">
import {
  NMessageProvider,
  NBackTop,
  NConfigProvider,
  darkTheme,
} from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
// const loadings = ref(false);
onMounted(() => {
  if(process.client) {
    setTimeout(() => {
      show.value = false;
    }, 1000)
  }
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
</script>

<template>
  <n-config-provider ref="el" inline-theme-disabled preflight-style-disabled
    :theme="color.value === 'dark' ? darkTheme : null"
    :theme-overrides="color.value === 'dark' ? darkThemeOverrides : lightThemeOverrides">
  <Loading :hidden="!show">
  </Loading>
    <NuxtLayout :hidden="show">
      <NuxtPage />
    </NuxtLayout>
    <!-- 回到顶部 -->
  </n-config-provider>
</template>

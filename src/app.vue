<script setup lang="ts">

/**
 * 挂载之前
 */
 onBeforeMount(() => {
  // 解决 tailwind 覆盖问题, 在挂载之前设置 meta
  // const meta = document.createElement('meta')
  // meta.name = 'naive-ui-style'
  // document.head.appendChild(meta)
})
</script>

<template>
  <n-config-provider ref="el" inline-theme-disabled preflight-style-disabled>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- 回到顶部 -->
  </n-config-provider>
</template>

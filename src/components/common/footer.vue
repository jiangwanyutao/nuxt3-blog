<script setup lang="ts">
const blogStore = useBlogStore()
//获取今年
const year = new Date().getFullYear()

// 清理函数
onBeforeUnmount(() => {
});
</script>

<template>
  <div class="pt-16">
    <CommonBilibiliFooter></CommonBilibiliFooter>
  </div>
  <footer>
    <div class="text-base flex items-center justify-between p-5 shadow-inner">
      <div class="flex items-center text-xm px-8" style="align-items: center">
        <img class="rotate360 h-6 h-6" src="~/assets/img/svg/sakura.svg" alt="" />
        <span class="pl-3"> ©2021 - {{ year }} by江晚正愁余 </span>
      </div>
      <div class="pr-28">
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer" v-if="blogStore.blogConfig?.icpNumber">
          {{ blogStore.blogConfig.icpNumber }}
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss"></style>

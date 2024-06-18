<script setup lang="ts">
const blogStore = useBlogStore()

const day = computed(() => {
  if (blogStore.siteConfig) {
    const differ = new Date().getTime() - new Date(blogStore.siteConfig.createSiteTime).getTime()
    const day = Math.floor(differ / 1000 / 60 / 60 / 24)
    return day
  } else {
    return '--'
  }
})
//获取今年
const year = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="pt-20 pb-12 text-center text-xs">
      <img class="rotate360 m-auto h-8 w-8" src="~/assets/img/svg/sakura.svg" alt="" />
      <p class="mt-2 text-slate-600">Crafted with by Jiangwan</p>
      <p class="my-3 text-neutral-400">
        <span> 小破站居然运行了 9999 天</span>
        <Icon class="heart mx-1 pb-1" name="fxemoji:beating-heart" size="22" />
        <span>访问量 {{ blogStore.viewsCount || '--' }}</span>
      </p>
      <p class="beian text-neutral-400">
        <span class="mr-1">© {{ year }} Jiangwan</span>
        <NuxtLink to="https://beian.miit.gov.cn" target="_blank">
          豫ICP备123456号-1
        </NuxtLink>
      </p>
    </div>
  </footer>
  <CommonBilibiliFooter></CommonBilibiliFooter>
</template>

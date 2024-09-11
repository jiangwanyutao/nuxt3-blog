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
// 通过 CDN 引入 twikoo js 文件
const cdnScript = document.createElement('script');
cdnScript.src = 'https://cdn.staticfile.org/twikoo/1.6.25/twikoo.all.min.js';
cdnScript.async = true;

const loadSecondScript = () => {
  // 执行 twikoo.init() 函数
  const initScript = document.createElement('script');
  initScript.innerHTML = `
      twikoo.init({
        envId: "https://***.xiaobotalk.com/",
        el: '#twikoo-comment'
      });
    `;
  initScript.id = 'twikoo-init-id'; // 添加唯一的 ID
  document.body.appendChild(initScript);
};

// 在 twikoo js 文件加载完成后，再加载执行 twikoo.init() 函数的 js 文件
cdnScript.addEventListener('load', loadSecondScript);
document.body.appendChild(cdnScript);

// 清理函数
onBeforeUnmount(() => {
  cdnScript.removeEventListener('load', loadSecondScript);
  document.body.removeChild(cdnScript);
  const secondScript = document.querySelector('#twikoo-init-id');
  if (secondScript) {
    document.body.removeChild(secondScript);
  }
});
</script>

<template>
<!--  <div id="twikoo-comment"></div>-->
  <div class="pt-16">
  <CommonBilibiliFooter></CommonBilibiliFooter>
  </div>
  <footer>
    <div
      class="text-base flex items-center justify-between p-5 bg-orange-50 shadow-inner"
    >
      <div
        class="flex items-center text-xm px-8"
        style="align-items: center"
      >
        <img
          class="rotate360 h-6 h-6"
          src="~/assets/img/svg/sakura.svg"
          alt=""
        />
        <span class="pl-3"> ©2021 - {{ year }} by江晚 </span>
      </div>
      <div class="pr-28">
        <NuxtLink
          to="https://beian.miit.gov.cn"
          target="_blank"
        >
          豫ICP备2021037402号-1
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss"></style>

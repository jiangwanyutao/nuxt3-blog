<template>
  <div class="rightBtn">
  <div class="scroll-to-top" @click="toTop">
    <Icon size="30" name="tdesign:backtop" />
  </div>
  </div>
</template>

<script setup lang="ts">

const i = ref(0)

onMounted(() => {
  window.addEventListener('scroll', handleScroll, true)
})

const handleScroll = () => {
  // 获取页面顶部的高度，要写！！这样页面滚动的时候才能获取到页面滚动距离顶部的高度
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const scrollBox = document.querySelector('.scroll-to-top')
  scrollTop > 300 ? scrollBox.style.opacity = 1 : scrollBox.style.opacity = 0
  // const scroll = scrollTop - this.i
  i.value = scrollTop
}

const toTop = () => {
  console.log('点击了')
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}
</script>

<style scoped>
.rightBtn{
  position: fixed;
  z-index: 999;
  right: 50px;
  bottom: 50px;
  margin-bottom: 50px;
  cursor: pointer;
}

</style>

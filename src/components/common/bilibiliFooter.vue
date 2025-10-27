<template>
  <div class="footer" @mousemove="mouseMethod">
    <div v-for="(image, index) in images" :key="index">
      <img :src="image.src" ref="imageRefs"  alt="动画人物"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const images = ref([
  { src: new URL('@/assets/img/footer/bilibili-autumn-1.png', import.meta.url).href },
  { src: new URL('@/assets/img/footer/bilibili-autumn-2.png', import.meta.url).href },
  { src: new URL('@/assets/img/footer/bilibili-autumn-3.png', import.meta.url).href },
  { src: new URL('@/assets/img/footer/bilibili-autumn-4.png', import.meta.url).href },
  { src: new URL('@/assets/img/footer/bilibili-autumn-5.png', import.meta.url).href },
  { src: new URL('@/assets/img/footer/bilibili-autumn-6.png', import.meta.url).href }
])

const imageRefs = ref([])

onMounted(() => {
  imageRefs.value = document.querySelectorAll('.footer img')
  //进入页面时触发一次
  mouseMethod({ clientX: window.outerWidth / 3 })
})

const mouseMethod = (e) => {
  let x = e.clientX / window.outerWidth
  let offset = 10 * x
  let blur = 20

  for (let [index, image] of imageRefs.value.entries()) {
    offset *= 1.3

    let blurValue = (Math.pow((index / imageRefs.value.length - x), 2) * blur)
    image.style.setProperty('--offset', `${offset}px`)
    image.style.setProperty('--blur', `${blurValue}px`)
  }
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.footer {
  height: 100px;
  width: 100%;
  position: relative;
  overflow: hidden; /* 添加overflow属性 */
}
.footer div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
  --offset: 0px;
  --blur: 2px;
}
.footer div img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translatex(var(--offset));
  filter: blur(var(--blur));
}

</style>

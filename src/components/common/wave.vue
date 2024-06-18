<template>
  <div class="wave">
  <div id="banner_wave_1"></div>
  <div id="banner_wave_2"></div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.wave{
  width: 100%;
  //overflow: hidden;
}
#banner_wave_1 {
  width: auto;
  height: 55px;
  background: url(https://cdn.qiniu.jwyt.cloud/common/wave_1.png) repeat-x;
  _filter: alpha(opacity=80);
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0px;
  z-index: 5;
  opacity: 1;
  transiton-property: opacity, bottom;
  transition-duration: .4s, .4s;
  animation-name: move1;
  animation-duration: 240s;
  animation-fill-mode: backwards;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

#banner_wave_2 {
  width: auto;
  height: 75px;
  background: url(https://cdn.qiniu.jwyt.cloud/common/wave_2.png) repeat-x;
  _filter: alpha(opacity=80);
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  z-index: 4;
  opacity: 1;
  transiton-property: opacity, bottom;
  transition-duration: .4s, .4s;
  animation-name: move1;
  animation-duration: 160s;
  animation-fill-mode: backwards;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* move1和move2只是方向不同，根据喜好自选即可。 */
/* 没做浏览器适配，具体哪些浏览器会生效未知，反正Chrome没什么问题。*/

@keyframes move1 {
  100% {
    background-position: -2000% 0;
  }
}

@keyframes move2 {
  100% {
    background-position: -100% 0;
  }
}
</style>

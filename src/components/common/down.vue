<template>
  <div  class="down-arrow animate-bounce" @click="headertopdown">
    <svg id="more-arrows">
      <polygon
          class="arrow-top"
          points="37.6,27.9 1.8,1.3 3.3,0 37.6,25.3 71.9,0 73.7,1.3"
      />
      <polygon
          class="arrow-middle"
          points="37.6,45.8 0.8,18.7 4.4,16.4 37.6,41.2 71.2,16.4 74.5,18.7"
      />
      <polygon
          class="arrow-bottom"
          points="37.6,64 0,36.1 5.1,32.8 37.6,56.8 70.4,32.8 75.5,36.1"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
const headertopdown = () => {
  console.log('点击了')
  //向下移动100vh
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth",
  });
}
</script>

<style scoped lang="scss">
.down-arrow {
  position: absolute;
  top: 89%;
  left: 47.5%;
  transform: translate(-80%, -50%);
  cursor: pointer;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Arrow & Hover Animation */
  #more-arrows {
    width: 80px;
    height: 65px;
    transform: scale(0.4);
  }

  @keyframes arrow-animation {
    0% {
      fill: #d9dadb;
      opacity: 0.5;
    }

    33.33% {
      fill: #d9dadb;
      opacity: 0.75;
    }

    66.66% {
      fill: #d9dadb;
      opacity: 1;
    }

    100% {
      fill: #d9dadb;
      opacity: 0.75;
    }
  }

  polygon.arrow-top {
    animation: arrow-animation 1s linear infinite;
  }

  polygon.arrow-middle {
    animation: arrow-animation 1s linear infinite 1.3s;
  }

  polygon.arrow-bottom {
    animation: arrow-animation 1s linear infinite 2.5s;
  }
}
</style>

<template>
  <!-- 友联 -->
  <div class="linksDiv introduce">
    <n-carousel
        direction="vertical"
        dot-placement="right"
        mousewheel
        dot-type="line"
        style="width: 100%;"
    >
      <n-carousel-item
          v-for="item in linksTableData.records"
          :key="item.id"
          class="link_item"
      >
        <div class="carousel-content">
          <img :src="item.backImg" class="background-image" />
          <div class="overlay">
            <n-badge dot type="success">
              <n-avatar
                  size="large"
                  :src="item.log"
              />
            </n-badge>
            <div class="text-content">
              <h3>{{ item.name }}</h3>
              <n-ellipsis
                  style="color: #e7e7e7; font-size: 15px"
                  :text="item.description"
                  :height="30"
              />
            </div>
          </div>
        </div>
      </n-carousel-item>
    </n-carousel>
    <div
        id="qwLink"
        @click="$router.push({ path: 'FriendShip' })"
    >
      <button
          class="link_btn"
          type="button"
      >
        <strong id="link_wz1">我的朋友们</strong>
        <strong id="link_wz2">我的朋友们 ▶</strong>
        <div id="container-stars"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const linksTableData = reactive({
  // 友联列表数据
  records: [
    {
      id: 1,
      log: 'https://lk.jwyt.cloud/sijing/2025/10/23/68fa1cbd8650a.png',
      backImg: 'https://lk.jwyt.cloud/sijing/2025/10/23/68fa1813bddc2.jpg',
      name: '江晚正愁余',
      description: '坚持你所热爱的，热爱你所坚持的!',
      realmName: 'https://jwyt.xyz',
      state: true
    }
  ],
  total: 0,
  current: 1
})
</script>

<style scoped>
.introduce {
  height: 140%;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}
.linksDiv {
  width: 39%;
  position: relative;
  overflow: hidden;
}

.carousel-content {
  position: relative; /* 使内容相对定位 */
  height: 100%; /* 确保内容占满 */
}

.background-image {
  width: 100%; /* 背景图片占满 */
  height: 100%; /* 背景图片占满 */
  object-fit: cover; /* 保持比例，裁剪多余部分 */
}

.overlay {
  position: absolute; /* 绝对定位，覆盖在背景图片上 */
  top: 40%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 使元素以中心为基准居中 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  flex-direction: column; /* 垂直排列内容 */
  text-align: center; /* 文本居中 */
}

.text-content {
  color: #ffffff; /* 文字颜色 */
  letter-spacing: 1px;
  margin-top: 10px; /* 头像和文本之间的间距 */
}

#qwLink {
  background-color: #fff;
  height: 70px;
  width: 100%;
  position: absolute;
  bottom: 0;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}

/* 友联按钮样式保持不变 */
#link_wz2 {
  display: none;
}
#qwLink:hover #link_wz1 {
  display: none;
}
#qwLink:hover #link_wz2 {
  display: block;
}

/* 按钮样式保持不变 */
.link_btn {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  backdrop-filter: blur(1rem);
  background-size: 300% 300%;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  background-image: linear-gradient(#212121, #212121),
  linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #8f51ea 67%, #0044ff 87%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}

/* 其他样式保持不变 */
#container-stars {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: 0.5s;
  backdrop-filter: blur(1rem);
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}

.link_btn strong {
  z-index: 2;
  font-family: 'Avalors Personal Use';
  font-size: 12px;
  letter-spacing: 5px;
  color: #ffffff;
  text-shadow: 0 0 4px white;
}

.link_btn:hover #container-stars {
  z-index: 1;
  background-color: #212121;
}

.link_btn:active {
  background-origin: border-box;
  background-clip: content-box, border-box;
  animation: none;
}

/* 星星效果和动画保持不变 */
#stars {
  position: relative;
  background: transparent;
  width: 200rem;
  height: 200rem;
}

#stars::after {
  content: '';
  position: absolute;
  top: -10rem;
  left: -100rem;
  width: 100%;
  height: 100%;
  animation: animStarRotate 90s linear infinite;
}

#stars::after {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
}

#stars::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 170%;
  height: 500%;
  animation: animStar 60s linear infinite;
}

#stars::before {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
  opacity: 0.5;
}

@keyframes gradient_301 {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes animStar {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-135rem);
  }
}

@keyframes animStarRotate {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0);
  }
}

@keyframes pulse_3011 {
  0% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
/* **************** */
</style>

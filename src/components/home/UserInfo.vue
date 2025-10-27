<template>
  <div class="userInfo">
    <div class="yy">
      <!-- 心电 -->
      <div class="xindian">
        <svg
          width="32px"
          height="24px"
        >
          <polyline
            points="0.157 11.977, 7 11.977, 10.921 24, 21.5 0, 25 12, 32 12"
            id="back"
          ></polyline>
          <polyline
            points="0.157 11.977, 7 11.977, 10.921 24, 21.5 0, 25 12, 32 12"
            id="front"
          ></polyline>
        </svg>
      </div>
      <span>{{ syYiyan }}</span>
    </div>
    <!-- 仓鼠 -->
    <div
      aria-label="Orange and tan hamster running in a metal wheel"
      role="img"
      class="wheel-and-hamster"
    >
      <div class="wheel"></div>
      <div class="hamster">
        <div class="hamster__body">
          <div class="hamster__head">
            <div class="hamster__ear"></div>
            <div class="hamster__eye"></div>
            <div class="hamster__nose"></div>
          </div>
          <div class="hamster__limb hamster__limb--fr"></div>
          <div class="hamster__limb hamster__limb--fl"></div>
          <div class="hamster__limb hamster__limb--br"></div>
          <div class="hamster__limb hamster__limb--bl"></div>
          <div class="hamster__tail"></div>
        </div>
      </div>
      <div class="spoke"></div>
    </div>
    <div class="user_db">
      <div class="user_db_title">
        <span>{{ bz_name }}</span>
        <span>生活日记。</span>
      </div>
      <div class="user_db_ico">
        <div
          @mouseover="user_db_ico_xt(1)"
          @mouseout="user_db_ico_yk"
          :class="{
            user_db_ico_gq: user_db_icoState1,
            user_db_ico_gh: !user_db_icoState1
          }"
          @click="router.push({ name: 'About' })"
        >
          <n-icon
            size="20"
            :color="user_ico1"
          >
            <LibraryOutline />
          </n-icon>
        </div>

        <div
          @mouseover="user_db_ico_xt(2)"
          @mouseout="user_db_ico_yk"
          :class="{
            user_db_ico_gq: user_db_icoState2,
            user_db_ico_gh: !user_db_icoState2
          }"
          @click="router.push({ name: 'Moments' })"
        >
          <n-icon
            size="20"
            :color="user_ico2"
          >
            <LogoInstagram />
          </n-icon>
        </div>
      </div>
    </div>
    <!-- 纸屑特效 -->
    <CommonConfettiCanvas />
  </div>
  <div class="card">
    <div class="content">
      <div class="front">
        <div class="front-content">
          <div class="front-text">
            <h3>公众号 <span class="wechat-badge">微信</span></h3>
            <p>快人一步获取最新文章 <span class="arrow">▶</span></p>
          </div>
        </div>
      </div>
      <div class="back">
        <div class="back-content">
          <div class="back-text">
            <h3>扫一扫</h3>
            <p>不错过精彩文章 <span class="arrow">▶</span></p>
          </div>
          <div class="qr-code">
            <img
              src="~/assets/common/wechat_gongzhonghao.png"
              alt="二维码"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import api from '@/api'
import { LibraryOutline, LogoInstagram } from '@vicons/ionicons5'
const bz_name = ref('江晚')
const router = useRouter()

const user_db_icoState1 = ref(true)
const user_db_icoState2 = ref(true)
const user_ico1 = ref('#fff')
const user_ico2 = ref('#fff')
function user_db_ico_xt(index) {
  if (index == 1) {
    user_db_icoState1.value = false
    user_ico1.value = '#4b62f0'
  } else if (index == 2) {
    user_db_icoState2.value = false
    user_ico2.value = '#4b62f0'
  }
}
function user_db_ico_yk() {
  user_db_icoState1.value = true
  user_db_icoState2.value = true
  user_ico1.value = '#fff'
  user_ico2.value = '#fff'
}

onMounted(() => {
  //查询一言
  // fetchData()
})

// 一言
const syYiyan = ref(null) //一言语句
function fetchData() {
  api.poetry
    .getYiYan3()
    .then((response) => {
      let res = response
      // 检查结果的长度，如果大于15，重新调用
      if (res.length > 13) {
        fetchData() // 递归调用自身
      } else {
        syYiyan.value = res
      }
    })
    .catch((error) => {})
}
</script>
<style scoped>
.card {
  width: 100%;
  height: 100px;
  position: relative;
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, #5cb85c 0%, #4caf50 50%, #66bb6a 100%);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.content {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
}

.front,
.back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  transition: transform 0.6s, opacity 0.6s;
  transform-style: preserve-3d;
}

.front {
  opacity: 1;
  transform: rotateY(0deg);
}

.back {
  opacity: 0;
  transform: rotateY(180deg);
}

.card:hover .front {
  opacity: 0;
  transform: rotateY(180deg);
}

.card:hover .back {
  opacity: 1;
  transform: rotateY(0deg);
}

/* 正面内容 */
.front-content {
  width: 100%;
}

.front-text h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
}

.wechat-badge {
  background: rgba(255, 255, 255, 0.25);
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.front-text p {
  margin: 0;
  font-size: 14px;
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
}

.arrow {
  font-size: 12px;
  opacity: 0.9;
}

/* 背面内容 */
.back-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-text h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.back-text p {
  margin: 0;
  font-size: 14px;
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
}

.qr-code {
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 8px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.qr-code img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* userInfo start*/
.userInfo {
  min-width: 236px;
}
.image-wrap {
  position: relative;
  width: 125px;
  height: 125px;
  border-radius: 50%;
  background-color: #ffffff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrap::before {
  content: '';
  position: absolute;
  inset: -10px 50px;
  background-image: linear-gradient(315deg, #d313d5, #20c0fe);
  animation: xuanzhuan 4s linear infinite;
  width: 40px;
}

.image-wrap::after {
  content: '';
  position: absolute;
  inset: 3px;
  background-color: #4b62f0;
  border-radius: 50%;
}

@keyframes xuanzhuan {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.image-wrap .content {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  z-index: 1;
}

.image-wrap .content img {
  width: 100%;
  height: 100%;
}

.userInfo {
  user-select: none;
  height: 320px;
  width: 100%;
  background-color: #4b62f0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  position: relative;
  padding: 12px 10px;
  box-sizing: border-box;
}

.yy {
  width: 100%;
  padding: 3px 10px;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
}

.user_db {
  display: flex;
  width: 100%;
  height: 50px;
  padding: 0 5px;
  box-sizing: border-box;
}

.user_db_title {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
  min-width: 0;
}

.user_db_title span:nth-child(1) {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
}

.user_db_title span:nth-child(2) {
  font-size: 12px;
  opacity: 0.6;
}

.user_db_ico {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-right: 5px;
}

.user_db_ico div {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #7789f3;
  cursor: pointer;
}

.user_db_ico div {
  flex-shrink: 0;
}

.user_db_ico_gq {
  background-color: #7789f3;
}

.user_db_ico_gh {
  animation: user_db_ico_Move 0.5s forwards;
}

@keyframes user_db_ico_Move {
  from {
    background-color: #7789f3;
  }

  to {
    background-color: #fff;
  }
}

/* ----------------------------一言心电end------------------------ */
.xindian svg polyline {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.xindian svg polyline#back {
  fill: none;
  stroke: #ff4d5033;
}

.xindian svg polyline#front {
  fill: none;
  stroke: #ff4d4f;
  stroke-dasharray: 25, 70;
  stroke-dashoffset: 96;
  animation: dash_682 1.4s linear infinite;
}

@keyframes dash_682 {
  72.5% {
    opacity: 0;
  }

  to {
    stroke-dashoffset: 0;
  }
}
/* ----------------------------一言心电end------------------------ */

/* -----------------------仓鼠------------------ */
.wheel-and-hamster {
  --dur: 1s;
  position: relative;
  width: 10em;
  height: 10em;
  font-size: 12px;
  margin: 10px 0;
  flex-shrink: 0;
}

.wheel,
.hamster,
.hamster div,
.spoke {
  position: absolute;
}

.wheel,
.spoke {
  border-radius: 50%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wheel {
  background: radial-gradient(100% 100% at center, hsla(0, 0%, 60%, 0) 47.8%, hsl(0, 0%, 60%) 48%);
  z-index: 2;
}

.hamster {
  animation: hamster var(--dur) ease-in-out infinite;
  top: 40%;
  left: calc(50% - 3.5em);
  width: 7em;
  height: 3.75em;
  transform: rotate(4deg) translate(-0.8em, 1.85em);
  transform-origin: 50% 0;
  z-index: 1;
}

.hamster__head {
  animation: hamsterHead var(--dur) ease-in-out infinite;
  background: hsl(30, 90%, 55%);
  border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
  box-shadow: 0 -0.25em 0 hsl(30, 90%, 80%) inset, 0.75em -1.55em 0 hsl(30, 90%, 90%) inset;
  top: 0;
  left: -2em;
  width: 2.75em;
  height: 2.5em;
  transform-origin: 100% 50%;
}

.hamster__ear {
  animation: hamsterEar var(--dur) ease-in-out infinite;
  background: hsl(0, 90%, 85%);
  border-radius: 50%;
  box-shadow: -0.25em 0 hsl(30, 90%, 55%) inset;
  top: -0.25em;
  right: -0.25em;
  width: 0.75em;
  height: 0.75em;
  transform-origin: 50% 75%;
}

.hamster__eye {
  animation: hamsterEye var(--dur) linear infinite;
  background-color: hsl(0, 0%, 0%);
  border-radius: 50%;
  top: 0.375em;
  left: 1.25em;
  width: 0.5em;
  height: 0.5em;
}

.hamster__nose {
  background: hsl(0, 90%, 75%);
  border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
  top: 0.75em;
  left: 0;
  width: 0.2em;
  height: 0.25em;
}

.hamster__body {
  animation: hamsterBody var(--dur) ease-in-out infinite;
  background: hsl(30, 90%, 90%);
  border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
  box-shadow: 0.1em 0.75em 0 hsl(30, 90%, 55%) inset, 0.15em -0.5em 0 hsl(30, 90%, 80%) inset;
  top: 0.25em;
  left: 2em;
  width: 4.5em;
  height: 3em;
  transform-origin: 17% 50%;
  transform-style: preserve-3d;
}

.hamster__limb--fr,
.hamster__limb--fl {
  clip-path: polygon(0 0, 100% 0, 70% 80%, 60% 100%, 0% 100%, 40% 80%);
  top: 2em;
  left: 0.5em;
  width: 1em;
  height: 1.5em;
  transform-origin: 50% 0;
}

.hamster__limb--fr {
  animation: hamsterFRLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30, 90%, 80%) 80%, hsl(0, 90%, 75%) 80%);
  transform: rotate(15deg) translateZ(-1px);
}

.hamster__limb--fl {
  animation: hamsterFLLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30, 90%, 90%) 80%, hsl(0, 90%, 85%) 80%);
  transform: rotate(15deg);
}

.hamster__limb--br,
.hamster__limb--bl {
  border-radius: 0.75em 0.75em 0 0;
  clip-path: polygon(0 0, 100% 0, 100% 30%, 70% 90%, 70% 100%, 30% 100%, 40% 90%, 0% 30%);
  top: 1em;
  left: 2.8em;
  width: 1.5em;
  height: 2.5em;
  transform-origin: 50% 30%;
}

.hamster__limb--br {
  animation: hamsterBRLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30, 90%, 80%) 90%, hsl(0, 90%, 75%) 90%);
  transform: rotate(-25deg) translateZ(-1px);
}

.hamster__limb--bl {
  animation: hamsterBLLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30, 90%, 90%) 90%, hsl(0, 90%, 85%) 90%);
  transform: rotate(-25deg);
}

.hamster__tail {
  animation: hamsterTail var(--dur) linear infinite;
  background: hsl(0, 90%, 85%);
  border-radius: 0.25em 50% 50% 0.25em;
  box-shadow: 0 -0.2em 0 hsl(0, 90%, 75%) inset;
  top: 1.5em;
  right: -0.5em;
  width: 1em;
  height: 0.5em;
  transform: rotate(30deg) translateZ(-1px);
  transform-origin: 0.25em 0.25em;
}

.spoke {
  animation: spoke var(--dur) linear infinite;
  background: radial-gradient(100% 100% at center, hsl(0, 0%, 60%) 4.8%, hsla(0, 0%, 60%, 0) 5%),
    linear-gradient(hsla(0, 0%, 55%, 0) 46.9%, hsl(0, 0%, 65%) 47% 52.9%, hsla(0, 0%, 65%, 0) 53%)
      50% 50% / 99% 99% no-repeat;
}

/* Animations */
@keyframes hamster {
  from,
  to {
    transform: rotate(4deg) translate(-0.8em, 1.85em);
  }

  50% {
    transform: rotate(0) translate(-0.8em, 1.85em);
  }
}

@keyframes hamsterHead {
  from,
  25%,
  50%,
  75%,
  to {
    transform: rotate(0);
  }

  12.5%,
  37.5%,
  62.5%,
  87.5% {
    transform: rotate(8deg);
  }
}

@keyframes hamsterEye {
  from,
  90%,
  to {
    transform: scaleY(1);
  }

  95% {
    transform: scaleY(0);
  }
}

@keyframes hamsterEar {
  from,
  25%,
  50%,
  75%,
  to {
    transform: rotate(0);
  }

  12.5%,
  37.5%,
  62.5%,
  87.5% {
    transform: rotate(12deg);
  }
}

@keyframes hamsterBody {
  from,
  25%,
  50%,
  75%,
  to {
    transform: rotate(0);
  }

  12.5%,
  37.5%,
  62.5%,
  87.5% {
    transform: rotate(-2deg);
  }
}

@keyframes hamsterFRLimb {
  from,
  25%,
  50%,
  75%,
  to {
    transform: rotate(50deg) translateZ(-1px);
  }

  12.5%,
  37.5%,
  62.5%,
  87.5% {
    transform: rotate(-30deg) translateZ(-1px);
  }
}

@keyframes hamsterFLLimb {
  from,
  25%,
  50%,
  75%,
  to {
    transform: rotate(-30deg);
  }

  12.5%,
  37.5%,
  62.5%,
  87.5% {
    transform: rotate(50deg);
  }
}

@keyframes hamsterBRLimb {
  from,
  25%,
  50%,
  75%,
  to {
    transform: rotate(-60deg) translateZ(-1px);
  }

  12.5%,
  37.5%,
  62.5%,
  87.5% {
    transform: rotate(20deg) translateZ(-1px);
  }
}

@keyframes hamsterBLLimb {
  from,
  25%,
  50%,
  75%,
  to {
    transform: rotate(20deg);
  }

  12.5%,
  37.5%,
  62.5%,
  87.5% {
    transform: rotate(-60deg);
  }
}

@keyframes hamsterTail {
  from,
  25%,
  50%,
  75%,
  to {
    transform: rotate(30deg) translateZ(-1px);
  }

  12.5%,
  37.5%,
  62.5%,
  87.5% {
    transform: rotate(10deg) translateZ(-1px);
  }
}

@keyframes spoke {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(-1turn);
  }
}
/* -----------------------仓鼠end------------------ */
</style>

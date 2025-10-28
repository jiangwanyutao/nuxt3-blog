<template>
  <div class="main">
    <div class="wzlxzt">
      <div class="yghz">
        <div class="info">
          <p>
            hello，很荣幸你能认识我。
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="40">
                  <AccessibilitySharp />
                </n-icon>
              </template>
              友好的握手
            </n-tooltip>
          </p>
          <h1>我叫 江晚正愁余</h1>
          <p>
            以前是一名
            <span style="background: linear-gradient(to right, #8be4be, #e7cbaa); color: #3077ff"
              >&nbsp;前端程序员</span
            >
          </p>
          <p style="margin-top: 10px">
            现在是
            <span style="background: linear-gradient(to right, #8be4be, #cee19b); color: #3077ff"
              >&nbsp;唱跳boy&nbsp;</span
            >
          </p>
          <p style="display: flex; justify-content: flex-end">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon size="40">
                  <EarthSharp />
                </n-icon>
              </template>
              welcome to 河南!
            </n-tooltip>
          </p>
        </div>
        <n-card class="js">
          <h1>关于本站</h1>
          <div style="font-size: 15px; margin-bottom: 20px">
            一款前(Nuxt3)后(nestjs)端分离的博客系统，在我不断地复制粘贴、复制粘贴，又复制粘贴的努力下，它终于问世啦~
          </div>
          <div class="scrolling-text">
            小伙伴们大家好，我是练习时长两年半的程序猿，喜欢复制、粘贴，在今后的日子中，我还会将此博客继续完善、改进，期待的话可以互换友联，或者收藏博客。
          </div>

          <transition name="fade">
            <div
              class="jineng"
              v-if="jinengState"
            >
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/java.png"
                  style="background-color: #fff; margin-right: 5px"
                />
                <p>JAVA</p>
              </div>
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/css3.jpg"
                  style="background-color: #fff; margin-right: 5px"
                />
                <p>CSS</p>
              </div>
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/maven.png"
                  style="background-color: #fff; margin-right: 5px"
                />
                <p>maven</p>
              </div>
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/mysql.png"
                  style="background-color: #fff; margin-right: 5px"
                />
                <p>mysql</p>
              </div>
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/redis.png"
                  style="background-color: #fff; margin-right: 5px"
                />
                <p>redis</p>
              </div>
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/spring.png"
                  style="background-color: #fff; margin-right: 5px"
                />
                <p>spring</p>
              </div>
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/Vue.png"
                  style="background-color: #fff; margin-right: 5px"
                />
                <p>vue</p>
              </div>
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/js.png"
                  style="background-color: #fff; margin-right: 5px"
                />
                <p>JavaScript</p>
              </div>
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/git.webp"
                  style="background-color: red; margin-right: 5px"
                />
                <p>git</p>
              </div>
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/html.png"
                  style="background-color: red; margin-right: 5px"
                />
                <p>Html</p>
              </div>
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/mybatis.svg"
                  style="background-color: #fff; margin-right: 5px"
                />
                <p>mybatis</p>
              </div>
              <div class="jinengItem">
                <n-avatar
                  icon="ios-person"
                  size="small"
                  src="/toolIco/jquery.png"
                  style="background-color: #fff; margin-right: 5px"
                />
                <p>jquery</p>
              </div>
            </div>
          </transition>
        </n-card>
        <div
          class="jsZz"
          @mouseover="mouseoverJs"
          @mouseout="mouseoutJs"
        ></div>
      </div>

      <div class="yghz">
        <canvas
          class="sj"
          ref="canvas"
          width="300"
          height="300"
        ></canvas>
        <div class="sjDIv">
          <h1>访问统计</h1>
          <div
            class="dateDiv"
            v-if="visitData"
          >
            <div>
              <p>今日访问</p>
              <h1>{{ visitData.todayCount }}</h1>
            </div>

            <div>
              <p>昨日访问</p>
              <h1>{{ visitData.yesterdayCount }}</h1>
            </div>

            <div>
              <p>本月访问</p>
              <h1>{{ visitData.thisMonthCount }}</h1>
            </div>

            <div>
              <p>总访问</p>
              <h1>{{ visitData.totalCount }}</h1>
            </div>
          </div>
        </div>
        <svg
          class="cheIco"
          aria-hidden="true"
        >
          <use xlink:href="#icon-gaojipaoche"></use>
        </svg>

        <!-- 性格卡片 -->
        <div class="personality-card">
          <div class="personality-content">
            <div class="personality-text">
              <p class="personality-label">性格</p>
              <h2 class="personality-type">守护者</h2>
              <h3 class="personality-code">ISFJ-T</h3>
              <p class="personality-desc">
                守卫者是真正的利他主义者，他们会以更大的善意来对待友善，并以热情和慷慨的态度参与他们的工作和对待他们相信的人们。
              </p>
              <a 
                href="https://www.16personalities.com/" 
                target="_blank"
                class="personality-link"
              >
                在 16personalities 了解更多关于 守护者
              </a>
            </div>
            <div class="personality-image">
              <img src="~/assets/common/ISFJ_male.png" alt="ESFJ性格" />
            </div>
          </div>
        </div>
      </div>

      <!-- 原神游戏展示 -->
      <div class="genshin-game">
          <!-- 手风琴图片展示（铺满容器） -->
          <div class="accordion-container">
            <div 
              v-for="(img, index) in genshinImages" 
              :key="index"
              class="accordion-item"
              :style="{ backgroundImage: `url(${img})` }"
            >
            </div>
          </div>

          <!-- 文字悬浮层 -->
          <div class="genshin-header">
            <p class="game-label">爱好游戏</p>
            <h2 class="game-title">原神</h2>
          </div>
          
          <!-- UID右下角 -->
          <div class="game-uid-container">
            <p class="game-uid">UID: 171038996</p>
          </div>

          <!-- 加载条动画 -->
          <div class="loading-bar-container">
            <img src="/images/about/loading-bar.png" alt="loading" class="loading-bar" />
          </div>
      </div>

      <n-card class="dashang">
        <span style="color: #838383">致谢</span>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <h1>打赏名单</h1>
          <AboutBeg />
        </div>
        <p>感谢打赏的小伙伴，打赏金额随意，一分钱也是支持我不断前进的动力。</p>

        <div
          style="display: flex; flex-wrap: wrap"
          v-if="variable.begData"
        >
          <n-card
            style="width: 200px; margin: 20px 20px 10px 0"
            v-for="item in variable.begData.records"
            :key="item.id"
          >
            <div class="zsLi">
              <div style="font-size: 20px; font-weight: 700">
                {{ item.name }}
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 10px">
                <p class="moneyClass">￥{{ item.money }}</p>
                <Time
                  :time="item.creationTime"
                  :interval="1"
                />
              </div>
            </div>
          </n-card>
        </div>
      </n-card>

      <div
        class="comment"
        style="background-color: #fff; padding: 20px"
      >
        <p style="font-size: 20px; margin-bottom: 10px"><Icon type="ios-chatbubbles" />留言</p>
        <div id="yjplk">
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { EarthSharp, AccessibilitySharp } from '@vicons/ionicons5'

// 星轨背景
const canvas = ref(null)
let animationFrameId

const drawStarTrails = (ctx, width, height) => {
  const numStars = 600 // 星星数量
  const trails = Array.from({ length: numStars }, () => ({
    angle: Math.random() * 2 * Math.PI,
    radius: Math.random() * (Math.min(width, height) / 2) + 50 // 自适应半径
  }))

  let angleOffset = 0

  const animate = () => {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)

    trails.forEach(({ angle, radius }) => {
      const x = width / 2 + radius * Math.cos(angle + angleOffset)
      const y = height / 2 + radius * Math.sin(angle + angleOffset)

      // 绘制长条星轨
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 1 // 线条宽度
      ctx.beginPath()

      // 调整星轨的长度和间隔
      const trailLength = 100 // 星轨长度
      const prevX = width / 2 + radius * Math.cos(angle + angleOffset - trailLength / 500)
      const prevY = height / 2 + radius * Math.sin(angle + angleOffset - trailLength / 500)

      ctx.moveTo(prevX, prevY)
      ctx.lineTo(x, y)
      ctx.stroke()
    })

    angleOffset += 0.001 // 调整旋转速度
    animationFrameId = requestAnimationFrame(animate)
  }

  animate()
}

const resizeCanvas = () => {
  const ctx = canvas.value.getContext('2d')
  const width = canvas.value.width
  const height = canvas.value.height
  drawStarTrails(ctx, width, height)
}

onMounted(() => {
  // 注释掉 canvas 绘制，使用背景图片
  // resizeCanvas()
  // window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {
  // window.removeEventListener('resize', resizeCanvas)
  // if (animationFrameId) {
  //   cancelAnimationFrame(animationFrameId)
  // }
})
// const axios = inject("axios");
// import variable from "../../js/variable";
// import Comment from "./Comment.vue";
// import CommentList from "./CommentList.vue";
// const Beg = defineAsyncComponent(() => import("./Beg.vue"));
// import RunningTime from "./RunningTime.vue";

const variable = ref({
  begData: {
    records: []
  },
  musciList: [
    {
      name: '213131',
      url: 'https://music.163.com/song/media/outer/url?id=1416789512.mp3'
    }
  ]
})
const jinengState = ref(false) //技能状态
const visitData = ref({
  todayCount: 0,
  yesterdayCount: 0,
  thisMonthCount: 0,
  totalCount: 0,
  begData: null
}) //访问数据
const gameMusic = ref(true) //lol音乐播放ico状态
const lolDate = ref(null) //lol台词数据

// 原神图片数据（使用 public 目录，SSR 友好）
const genshinImages = ref([
  '/images/about/1.jpg',
  '/images/about/2.jpg',
  '/images/about/3.jpg',
  '/images/about/4.jpg',
  '/images/about/5.png'
])

//技能
function mouseoverJs() {
  jinengState.value = true
}
function mouseoutJs() {
  jinengState.value = false
}

// 查询数据
function findData() {
  axios
    .get('other/findVisit')
    .then((response) => {
      let res = response.data
      if (res.code == 200) {
        visitData.value = res.data
      }
    })
    .catch()
}

//-----------------------------lol------------------
function paly() {
  if (gameMusic.value) {
    variable.musciList.value.forEach((item) => {
      if (item.name == '孤勇者') {
        gameMusic.value = false
        variable.song.value = item
        setTimeout(() => {
          document.getElementById('videoMusicId').play() //播放
        }, 0)
        return
      }
    })
  } else {
    gameMusic.value = true
    document.getElementById('videoMusicId').pause() //暂停
  }
}

//查询台词
function findLol() {
  axios
    .post('lol/findLOL', { pageSize: 100 })
    .then((response) => {
      let res = response.data
      if (res.msg == '成功' && res.data) {
        lolDate.value = res.data.records
      }
    })
    .catch()
}

//-----------------------------lol------------------

//打劫按钮
const djan = () => {
  //弹出视频
  document.getElementById('DJDiv').style.display = 'block'
  document.getElementById('DJDiv').volume = 0.5
  document.getElementById('DJVideo').play()
  setTimeout(() => {
    document.getElementById('DJDiv').style.display = 'none'
  }, 7500)
}

onMounted(() => {
  // findLol();
  // findData();
})
</script>

<style scoped>
.loltaici {
  display: flex;
  border: 1px solid red;
}

.main {
  user-select: none;
  width: 100%;
  margin-top: 70px;
  background-color: #f7f9fe;
  display: flex;
  min-height: 800px;
}

.wzlxzt {
  width: 75%;
  margin: 30px auto 0;
  border-radius: 5px;
  box-shadow: 0 8px 16px -4px #2c2d300c;
  letter-spacing: 1px;
}

.yghz {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 40px 0;
}

.info {
  background: linear-gradient(to right, #3077ff, #549bff);
  width: 49%;
  color: #fff;
  padding: 20px;
  border-radius: 20px;
  letter-spacing: 1px;
  position: relative;
}

.woshou {
  width: 40px;
  height: 40px;
  vertical-align: -0.3em;
}

.addressIco {
  width: 50px;
  height: 50px;
}

.cheIco {
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: 30px;
  animation: moveAndRotate 15s linear infinite;
}

@keyframes moveAndRotate {
  0% {
    transform: translateX(0) scaleX(1);
  }

  49% {
    transform: translateX(500px) scaleX(1);
  }

  50% {
    transform: translateX(500px) scaleX(-1);
  }

  100% {
    transform: translateX(0) scaleX(-1);
  }
}

.addressTip {
  position: absolute;
  right: 100px;
  top: 100px;
}

.js {
  width: 49%;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.jsZz {
  width: 47%;
  height: 192px;
  position: absolute;
  right: 30px;
}

.scrolling-text {
  white-space: nowrap;
  position: absolute;
  bottom: 10px;
  animation: scrollText 20s linear infinite;
}

@keyframes scrollText {
  0% {
    left: 100%;
  }

  100% {
    left: -160%;
  }
}

.jineng {
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
}

.jinengItem {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  background-color: #f7f7f7;
  border: 1px solid rgb(224, 224, 224);
  border-radius: 20px;
  height: 35px;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
}

.sj {
  border-radius: 20px;
  width: 40%;
  height: 300px;
  color: #fff;
  position: relative;
  background-image: url('~/assets/common/code.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.sj::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
  z-index: 0;
}

.sj::after {
  box-shadow: 0 -159px 173px 71px rgba(15, 17, 20, 0.6) inset;
  position: absolute;
  content: '';
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 20px;
  z-index: 0;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.sjDIv {
  position: absolute;
  color: #fff;
  top: 38px;
  left: 50px;
  z-index: 1;
}

.sjDIv h1 {
  font-size: 40px;
}

.sjDIv p {
  font-size: 10px;
  color: #c4c4c4;
}

.dateDiv {
  width: 400px;
  display: flex;
  flex-wrap: wrap;
}

.dateDiv > div {
  width: 50%;
}

h1 {
  padding: 0 0 10px;
}

p {
  font-size: 16px;
}

.zs {
  display: flex;
  flex-wrap: wrap;
}

.zs > li {
  width: 50%;
  font-size: 15px;
  padding-bottom: 10px;
}

/* 性格卡片样式 */
.personality-card {
  width: 55%;
  height: 300px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  padding: 30px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.personality-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.personality-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.personality-text {
  flex: 1;
}

.personality-label {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
  font-weight: 500;
}

.personality-type {
  font-size: 40px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.personality-code {
  font-size: 30px;
  font-weight: 300;
  color: #9b59b6;
  margin: 0 0 15px 0;
  letter-spacing: 2px;
}

.personality-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  margin: 0 0 15px 0;
  max-width: 400px;
}

.personality-link {
  display: inline-block;
  font-size: 14px;
  color: #3498db;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.personality-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #3498db;
  transition: width 0.3s ease;
}

.personality-link:hover {
  color: #2980b9;
}

.personality-link:hover::after {
  width: 100%;
}

.personality-image {
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.personality-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

/* 原神游戏展示样式 */
.genshin-game {
  width: 100%;
  height: 400px;
  border-radius: 20px;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.genshin-header {
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 10;
}

.game-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 10px 0;
  letter-spacing: 2px;
}

.game-title {
  font-size: 64px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  letter-spacing: 4px;
}

.game-uid-container {
  position: absolute;
  bottom: 40px;
  right: 40px;
  z-index: 10;
}

.game-uid {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  letter-spacing: 1px;
}

/* 手风琴容器 */
.accordion-container {
  display: flex;
  height: 100%;
  width: calc(100% + 40px);
  gap: 0;
  position: absolute;
  top: 0;
  left: -20px;
  z-index: 1;
  perspective: 1500px;
  padding: 0;
}

.accordion-item {
  flex: 1;
  background-size: cover;
  background-position: center;
  border-radius: 0;
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  filter: grayscale(0.6) brightness(0.6);
  transform: skewX(-3deg);
  margin: 0 -2px;
}

.accordion-item:first-child {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  margin-left: 0;
}

.accordion-item:last-child {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  margin-right: 0;
}

.accordion-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%); */
  transition: all 0.5s ease;
  z-index: 1;
}

.accordion-item:hover {
  flex: 3.5;
  filter: grayscale(0) brightness(1.1);
  transform: skewX(-3deg) scale(1.05);
  z-index: 5;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.accordion-item:hover::before {
  opacity: 0;
}

/* 加载条动画 */
.loading-bar-container {
  position: absolute;
  bottom: 40px;
  left: 40px;
  width: 300px;
  height: 30px;
  overflow: hidden;
  z-index: 10;
}

.loading-bar {
  width: 300px;
  height: 30px;
  object-fit: contain;
  clip-path: inset(0 100% 0 0);
  animation: loading-reveal 3s ease-in-out infinite;
}

@keyframes loading-reveal {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}

.dashang {
  background-color: #fff;
  border-radius: 20px;
  width: 100%;
  margin: 20px 0 10px 0;
}

.game {
  border-radius: 20px;
  width: 55%;
  background-image: url(/other/lol2.png);
  background-size: cover;
  background-repeat: no-repeat;
  padding: 20px;
  color: #fff;
  position: relative;
}

.gamevideo {
  border-radius: 20px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  /* 调整视频大小以填充容器 */
  object-fit: cover;
}

.lolimg {
  border-radius: 20px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.fontLol {
  position: absolute;
  top: 200px;
  left: 170px;
  width: 100%;
}

.game > h1 {
  letter-spacing: 5px;
}

.gameIco {
  position: absolute;
  bottom: 30px;
  right: 30px;
  cursor: pointer;
}

.icon {
  animation: rotate 1s infinite;
}

@keyframes rotate {
  0% {
    transform: translateX(-5px) rotate(0deg);
  }

  50% {
    transform: translateX(5px) rotate(5deg);
  }

  100% {
    transform: translateX(-5px) rotate(0deg);
  }
}

.ico {
  animation: jump 0.5s infinite;
}

@keyframes jump {
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-1px) rotate(-3deg);
  }

  50% {
    transform: translateX(1px) rotate(3deg);
  }

  75% {
    transform: translateX(-1px) rotate(-3deg);
  }
}

/* 赞赏 */

.zsLi {
  height: 50px;
}

.zsLi > div {
  width: 100%;
  height: 50%;
}

.moneyClass {
  background-color: #e5a80d;
  color: #fff;
  border-radius: 5px;
  padding: 0 3px;
  font-size: 10px;
  line-height: 20px;
  height: 20px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

/* -----------评论START-------------- */
.comment > h2 {
  padding: 70px 0 20px;
}

#yjplk {
  position: relative;
}

/* -----------评论END-------------- */

@media (max-width: 1400px) {
  #dajie {
    display: none !important;
  }

  #yxTime {
    width: 100%;
  }
}

@media (max-width: 1000px) {
  .wzlxzt {
    width: 90%;
  }

  .yghz {
    flex-direction: column;
  }

  .info {
    width: 100%;
  }

  .js {
    width: 100%;
    margin-top: 20px;
  }

  .jsZz {
    display: none;
  }

  .scrolling-text {
    bottom: 0;
  }

  .addressTip {
    display: none;
  }

  .sj {
    width: 100%;
  }

  .sjDIv {
    top: 20px;
    left: 10px;
  }

  .game {
    display: none;
  }
}

/* —-----------游戏音乐播放按钮--------------------- */
.toggle-cont {
  width: 100px;
  height: 50px;
  border-radius: 9999px;
}

.toggle-cont .toggle-input {
  display: none;
}

.toggle-cont .toggle-label {
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 6px;
  width: 100%;
  height: 100%;
  background: #272727;
  border: 1px solid rgb(134, 134, 134);
  border-radius: 9999px;
  box-sizing: content-box;
  box-shadow: 0px 0px 16px -8px #fefefe;
}

.toggle-cont .toggle-label .cont-label-play {
  position: relative;
  width: 50px;
  aspect-ratio: 1 / 1;
  background: #5e5e5e;
  border-radius: 9999px;
  transition: all 0.5s cubic-bezier(1, 0, 0, 1);
}

.toggle-cont .toggle-input:checked + .toggle-label .cont-label-play {
  background: #f43f5e;
  transform: translateX(50px);
}

.toggle-cont .toggle-label .label-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  width: 24px;
  aspect-ratio: 1 / 1;
  background: #fefefe;
  border-radius: 4px;
  clip-path: polygon(25% 0, 75% 50%, 25% 100%, 25% 51%);
  transition: all 0.5s cubic-bezier(1, 0, 0, 1);
}

.toggle-cont .toggle-input:checked + .toggle-label .label-play {
  width: 20px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

/* —-----------游戏音乐播放按钮end--------------------- */

/* -------------------打劫------------------ */
#dajie {
  padding-right: 20px;
  height: 150px;
  border-radius: 10px;
  background-color: rgb(113, 120, 223);
  display: flex;
  align-items: center;
}

#djan {
  height: 50px;
  font-family: inherit;
  font-size: 20px;
  background: rgb(113, 120, 223);
  color: white;
  padding: 0.7em 1em;
  padding-left: 0.9em;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

#djan span {
  display: block;
  margin-left: 0.3em;
  transition: all 0.3s ease-in-out;
}

#djan svg {
  display: block;
  transform-origin: center center;
  transition: transform 0.3s ease-in-out;
}

#djan:hover .svg-wrapper {
  animation: fly-1 0.6s ease-in-out infinite alternate;
}

#djan:hover svg {
  transform: translateX(1.2em) rotate(45deg) scale(1.1);
}

#djan:hover span {
  transform: translateX(5em);
}

#djan:active {
  transform: scale(0.95);
}

@keyframes fly-1 {
  from {
    transform: translateY(0.1em);
  }

  to {
    transform: translateY(-0.1em);
  }
}

#DJDiv {
  z-index: 999999;
  display: none;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
}

#DJVideo {
  width: 30vw;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* -------------------打劫end------------------ */
</style>

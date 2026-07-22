<template>
  <div class="ms-page">
    <!-- 背景层：网格渐变 / 光球 / 星点 / 极光 / 暗角 / 颗粒 -->
    <div class="ms-mesh" />
    <div class="ms-orb ms-orb-1" />
    <div class="ms-orb ms-orb-2" />
    <div class="ms-orb ms-orb-3" />
    <div ref="starsEl" class="ms-stars" :style="{ boxShadow: starsShadow }" />
    <div ref="starsNearEl" class="ms-stars ms-stars-near" :style="{ boxShadow: starsNearShadow }" />
    <div ref="auroraEl" class="ms-aurora" />
    <div class="ms-vignette" />
    <div class="ms-grain" />

    <header class="ms-header" :class="{ 'is-dimmed': hintHidden }">
      <div class="ms-kicker">LIFE MILESTONES</div>
      <h1 class="ms-title">人生里程碑</h1>
      <p class="ms-subtitle">沿着时间的轨迹，回看每一个闪光瞬间</p>
      <div class="ms-rule" />
    </header>

    <div v-if="!events.length" class="ms-empty">请在后台添加里程碑事件</div>

    <div v-else ref="scrollEl" class="ms-scroll">
      <div class="ms-track" :style="{ width: `${totalW}px` }">
        <svg class="ms-wave" :width="totalW" :height="viewportH" :style="{ width: `${totalW}px`, height: '100%' }">
          <defs>
            <linearGradient id="msWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="rgba(232,160,48,.06)" />
              <stop offset="15%" stop-color="rgba(232,160,48,.5)" />
              <stop offset="50%" stop-color="rgba(240,180,60,.7)" />
              <stop offset="85%" stop-color="rgba(232,160,48,.5)" />
              <stop offset="100%" stop-color="rgba(232,160,48,.06)" />
            </linearGradient>
            <filter id="msGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="g" />
              <feMerge>
                <feMergeNode in="g" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path :d="wavePath" class="ms-wave-glow" />
          <path :d="wavePath" class="ms-wave-main" />
          <path :d="waveEchoPath" class="ms-wave-echo" />
          <path :d="wavePath" class="ms-wave-comet" />
        </svg>

        <template v-for="item in layoutItems" :key="item.event.id">
          <!-- 背景年份水印 -->
          <div
            class="ms-year"
            :style="{ left: `${item.x}px`, top: `${item.isAbove ? item.waveY + 70 : item.waveY - 70}px` }"
          >
            {{ yearOf(item.event.eventDate) }}
          </div>

          <div class="ms-dot" :style="{ left: `${item.x}px`, top: `${item.waveY}px`, animationDelay: `${item.delay}s` }">
            <div class="ms-dot-no">{{ String(item.index + 1).padStart(2, '0') }}</div>
            <div class="ms-dot-orbit" />
            <div class="ms-dot-core" />
            <div class="ms-dot-ring" />
            <div class="ms-dot-ring-outer" />
          </div>

          <div
            class="ms-conn"
            :class="item.isAbove ? 'from-above' : 'from-below'"
            :style="{
              left: `${item.x}px`,
              top: `${item.connTop}px`,
              height: `${item.connHeight}px`,
              animationDelay: `${item.delay + 0.1}s`
            }"
          />

          <div
            class="ms-card"
            :class="item.isAbove ? 'slide-down' : 'slide-up'"
            :style="{
              left: `${item.x - CARD_W / 2}px`,
              top: `${item.cardTop}px`,
              animationDelay: `${item.delay + 0.2}s`
            }"
          >
            <div class="ms-card-img-wrap">
              <button
                v-if="item.event.image"
                type="button"
                class="ms-card-img-btn"
                :aria-label="`预览${item.event.title}`"
                @click="openPreview(item.event)"
              >
                <img class="ms-card-img" :src="item.event.image" :alt="item.event.title" loading="lazy" />
                <span class="ms-card-img-hint">点击预览</span>
              </button>
              <div v-else class="ms-card-img ms-card-img-empty" />
            </div>

            <div class="ms-card-body">
              <div class="ms-card-date">{{ formatDate(item.event.eventDate) }}</div>
              <div class="ms-card-title">{{ item.event.title }}</div>
              <div v-if="item.event.description" class="ms-card-desc">{{ item.event.description }}</div>
              <div v-if="item.event.tags?.length" class="ms-card-tags">
                <span v-for="tag in item.event.tags" :key="tag" class="ms-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!--
      整页接管会把站点导航全部盖住，只剩浏览器后退可用，故补一个返回入口。
      做成与本页视觉一致的低调样式，不破坏沉浸感。
    -->
    <NuxtLink to="/" class="ms-back" aria-label="返回首页">← 返回</NuxtLink>

    <div class="ms-hint" :class="{ 'is-hidden': hintHidden }">
      <span class="ms-arr">←</span>
      <span>拖拽探索</span>
      <span class="ms-arr">→</span>
    </div>

    <PhotographyLightbox :show="lightbox.show" :image="lightbox.image" @close="lightbox.show = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { getMilestoneList, type MilestoneItem } from '~/api/milestone'

useHead({ title: '里程碑' })

/** 布局常量：改动会直接影响曲线与卡片的对齐 */
const SIDE_PAD = 400
const CARD_SP = 560
const CARD_W = 300
const WAVE_AMP = 60
const CONN_GAP = 45
const WAVE_PERIOD = 1120
const CARD_H_ESTIMATE = 260

const WK = (2 * Math.PI) / WAVE_PERIOD
/** 让曲线在第一张卡片处正好过波峰 */
const WPHI = Math.PI / 2 - WK * SIDE_PAD

const { data: raw } = await useAsyncData('milestone-list', () => getMilestoneList())

const ts = (date: string) => new Date(date).getTime() || 0

const events = computed<MilestoneItem[]>(() => {
  const res = raw.value as any
  const list: MilestoneItem[] = res?.code === 200 ? res.data?.records || [] : []
  return [...list].sort((a, b) => ts(a.eventDate) - ts(b.eventDate) || a.id - b.id)
})

const yearOf = (date: string) => String(new Date(date).getFullYear())
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')

const scrollEl = ref<HTMLElement | null>(null)
const starsEl = ref<HTMLElement | null>(null)
const starsNearEl = ref<HTMLElement | null>(null)
const auroraEl = ref<HTMLElement | null>(null)

/** SSR 拿不到真实视口高度，先用 800 占位，挂载后再校正 */
const viewportH = ref(800)
const hintHidden = ref(false)
const starsShadow = ref('')
const starsNearShadow = ref('')

const centerY = computed(() => Math.max(viewportH.value, 600) / 2)
const totalW = computed(() => (events.value.length ? SIDE_PAD * 2 + CARD_SP * (events.value.length - 1) : 1200))

const buildWavePath = (width: number, cy: number, offsetY = 0) => {
  const pts = 300
  let d = ''
  for (let i = 0; i <= pts; i++) {
    const x = (width / pts) * i
    const y = cy + WAVE_AMP * Math.sin(WK * x + WPHI) + offsetY
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }
  return d
}

const wavePath = computed(() => buildWavePath(totalW.value, centerY.value))
const waveEchoPath = computed(() => buildWavePath(totalW.value, centerY.value, 3))

const layoutItems = computed(() =>
  events.value.map((event, index) => {
    const x = SIDE_PAD + CARD_SP * index
    const waveY = centerY.value + WAVE_AMP * Math.sin(WK * x + WPHI)
    // 奇偶交替，卡片一上一下地挂在曲线两侧
    const isAbove = index % 2 === 0
    const cardTop = isAbove ? waveY - CONN_GAP - CARD_H_ESTIMATE : waveY + CONN_GAP
    return {
      event,
      index,
      x,
      waveY,
      isAbove,
      delay: 1.5 + index * 0.35,
      cardTop,
      connTop: isAbove ? cardTop + CARD_H_ESTIMATE : waveY,
      connHeight: CONN_GAP
    }
  })
)

/**
 * 星点用 box-shadow 批量绘制。必须在挂载后生成：
 * 含 Math.random()，服务端与客户端结果不同会直接触发 hydration mismatch。
 */
const buildStarsShadow = (count = 100, opacity = 0.25) => {
  const w = window.innerWidth
  const h = window.innerHeight
  const shadows: string[] = []
  for (let i = 0; i < count; i++) {
    const ox = Math.round(Math.random() * w)
    const oy = Math.round(Math.random() * h)
    const op = (Math.random() * opacity + 0.05).toFixed(2)
    shadows.push(`${ox}px ${oy}px 1px rgba(255,255,255,${op})`)
  }
  return shadows.join(',')
}

const lightbox = reactive<{ show: boolean; image: { url: string; title: string } | null }>({
  show: false,
  image: null
})

const openPreview = (event: MilestoneItem) => {
  if (!event.image) return
  lightbox.image = { url: event.image, title: event.title }
  lightbox.show = true
}

const drag = { isDown: false, startX: 0, scrollLeft: 0 }

const onScroll = () => {
  const sc = scrollEl.value
  if (!sc) return
  const sl = sc.scrollLeft
  // 三层不同速率的视差，越近的层移动越快
  if (starsEl.value) starsEl.value.style.transform = `translateX(${-sl * 0.05}px)`
  if (starsNearEl.value) starsNearEl.value.style.transform = `translateX(${-sl * 0.16}px)`
  if (auroraEl.value) auroraEl.value.style.transform = `translate3d(${-sl * 0.08}px,0,0) rotate(-8deg)`
  if (!hintHidden.value && sl > 60) hintHidden.value = true
}

const onMouseDown = (e: MouseEvent) => {
  const sc = scrollEl.value
  if (!sc) return
  drag.isDown = true
  drag.startX = e.pageX
  drag.scrollLeft = sc.scrollLeft
  sc.classList.add('is-dragging')
}
const onMouseUp = () => {
  drag.isDown = false
  scrollEl.value?.classList.remove('is-dragging')
}
const onMouseMove = (e: MouseEvent) => {
  if (!drag.isDown || !scrollEl.value) return
  e.preventDefault()
  scrollEl.value.scrollLeft = drag.scrollLeft - (e.pageX - drag.startX) * 1.5
}
/** 纵向滚轮转成横向推进，否则整页不可滚时用户会以为卡死 */
const onWheel = (e: WheelEvent) => {
  if (!scrollEl.value) return
  e.preventDefault()
  scrollEl.value.scrollLeft += (e.deltaY || e.deltaX) * 1.5
}
const onKeyDown = (e: KeyboardEvent) => {
  if (lightbox.show || !scrollEl.value) return
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    scrollEl.value.scrollLeft += 300
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    scrollEl.value.scrollLeft -= 300
  }
}

const onResize = () => {
  viewportH.value = Math.max(window.innerHeight, 600)
}

onMounted(() => {
  starsShadow.value = buildStarsShadow()
  starsNearShadow.value = buildStarsShadow(45, 0.45)
  onResize()
  window.addEventListener('resize', onResize)

  // 本页是整屏接管，纵向滚动交给横向轨道
  document.body.style.overflow = 'hidden'

  const sc = scrollEl.value
  if (sc) {
    sc.addEventListener('mousedown', onMouseDown)
    sc.addEventListener('wheel', onWheel, { passive: false })
    sc.addEventListener('scroll', onScroll)
  }
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  // 直接清空而不是「还原进入前的值」：若进入时 body 恰好已是 hidden
  // （搜索弹窗开着、或 HMR/过渡导致的重复挂载），还原旧值会把整站滚动永久锁死。
  // 站点基线本就没有内联 overflow，清空是幂等且正确的。
  document.body.style.overflow = ''

  const sc = scrollEl.value
  if (sc) {
    sc.removeEventListener('mousedown', onMouseDown)
    sc.removeEventListener('wheel', onWheel)
    sc.removeEventListener('scroll', onScroll)
  }
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
/*
  不引入 Google Fonts（Playfair Display / DM Mono / Noto Serif SC）：
  国内访问 fonts.googleapis.com 会挂起，拖慢甚至阻塞首屏，故改为系统字体栈兜底。
*/
.ms-page {
  --ms-serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', STSong, SimSun, serif;
  --ms-mono: ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;

  position: fixed;
  inset: 0;
  /* 必须高于站点页头（z-1999）：本页是整屏接管，浅色页头压在深空背景上会很脏 */
  z-index: 2000;
  overflow: hidden;
  background: #06060f;
  font-family: var(--ms-serif);
  color: #e8e4dc;
}

.ms-page ::selection {
  background: rgba(232, 160, 48, 0.3);
  color: #fff;
}

/* ---------- 背景层 ---------- */
.ms-mesh {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 600px 500px at 10% 25%, rgba(88, 40, 160, 0.3) 0%, transparent 70%),
    radial-gradient(ellipse 500px 600px at 90% 75%, rgba(20, 60, 140, 0.2) 0%, transparent 70%),
    radial-gradient(ellipse 400px 400px at 55% 45%, rgba(160, 90, 30, 0.08) 0%, transparent 70%),
    linear-gradient(180deg, #06060f 0%, #0a0a1a 50%, #06060f 100%);
}

.ms-orb {
  position: fixed;
  z-index: 1;
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(80px);
  pointer-events: none;
}

.ms-orb-1 {
  left: -100px;
  top: -80px;
  width: 350px;
  height: 350px;
  background: rgba(100, 50, 200, 0.5);
  animation: ms-drift1 30s infinite ease-in-out;
}

.ms-orb-2 {
  right: -40px;
  bottom: -60px;
  width: 280px;
  height: 280px;
  background: rgba(30, 70, 180, 0.4);
  animation: ms-drift2 25s infinite ease-in-out;
}

.ms-orb-3 {
  left: 55%;
  top: 35%;
  width: 200px;
  height: 200px;
  background: rgba(200, 120, 40, 0.25);
  animation: ms-drift3 35s infinite ease-in-out;
}

.ms-stars {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 1px;
  height: 1px;
  pointer-events: none;
  will-change: transform;
  animation: ms-twinkle 5s infinite alternate ease-in-out;
}

.ms-stars-near {
  z-index: 4;
  opacity: 0.7;
  filter: drop-shadow(0 0 6px rgba(232, 160, 48, 0.45));
  animation-duration: 3.5s;
}

.ms-aurora {
  position: fixed;
  left: -12vw;
  top: 18%;
  z-index: 2;
  width: 135vw;
  height: 42vh;
  transform: rotate(-8deg);
  opacity: 0.3;
  filter: blur(48px);
  pointer-events: none;
  will-change: transform;
  background:
    linear-gradient(105deg, transparent 6%, rgba(232, 160, 48, 0.12) 28%, transparent 48%),
    linear-gradient(78deg, transparent 18%, rgba(92, 118, 255, 0.14) 45%, transparent 70%);
  animation: ms-aurora-flow 12s infinite ease-in-out;
}

.ms-vignette {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0, 0, 0, 0.45) 100%);
}

.ms-grain {
  position: fixed;
  inset: 0;
  z-index: 3;
  opacity: 0.03;
  pointer-events: none;
  background-size: 200px;
  background-repeat: repeat;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ---------- 页头 ---------- */
.ms-header {
  position: fixed;
  left: 42px;
  top: 34px;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.5s ease-out, opacity 0.5s ease-out;
  animation: ms-fade-in 1s ease forwards 0.3s;
}

.ms-header.is-dimmed {
  transform: translateY(-10px) scale(0.92);
  opacity: 0.4;
}

.ms-kicker {
  margin-bottom: 8px;
  font-family: var(--ms-mono);
  font-size: 11px;
  letter-spacing: 0.32em;
  color: rgba(232, 160, 48, 0.58);
}

.ms-title {
  margin: 0;
  font-size: clamp(34px, 5vw, 68px);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #f6efe3;
  text-shadow: 0 0 28px rgba(232, 160, 48, 0.22);
}

.ms-subtitle {
  margin: 10px 0 0;
  max-width: 340px;
  font-size: 13px;
  line-height: 1.8;
  letter-spacing: 0.08em;
  color: rgba(232, 224, 210, 0.46);
}

.ms-rule {
  margin-top: 10px;
  width: 36px;
  height: 1px;
  background: linear-gradient(to right, rgba(232, 160, 48, 0.4), transparent);
}

.ms-empty {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ms-mono);
  font-size: 13px;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.35);
}

/* ---------- 横向轨道 ---------- */
.ms-scroll {
  position: relative;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
  cursor: grab;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.ms-scroll::-webkit-scrollbar {
  display: none;
}

.ms-scroll.is-dragging {
  cursor: grabbing;
}

.ms-track {
  position: relative;
  height: 100vh;
  min-height: 600px;
}

.ms-wave {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible;
  pointer-events: none;
}

.ms-wave-glow {
  fill: none;
  stroke: rgba(232, 160, 48, 0.04);
  stroke-width: 50;
  stroke-linecap: round;
}

.ms-wave-main {
  fill: none;
  stroke: url(#msWaveGrad);
  stroke-width: 2;
  stroke-linecap: round;
  filter: url(#msGlow);
  stroke-dasharray: 6000;
  stroke-dashoffset: 6000;
  animation: ms-draw-wave 3s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.5s;
}

.ms-wave-echo {
  fill: none;
  stroke: rgba(232, 160, 48, 0.06);
  stroke-width: 1;
  stroke-linecap: round;
  stroke-dasharray: 6000;
  stroke-dashoffset: 6000;
  animation: ms-draw-wave 3s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.7s;
}

/* 沿曲线跑动的流星：短实线 + 超长间隔，靠 dashoffset 位移 */
.ms-wave-comet {
  fill: none;
  stroke: rgba(255, 236, 170, 0.88);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 90 6200;
  filter: url(#msGlow);
  opacity: 0;
  animation:
    ms-draw-wave 3s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.9s,
    ms-comet-run 7s linear infinite 3.2s;
}

/* ---------- 节点 ---------- */
.ms-year {
  position: absolute;
  z-index: 5;
  transform: translate(-50%, -50%);
  font-size: 64px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.025);
  user-select: none;
  pointer-events: none;
}

.ms-dot {
  position: absolute;
  z-index: 20;
  opacity: 0;
  transform: translate(-50%, -50%);
  animation: ms-dot-pop 0.5s ease forwards;
}

.ms-dot-no {
  position: absolute;
  left: 18px;
  top: -28px;
  font-family: var(--ms-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: rgba(255, 236, 170, 0.5);
  text-shadow: 0 0 20px rgba(232, 160, 48, 0.55);
}

.ms-dot-core {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0c060, #d89828);
  box-shadow: 0 0 15px rgba(232, 160, 48, 0.5), 0 0 30px rgba(232, 160, 48, 0.15);
}

.ms-dot-orbit {
  position: absolute;
  inset: -22px;
  border-radius: 50%;
  border: 1px solid rgba(232, 160, 48, 0.18);
  border-bottom-color: transparent;
  border-left-color: rgba(255, 236, 170, 0.75);
  animation: ms-orbit-spin 6s linear infinite;
}

.ms-dot-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 1.5px solid rgba(232, 160, 48, 0.2);
  animation: ms-ring-pulse 3s infinite ease-out;
}

.ms-dot-ring-outer {
  position: absolute;
  inset: -16px;
  border-radius: 50%;
  border: 1px solid rgba(232, 160, 48, 0.08);
  animation: ms-ring-pulse 3s infinite ease-out 1.2s;
}

.ms-conn {
  position: absolute;
  z-index: 15;
  width: 1px;
  opacity: 0;
  transform-origin: top;
  animation: ms-conn-in 0.6s ease forwards;
}

.ms-conn.from-above {
  background: linear-gradient(to top, rgba(232, 160, 48, 0.4), rgba(232, 160, 48, 0.02));
}

.ms-conn.from-below {
  background: linear-gradient(to bottom, rgba(232, 160, 48, 0.4), rgba(232, 160, 48, 0.02));
}

/* ---------- 玻璃卡片 ---------- */
.ms-card {
  position: absolute;
  z-index: 25;
  width: 300px;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.026));
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px) saturate(1.25);
  opacity: 0;
  will-change: transform;
  transition: transform 0.7s ease-out, box-shadow 0.7s ease-out;
}

.ms-card.slide-down {
  animation: ms-slide-down 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.ms-card.slide-up {
  animation: ms-slide-up 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.ms-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  z-index: 50;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.15), transparent);
}

/* 掠过卡片的高光，hover 时从左扫到右 */
.ms-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 45;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 24%, rgba(255, 255, 255, 0.16) 45%, transparent 58%);
  transform: translateX(-130%);
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.ms-card:hover {
  transform: translateY(-7px) scale(1.018);
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.45),
    0 0 48px rgba(232, 160, 48, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.ms-card:hover::after {
  transform: translateX(130%);
}

.ms-card-img-wrap {
  position: relative;
  margin-bottom: -1px;
  overflow: hidden;
}

.ms-card-img-wrap::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50%;
  pointer-events: none;
  background: linear-gradient(to top, rgba(6, 6, 15, 0.7), transparent);
}

.ms-card-img-btn {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  overflow: hidden;
}

.ms-card-img {
  display: block;
  width: 100%;
  height: 140px;
  object-fit: cover;
  transition: transform 0.85s ease-out;
  will-change: transform;
}

.ms-card-img-empty {
  background: linear-gradient(135deg, rgba(50, 30, 80, 0.4), rgba(30, 40, 70, 0.4));
}

.ms-card-img-btn:hover .ms-card-img {
  transform: scale(1.04);
}

.ms-card-img-hint {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: grid;
  place-items: center;
  background: rgba(6, 6, 15, 0.36);
  font-size: 12px;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.85);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.ms-card-img-btn:hover .ms-card-img-hint {
  opacity: 1;
  transform: translateY(0);
}

.ms-card-body {
  position: relative;
  z-index: 2;
  padding: 15px 16px 12px;
  background: rgba(14, 12, 28, 0.72);
}

.ms-card-date {
  margin-bottom: 4px;
  font-family: var(--ms-mono);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  color: rgba(232, 160, 48, 0.65);
}

.ms-card-title {
  margin-bottom: 6px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  color: #f0ece4;
}

.ms-card-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
  font-size: 12px;
  line-height: 1.75;
  color: rgba(228, 224, 216, 0.5);
}

.ms-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.ms-tag {
  padding: 2px 7px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  font-family: var(--ms-mono);
  font-size: 9.5px;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
}

.ms-back {
  position: fixed;
  right: 34px;
  top: 34px;
  z-index: 100;
  padding: 7px 15px;
  border-radius: 20px;
  border: 1px solid rgba(232, 160, 48, 0.22);
  background: rgba(255, 255, 255, 0.04);
  font-family: var(--ms-mono);
  font-size: 11px;
  letter-spacing: 0.15em;
  color: rgba(232, 224, 210, 0.6);
  text-decoration: none;
  backdrop-filter: blur(6px);
  transition: color 0.3s, border-color 0.3s, background 0.3s;
}

.ms-back:hover {
  border-color: rgba(232, 160, 48, 0.55);
  background: rgba(232, 160, 48, 0.1);
  color: #f6efe3;
}

/* ---------- 拖拽提示 ---------- */
.ms-hint {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  transform: translateX(-50%);
  font-family: var(--ms-mono);
  font-size: 10.5px;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.2);
  pointer-events: none;
  transition: opacity 1s;
}

.ms-hint.is-hidden {
  opacity: 0;
}

.ms-arr {
  animation: ms-hint-slide 2s infinite ease-in-out;
}

/* ---------- 动画 ---------- */
@keyframes ms-drift1 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(80px, 50px) scale(1.1);
  }
  66% {
    transform: translate(-40px, 80px) scale(0.9);
  }
}

@keyframes ms-drift2 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-60px, -30px) scale(1.1);
  }
  66% {
    transform: translate(50px, -60px) scale(0.95);
  }
}

@keyframes ms-drift3 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-100px, 50px) scale(1.15);
  }
}

@keyframes ms-twinkle {
  0% {
    opacity: 0.35;
  }
  100% {
    opacity: 1;
  }
}

@keyframes ms-aurora-flow {
  0%,
  100% {
    opacity: 0.18;
    filter: blur(28px);
  }
  50% {
    opacity: 0.34;
    filter: blur(20px);
  }
}

@keyframes ms-draw-wave {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes ms-comet-run {
  0% {
    opacity: 0;
    stroke-dashoffset: 0;
  }
  8%,
  72% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    stroke-dashoffset: -6200;
  }
}

@keyframes ms-dot-pop {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes ms-ring-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2.8);
    opacity: 0;
  }
}

@keyframes ms-orbit-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ms-conn-in {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes ms-slide-down {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ms-slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ms-hint-slide {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

@keyframes ms-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-height: 780px) {
  .ms-card-img {
    height: 115px;
  }
}

/* 尊重系统的减少动效设置：关掉持续循环的装饰动画 */
@media (prefers-reduced-motion: reduce) {
  .ms-orb,
  .ms-stars,
  .ms-aurora,
  .ms-dot-orbit,
  .ms-dot-ring,
  .ms-dot-ring-outer,
  .ms-wave-comet,
  .ms-arr {
    animation: none;
  }
}
</style>

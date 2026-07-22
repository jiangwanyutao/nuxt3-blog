<template>
  <div class="fp-page">
    <!--
      容器必须始终保持尺寸：若用 v-show 隐藏，高德初始化时拿到 0×0 会抛 Pixel(NaN, NaN)。
      整屏铺开是刻意的 —— 页头是 fixed + 半透明，地图会透到它下面。
    -->
    <div ref="mapEl" class="fp-map" />

    <!-- 地图不可用时才盖上来，正常情况下不遮挡任何交互 -->
    <div v-if="overlayText" class="fp-overlay">
      <p class="fp-overlay-text">{{ overlayText }}</p>
    </div>

    <Teleport to="body">
      <Transition name="fp-fade">
        <div v-if="detail" class="fp-modal-mask" @click.self="closeDetail">
          <div class="fp-modal">
            <header class="fp-modal-head">
              <h2 class="fp-modal-title">{{ detail.title }}</h2>
              <button class="fp-modal-close" aria-label="关闭" @click="closeDetail">×</button>
            </header>

            <p v-if="detail.content" class="fp-modal-content">{{ detail.content }}</p>

            <div class="fp-modal-meta">
              <p>时间：{{ formatDate(detail.eventDate) }}</p>
              <p>地址：{{ detail.address }}</p>
            </div>

            <div v-if="galleryOf(detail).length" class="fp-gallery">
              <button
                v-for="(img, i) in galleryOf(detail)"
                :key="i"
                type="button"
                class="fp-gallery-item"
                @click="openLightbox(img, detail.title)"
              >
                <img :src="img" :alt="detail.title" loading="lazy" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <PhotographyLightbox :show="lightbox.show" :image="lightbox.image" @close="lightbox.show = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { getFootprintList, getGaodeConfig, type FootprintItem } from '~/api/footprint'

useHead({ title: '足迹' })

/**
 * 深色地图样式「极夜蓝」。深底 + 亮色地名让照片标记跳出来，
 * 浅色底图会把标记的白色光晕吃掉。
 * 换样式时记得同步下面 .fp-map 的底色，否则瓦片加载前会闪一下白。
 */
const MAP_STYLE = 'amap://styles/darkblue'

/** 初始视野：大致居中于中国 */
const MAP_CENTER: [number, number] = [105.625368, 37.746599]
const MAP_ZOOM = 4.8
/** 点选标记后拉近到街区级别 */
const FOCUS_ZOOM = 15

const { data: raw } = await useAsyncData('footprint-list', () => getFootprintList())

const items = computed<FootprintItem[]>(() => {
  const res = raw.value as any
  return res?.code === 200 ? res.data?.records || [] : []
})

const mapEl = ref<HTMLElement | null>(null)
const mapReady = ref(false)
const mapError = ref('')
const detail = ref<FootprintItem | null>(null)

let mapInstance: any = null
let infoWindow: any = null

const galleryOf = (item: FootprintItem) => item.images || []
const firstImage = (item: FootprintItem) => galleryOf(item)[0] || ''

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })

/** 地图不可用时的兜底文案；地图正常则为空，不渲染遮罩 */
const overlayText = computed(() => {
  if (mapError.value) return mapError.value
  if (!items.value.length) return '还没有记录任何足迹'
  return mapReady.value ? '' : '地图加载中…'
})

/** "lng,lat" -> [lng, lat]，格式不对返回 null 由调用方跳过 */
const parsePosition = (position: string): [number, number] | null => {
  const parts = (position || '').split(',').map((n) => Number(n.trim()))
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) return null
  return [parts[0], parts[1]]
}

/**
 * 标记内容与浮层卡片都要拼 HTML 塞进高德的 DOM，Vue 的自动转义在这里不生效，
 * 所以标题/地址等字段必须手动转义。
 */
const ESCAPE_MAP: Record<string, string> = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": '#39' }
const escapeHtml = (str: string) => String(str ?? '').replace(/[&<>"']/g, (c) => `&${ESCAPE_MAP[c]};`)

/** 圆形头像标记 + 呼吸光晕（无图时返回空串，退回高德默认水滴图标） */
const markerHtml = (item: FootprintItem) => {
  const img = firstImage(item)
  if (!img) return ''
  return `<div class="fp-marker"><img src="${escapeHtml(img)}" alt="" /></div>`
}

const infoHtml = (item: FootprintItem) => {
  const img = firstImage(item)
  return `
    <div class="fp-info">
      <div class="fp-info-cover">
        ${img ? `<img src="${escapeHtml(img)}" alt="" />` : ''}
        <div class="fp-info-mask">
          <h3>${escapeHtml(item.title)}</h3>
          <p>🕘 ${escapeHtml(formatDate(item.eventDate))}</p>
          <p>📍 ${escapeHtml(item.address)}</p>
        </div>
      </div>
      <button type="button" class="fp-info-more" data-fp-id="${item.id}">查看更多 ›</button>
    </div>`
}

const closeDetail = () => {
  detail.value = null
}

/**
 * 「查看更多」按钮在高德注入的 DOM 里，拿不到 Vue 的事件绑定。
 * 用事件委托而非内联 onclick，既能拿到点击又不引入内联脚本。
 */
const onMapClick = (e: MouseEvent) => {
  const btn = (e.target as HTMLElement)?.closest?.('[data-fp-id]')
  if (!btn) return
  const id = Number(btn.getAttribute('data-fp-id'))
  const target = items.value.find((i) => i.id === id)
  if (target) detail.value = target
}

const initMap = async () => {
  try {
    const res = (await getGaodeConfig()) as any
    const cfg = res?.code === 200 ? res.data : null

    if (!cfg?.key) {
      mapError.value = '尚未配置高德地图 Key，请在后台「参数设置」中填写 blog.gaode.mapKey'
      return
    }

    // 安全密钥必须在加载 SDK 之前挂到 window 上
    if (cfg.securityCode) {
      ;(window as any)._AMapSecurityConfig = { securityJsCode: cfg.securityCode }
    }

    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default
    const AMap = await AMapLoader.load({
      key: cfg.key,
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.Marker', 'AMap.InfoWindow']
    })

    if (!mapEl.value) return

    mapInstance = new AMap.Map(mapEl.value, {
      mapStyle: MAP_STYLE,
      viewMode: '3D',
      zoom: MAP_ZOOM,
      center: MAP_CENTER
    })

    // isCustom 关掉高德自带的白底气泡外壳，由我们自己出样式
    infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(0, -30),
      anchor: 'bottom-center',
      autoMove: true,
      isCustom: true
    })
    mapInstance.on('click', () => infoWindow?.close())

    items.value.forEach((item) => {
      const pos = parsePosition(item.position)
      if (!pos) return

      const marker = new AMap.Marker({ position: pos, map: mapInstance, content: markerHtml(item) })
      marker.on('click', () => {
        infoWindow.setContent(infoHtml(item))
        infoWindow.open(mapInstance, pos)
        mapInstance.setZoomAndCenter(FOCUS_ZOOM, pos)
      })
    })

    mapEl.value.addEventListener('click', onMapClick)
    mapReady.value = true
  } catch (error: any) {
    mapError.value = `地图加载失败：${error?.message || '请检查高德 Key 与安全密钥是否正确'}`
  }
}

const lightbox = reactive<{ show: boolean; image: { url: string; title: string } | null }>({
  show: false,
  image: null
})

const openLightbox = (url: string, title: string) => {
  lightbox.image = { url, title }
  lightbox.show = true
}

/** 防止数据多次变化时重复初始化地图 */
let mapInitStarted = false

onMounted(() => {
  // 不能只在挂载这一刻判断一次：线上 useAsyncData 可能在客户端才取回数据，
  // 那时 items 还是空的，initMap 永远不会被调用，遮罩就一直停在「地图加载中…」。
  // 本地有 SSR 数据水合，挂载时就有值，所以这个时序问题只在线上暴露。
  watch(
    () => items.value.length,
    (len) => {
      if (!len || mapInitStarted) return
      mapInitStarted = true
      initMap()
    },
    { immediate: true }
  )
})

onBeforeUnmount(() => {
  mapEl.value?.removeEventListener('click', onMapClick)
  infoWindow?.close?.()
  mapInstance?.destroy?.()
  mapInstance = null
})
</script>

<style scoped>
.fp-page {
  position: relative;
}

.fp-map {
  width: 100%;
  /* 整屏铺开；页头 fixed 且半透明，地图透到它下面 */
  height: 100vh;
  /* 与「极夜蓝」样式的底色一致，避免瓦片加载前闪一下白 */
  background: #1a232c;
}

.fp-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  /* 跟随深色地图，不再区分明暗主题：浅色遮罩压在深色地图上会很突兀 */
  background: rgba(26, 35, 44, 0.92);
}

.fp-overlay-text {
  max-width: 460px;
  text-align: center;
  font-size: 14px;
  line-height: 1.9;
  color: rgba(232, 228, 220, 0.72);
}

/* ---------- 详情弹窗 ---------- */
.fp-modal-mask {
  position: fixed;
  inset: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
}

.fp-modal {
  width: min(880px, 100%);
  max-height: 86vh;
  overflow-y: auto;
  padding: 24px 26px 28px;
  border: 1px solid rgba(120, 120, 120, 0.35);
  border-radius: 16px;
  background: rgba(36, 40, 45, 0.94);
  color: #e6e6e6;
}

.fp-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.fp-modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.fp-modal-close {
  flex: none;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s;
}

.fp-modal-close:hover {
  background: rgba(255, 255, 255, 0.24);
}

.fp-modal-content {
  max-height: 210px;
  overflow-y: auto;
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.9;
  color: #d6d6d6;
  white-space: pre-wrap;
}

.fp-modal-meta {
  margin-bottom: 18px;
  text-align: right;
  font-size: 13px;
  line-height: 1.8;
  color: #a5a5a5;
}

.fp-modal-meta p {
  margin: 0;
}

/* 瀑布流用 CSS 多列即可，无需额外依赖 */
.fp-gallery {
  column-count: 3;
  column-gap: 12px;
}

.fp-gallery-item {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: none;
  cursor: pointer;
  break-inside: avoid;
}

.fp-gallery-item img {
  width: 100%;
  border-radius: 12px;
  transition: transform 0.3s;
}

.fp-gallery-item:hover img {
  transform: scale(1.03);
}

.fp-fade-enter-active,
.fp-fade-leave-active {
  transition: opacity 0.24s ease;
}

.fp-fade-enter-from,
.fp-fade-leave-to {
  opacity: 0;
}

@media (max-width: 700px) {
  .fp-gallery {
    column-count: 2;
  }
}
</style>

<!--
  标记与浮层卡片是高德动态注入的 DOM，拿不到 scoped 编译出的 data 属性，
  必须放在非 scoped 的样式块里，否则样式一律不生效。
-->
<style>
.fp-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  animation: fp-pulse 2s infinite;
}

.fp-marker img {
  width: 90%;
  height: 90%;
  border-radius: 50%;
  object-fit: cover;
}

@keyframes fp-pulse {
  0%,
  100% {
    box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.75);
  }
}

.fp-info {
  width: 240px;
  border-radius: 12px;
  overflow: hidden;
}

.fp-info-cover {
  position: relative;
  width: 100%;
  /* 正方形封面：padding-bottom 撑高，图片绝对定位铺满 */
  padding-bottom: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #4a4a4a;
}

.fp-info-cover > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fp-info-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 18px;
  background: rgba(0, 0, 0, 0.42);
}

.fp-info-mask h3 {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.fp-info-mask p {
  margin: 0 0 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.82);
}

.fp-info-more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 5px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.fp-info-more:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(1.04);
}
</style>

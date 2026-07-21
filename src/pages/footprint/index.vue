<template>
  <div class="fp-page">
    <header class="fp-hero">
      <h1 class="fp-title">那年走过的路</h1>
      <p class="fp-subtitle">把去过的地方钉在地图上</p>
      <p v-if="items.length" class="fp-summary">共 {{ items.length }} 处足迹</p>
    </header>

    <!-- 地图容器：未配置 key 时不渲染，避免高德 SDK 报错 -->
    <ClientOnly>
      <section v-if="items.length" class="fp-map-wrap">
        <!-- 容器必须始终保持尺寸：若用 v-show 隐藏，高德初始化时拿到 0×0 会抛 Pixel(NaN, NaN) -->
        <div ref="mapEl" class="fp-map" />

        <div v-if="!mapReady" class="fp-map-placeholder">
          <p v-if="mapError">{{ mapError }}</p>
          <p v-else>地图加载中…</p>
        </div>
      </section>
    </ClientOnly>

    <main v-if="items.length" class="fp-list">
      <article
        v-for="item in items"
        :key="item.id"
        class="fp-card"
        :class="{ active: activeId === item.id }"
        @click="focusOn(item)"
      >
        <div v-if="firstImage(item)" class="fp-cover">
          <img :src="firstImage(item)" :alt="item.title" loading="lazy" @error="markBroken(item.id)" />
        </div>

        <div class="fp-body">
          <div class="fp-meta">
            <span class="fp-address">📍 {{ item.address }}</span>
            <time class="fp-date">{{ formatDate(item.eventDate) }}</time>
          </div>
          <h3 class="fp-name">{{ item.title }}</h3>
          <p v-if="item.content" class="fp-desc">{{ item.content }}</p>

          <div v-if="galleryOf(item).length > 1" class="fp-thumbs">
            <img
              v-for="(img, i) in galleryOf(item).slice(0, 4)"
              :key="i"
              :src="img"
              :alt="`${item.title} ${i + 1}`"
              loading="lazy"
              @click.stop="openLightbox(img, item.title)"
            />
          </div>
        </div>
      </article>
    </main>

    <p v-else class="fp-empty">还没有记录任何足迹</p>

    <PhotographyLightbox :show="lightbox.show" :image="lightbox.image" @close="lightbox.show = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { getFootprintList, getGaodeConfig, type FootprintItem } from '~/api/footprint'

useHead({ title: '足迹' })

/** 地图初始视野：大致居中于中国 */
const MAP_CENTER: [number, number] = [105.625368, 37.746599]
const MAP_ZOOM = 4.6
/** 点击卡片聚焦时的放大层级 */
const FOCUS_ZOOM = 10

const { data: raw } = await useAsyncData('footprint-list', () => getFootprintList())

const items = computed<FootprintItem[]>(() => {
  const res = raw.value as any
  return res?.code === 200 ? res.data?.records || [] : []
})

const mapEl = ref<HTMLElement | null>(null)
const mapReady = ref(false)
const mapError = ref('')
const activeId = ref<number | null>(null)

let mapInstance: any = null
let infoWindow: any = null
const markers = new Map<number, any>()

const brokenImages = reactive(new Set<number>())
const galleryOf = (item: FootprintItem) => item.images || []
const firstImage = (item: FootprintItem) =>
  brokenImages.has(item.id) ? '' : galleryOf(item)[0] || ''
const markBroken = (id: number) => brokenImages.add(id)

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })

/** "lng,lat" -> [lng, lat]，格式不对返回 null 由调用方跳过 */
const parsePosition = (position: string): [number, number] | null => {
  const parts = (position || '').split(',').map((n) => Number(n.trim()))
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) return null
  return [parts[0], parts[1]]
}

const infoHtml = (item: FootprintItem) => {
  const img = firstImage(item)
  return `
    <div style="max-width:220px;padding:4px 2px">
      ${img ? `<img src="${img}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px" />` : ''}
      <div style="font-weight:600;font-size:14px;color:#3a3a3a">${item.title}</div>
      <div style="font-size:12px;color:#9a9188;margin-top:4px">${item.address} · ${formatDate(item.eventDate)}</div>
    </div>`
}

const focusOn = (item: FootprintItem) => {
  activeId.value = item.id
  const marker = markers.get(item.id)
  const pos = parsePosition(item.position)
  if (!mapInstance || !marker || !pos) return

  mapInstance.setZoomAndCenter(FOCUS_ZOOM, pos)
  infoWindow?.setContent(infoHtml(item))
  infoWindow?.open(mapInstance, pos)
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
      mapStyle: 'amap://styles/grey',
      viewMode: '3D',
      zoom: MAP_ZOOM,
      center: MAP_CENTER
    })

    infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30), anchor: 'bottom-center' })
    mapInstance.on('click', () => infoWindow?.close())

    items.value.forEach((item) => {
      const pos = parsePosition(item.position)
      if (!pos) return

      const marker = new AMap.Marker({ position: pos, title: item.address })
      marker.on('click', () => {
        activeId.value = item.id
        infoWindow.setContent(infoHtml(item))
        infoWindow.open(mapInstance, pos)
      })
      mapInstance.add(marker)
      markers.set(item.id, marker)
    })

    mapReady.value = true
  } catch (error: any) {
    // 地图挂了不影响下方卡片列表阅读
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

onMounted(() => {
  if (items.value.length) initMap()
})

onBeforeUnmount(() => {
  mapInstance?.destroy?.()
  mapInstance = null
  markers.clear()
})
</script>

<style scoped>
.fp-page {
  min-height: 100vh;
  padding: 0 clamp(16px, 4vw, 56px) 90px;
}

.fp-hero {
  padding: 90px 0 32px;
  text-align: center;
}

.fp-title {
  margin: 0 0 14px;
  font-size: clamp(36px, 6vw, 58px);
  font-weight: 700;
  letter-spacing: 3px;
  background: linear-gradient(90deg, #4f9d8c, #6fb3a0, #9c8878);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.fp-subtitle {
  margin: 0;
  font-size: 15px;
  letter-spacing: 4px;
  color: #a49b8f;
}

.fp-summary {
  margin: 12px 0 0;
  font-size: 13px;
  color: #bdb4a8;
}

.fp-map-wrap {
  position: relative;
  max-width: 1100px;
  height: 460px;
  margin: 0 auto 40px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.09);
}

.fp-map {
  width: 100%;
  height: 100%;
}

/* 盖在地图之上，而不是替换它 —— 保证地图容器始终有宽高 */
.fp-map-placeholder {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 24px;
  background: #f3f1ed;
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
  color: #8a8175;
}

.dark .fp-map-placeholder {
  background: #26262a;
  color: #9a9aa0;
}

.fp-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
  max-width: 1100px;
  margin: 0 auto;
}

.fp-card {
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 14px;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.07);
  transition: transform 0.32s ease, box-shadow 0.32s ease, border-color 0.32s ease;
}

.dark .fp-card {
  background: #26262a;
}

.fp-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(79, 157, 140, 0.2);
}

.fp-card.active {
  border-color: #6fb3a0;
}

.fp-cover img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.fp-body {
  padding: 15px 17px 17px;
}

.fp-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: #b0a698;
}

.fp-address {
  color: #6fb3a0;
}

.fp-name {
  margin: 8px 0 0;
  font-size: 16px;
  font-weight: 600;
  color: #3a3a3a;
}

.dark .fp-name {
  color: #e6e6e6;
}

.fp-desc {
  margin: 8px 0 0;
  font-size: 13.5px;
  line-height: 1.75;
  color: #6f6659;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dark .fp-desc {
  color: #a9a9ad;
}

.fp-thumbs {
  display: flex;
  gap: 7px;
  margin-top: 12px;
}

.fp-thumbs img {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  object-fit: cover;
  cursor: zoom-in;
  transition: transform 0.25s ease;
}

.fp-thumbs img:hover {
  transform: scale(1.08);
}

.fp-empty {
  padding: 90px 0;
  text-align: center;
  color: #b0a698;
}

@media (max-width: 640px) {
  .fp-map-wrap {
    height: 320px;
  }
}
</style>

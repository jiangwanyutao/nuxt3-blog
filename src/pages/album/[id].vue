<template>
  <div class="ad-page">
    <AlbumSwitcher />

    <NuxtLink to="/album" class="ad-back">← 返回相册列表</NuxtLink>
    <div v-if="albumName" class="ad-name">{{ albumName }}</div>

    <div v-if="photos.length" class="ad-grid">
      <button
        v-for="(p, i) in photos"
        :key="p.id"
        type="button"
        class="ad-item"
        :style="{ aspectRatio: ratioOf(p) }"
        @click="open(i)"
      >
        <img :src="p.url" :alt="p.name || albumName" loading="lazy" />
        <span v-if="p.width && p.height" class="ad-meta">{{ p.width }} × {{ p.height }}</span>
      </button>
    </div>

    <p v-else-if="!pending" class="ad-empty">这个相册还没有照片</p>

    <button v-if="hasMore" class="ad-more" :disabled="loadingMore" @click="loadMore">
      {{ loadingMore ? '加载中…' : '加载更多' }}
    </button>

    <PhotographyLightbox :show="lightbox.show" :image="lightbox.image" @close="lightbox.show = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getAlbumList, getAlbumPhotos, type AlbumItem, type PhotoItem } from '~/api/album'

const route = useRoute()
const albumId = Number(route.params.id)

/** 与后端默认页大小保持一致 */
const PAGE_SIZE = 40

const { data: raw, pending } = await useAsyncData(`album-photos-${albumId}`, () =>
  getAlbumPhotos(albumId, { page: 1, size: PAGE_SIZE })
)

// 相册名单独取一次：照片接口不返回相册信息，为个标题再加一个接口不值当
const { data: albumsRaw } = await useAsyncData('album-list', () => getAlbumList())

const albumName = computed(() => {
  const res = albumsRaw.value as any
  const list: AlbumItem[] = res?.code === 200 ? res.data?.records || [] : []
  return list.find((a) => a.id === albumId)?.name || ''
})

useHead({ title: computed(() => (albumName.value ? `${albumName.value} · 回忆录` : '回忆录')) })

const extra = ref<PhotoItem[]>([])
const page = ref(1)
const loadingMore = ref(false)

const firstPage = computed<PhotoItem[]>(() => {
  const res = raw.value as any
  return res?.code === 200 ? res.data?.records || [] : []
})
const total = computed(() => {
  const res = raw.value as any
  return res?.code === 200 ? res.data?.total || 0 : 0
})

const photos = computed(() => [...firstPage.value, ...extra.value])
const hasMore = computed(() => photos.value.length < total.value)

const loadMore = async () => {
  if (loadingMore.value) return
  loadingMore.value = true
  try {
    const res: any = await getAlbumPhotos(albumId, { page: page.value + 1, size: PAGE_SIZE })
    if (res?.code === 200) {
      extra.value.push(...(res.data?.records || []))
      page.value += 1
    }
  } finally {
    loadingMore.value = false
  }
}

/**
 * 用入库时记录的原始宽高算占位比例，图片没加载完格子也已经占好位。
 * 缺尺寸的老数据退回 4:3，只会在加载后轻微调整，不至于整页跳动。
 */
const ratioOf = (p: PhotoItem) => (p.width && p.height ? `${p.width} / ${p.height}` : '4 / 3')

const lightbox = reactive<{ show: boolean; image: { url: string; title: string } | null }>({
  show: false,
  image: null
})

const open = (i: number) => {
  const p = photos.value[i]
  if (!p) return
  lightbox.image = { url: p.url, title: p.name || albumName.value }
  lightbox.show = true
}
</script>

<style scoped>
.ad-page {
  min-height: 100vh;
  background: #0f151c;
  padding: 148px 5% 80px;
}

.ad-back {
  position: fixed;
  left: 32px;
  top: 84px;
  z-index: 30;
  padding: 7px 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(20, 26, 34, 0.72);
  backdrop-filter: blur(12px);
  color: rgba(232, 228, 220, 0.7);
  font-size: 13px;
  text-decoration: none;
  transition: color 0.25s, border-color 0.25s;
}

.ad-back:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.ad-name {
  margin-bottom: 26px;
  font-size: clamp(24px, 3.4vw, 34px);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #f2efe9;
}

/* 多列瀑布流：格子按原始比例占位，图片加载前后不跳动 */
.ad-grid {
  column-count: 4;
  column-gap: 14px;
}

.ad-item {
  position: relative;
  display: block;
  width: 100%;
  margin: 0 0 14px;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: #1a232c;
  overflow: hidden;
  cursor: pointer;
  break-inside: avoid;
}

.ad-item img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.ad-item:hover img {
  transform: scale(1.04);
}

.ad-meta {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 2px 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  opacity: 0;
  transition: opacity 0.25s;
}

.ad-item:hover .ad-meta {
  opacity: 1;
}

.ad-empty {
  padding: 80px 0;
  text-align: center;
  font-size: 14px;
  color: rgba(232, 228, 220, 0.4);
}

.ad-more {
  display: block;
  margin: 28px auto 0;
  padding: 10px 30px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(232, 228, 220, 0.75);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.25s, color 0.25s;
}

.ad-more:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.ad-more:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1280px) {
  .ad-grid {
    column-count: 3;
  }
}

@media (max-width: 900px) {
  .ad-grid {
    column-count: 2;
  }
}

@media (max-width: 640px) {
  .ad-page {
    padding: 132px 4% 60px;
  }

  .ad-back {
    left: 16px;
    top: 132px;
  }
}
</style>

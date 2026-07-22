<template>
  <div class="ab-page">
    <AlbumSwitcher />

    <header class="ab-head">
      <h1 class="ab-title">回忆录</h1>
      <p class="ab-sub">共 {{ albums.length }} 个相册</p>
    </header>

    <div v-if="albums.length" class="ab-grid">
      <NuxtLink v-for="item in albums" :key="item.id" :to="`/album/${item.id}`" class="ab-card">
        <img v-if="item.cover" :src="item.cover" :alt="item.name" class="ab-cover" loading="lazy" />
        <div v-else class="ab-cover ab-cover-empty" aria-hidden="true">📷</div>

        <div class="ab-mask" />
        <div class="ab-info">
          <span class="ab-name">{{ item.name }}</span>
          <span class="ab-count">🖼 {{ item.photoCount || 0 }} 张照片</span>
        </div>
      </NuxtLink>
    </div>

    <p v-else class="ab-empty">还没有相册</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getAlbumList, type AlbumItem } from '~/api/album'

useHead({ title: '回忆录' })

const { data: raw } = await useAsyncData('album-list', () => getAlbumList())

const albums = computed<AlbumItem[]>(() => {
  const res = raw.value as any
  return res?.code === 200 ? res.data?.records || [] : []
})
</script>

<style scoped>
.ab-page {
  min-height: 100vh;
  /* 与足迹页深色地图同一色系，两个 Tab 切换时不跳色 */
  background: #0f151c;
  padding: 148px 5% 80px;
}

.ab-head {
  margin-bottom: 32px;
}

.ab-title {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #f2efe9;
}

.ab-sub {
  margin: 8px 0 0;
  font-size: 14px;
  color: rgba(232, 228, 220, 0.45);
}

.ab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.ab-card {
  position: relative;
  display: block;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border-radius: 14px;
  background: #1a232c;
  text-decoration: none;
}

.ab-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.ab-cover-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  opacity: 0.3;
}

.ab-card:hover .ab-cover {
  transform: scale(1.06);
}

/* 底部压暗，保证文字在任何照片上都读得清 */
.ab-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.15) 45%, transparent 70%);
  pointer-events: none;
}

.ab-info {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ab-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.ab-count {
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(6px);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.92);
}

.ab-empty {
  padding: 80px 0;
  text-align: center;
  font-size: 14px;
  color: rgba(232, 228, 220, 0.4);
}

@media (max-width: 640px) {
  .ab-page {
    padding: 132px 4% 60px;
  }

  .ab-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
}
</style>

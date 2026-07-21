<template>
  <div class="ms-page">
    <header class="ms-hero">
      <h1 class="ms-title">里程碑</h1>
      <p class="ms-subtitle">那些值得被记住的时刻</p>
      <p v-if="items.length" class="ms-summary">
        共 {{ items.length }} 个节点，横跨 {{ yearSpan }}
      </p>
    </header>

    <div v-if="items.length" class="ms-timeline">
      <template v-for="group in groups" :key="group.year">
        <div class="ms-year">
          <span>{{ group.year }}</span>
        </div>

        <article
          v-for="entry in group.items"
          :key="entry.item.id"
          class="ms-item"
          :class="entry.index % 2 === 0 ? 'is-left' : 'is-right'"
        >
          <div class="ms-node" />

          <div class="ms-card">
            <img
              v-if="entry.item.image && !brokenImages.has(entry.item.id)"
              class="ms-image"
              :src="entry.item.image"
              :alt="entry.item.title"
              loading="lazy"
              :data-id="entry.item.id"
              @click="openLightbox(entry.item)"
              @error="brokenImages.add(entry.item.id)"
            />

            <div class="ms-card-body">
              <time class="ms-date">{{ formatDate(entry.item.eventDate) }}</time>
              <h3 class="ms-name">{{ entry.item.title }}</h3>
              <p v-if="entry.item.description" class="ms-desc">{{ entry.item.description }}</p>

              <div v-if="entry.item.tags?.length" class="ms-tags">
                <span v-for="tag in entry.item.tags" :key="tag" class="ms-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </article>
      </template>
    </div>

    <p v-else class="ms-empty">还没有记录任何里程碑</p>

    <PhotographyLightbox :show="lightbox.show" :image="lightbox.image" @close="lightbox.show = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { getMilestoneList, type MilestoneItem } from '~/api/milestone'

useHead({ title: '里程碑' })

const { data: raw } = await useAsyncData('milestone-list', () => getMilestoneList())

const items = computed<MilestoneItem[]>(() => {
  const res = raw.value as any
  return res?.code === 200 ? res.data?.records || [] : []
})

const yearOf = (date: string) => new Date(date).getFullYear()

/** 按年份分组，同时给每条记录一个全局序号用于左右交替 */
const groups = computed(() => {
  const result: { year: number; items: { item: MilestoneItem; index: number }[] }[] = []

  items.value.forEach((item, index) => {
    const year = yearOf(item.eventDate)
    const last = result[result.length - 1]
    if (last && last.year === year) {
      last.items.push({ item, index })
    } else {
      result.push({ year, items: [{ item, index }] })
    }
  })

  return result
})

const yearSpan = computed(() => {
  if (!items.value.length) return ''
  // 列表已按时间倒序，首尾即为最新与最早
  const newest = yearOf(items.value[0].eventDate)
  const oldest = yearOf(items.value[items.value.length - 1].eventDate)
  return newest === oldest ? `${newest} 年` : `${oldest} - ${newest} 年`
})

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })

// 图床挂掉或 URL 写错时，整块封面直接隐藏，不留破图占位
const brokenImages = reactive(new Set<number>())

// SSR 输出的图片可能在水合完成前就已加载失败，那次 error 事件收不到，
// 因此挂载后再主动补扫一遍已完成但没有实际尺寸的图片。
onMounted(() => {
  document.querySelectorAll<HTMLImageElement>('.ms-image').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      brokenImages.add(Number(img.dataset.id))
    }
  })
})

const lightbox = reactive<{ show: boolean; image: { url: string; title: string } | null }>({
  show: false,
  image: null
})

const openLightbox = (item: MilestoneItem) => {
  if (!item.image) return
  lightbox.image = { url: item.image, title: item.title }
  lightbox.show = true
}
</script>

<style scoped>
.ms-page {
  min-height: 100vh;
  padding: 0 clamp(16px, 4vw, 56px) 90px;
}

.ms-hero {
  padding: 90px 0 40px;
  text-align: center;
}

.ms-title {
  margin: 0 0 14px;
  font-size: clamp(38px, 6vw, 60px);
  font-weight: 700;
  letter-spacing: 3px;
  background: linear-gradient(90deg, #c9a227, #e88b8f, #9c8878);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ms-subtitle {
  margin: 0;
  font-size: 15px;
  letter-spacing: 4px;
  color: #a49b8f;
}

.ms-summary {
  margin: 14px 0 0;
  font-size: 13px;
  color: #bdb4a8;
}

/* ---- 时间轴 ---- */
.ms-timeline {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
}

/* 中轴线 */
.ms-timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  translate: -50% 0;
  background: linear-gradient(180deg, transparent, #e4dcd2 8%, #e4dcd2 92%, transparent);
}

.dark .ms-timeline::before {
  background: linear-gradient(180deg, transparent, #3a3a40 8%, #3a3a40 92%, transparent);
}

.ms-year {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  margin: 34px 0 26px;
}

.ms-year span {
  padding: 5px 20px;
  border-radius: 999px;
  background: #9c8878;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #fff;
  box-shadow: 0 4px 14px rgba(156, 136, 120, 0.3);
}

.ms-item {
  position: relative;
  width: 50%;
  padding: 0 38px;
  margin-bottom: 30px;
}

.ms-item.is-left {
  left: 0;
}

.ms-item.is-right {
  left: 50%;
}

/* 轴上的圆点 */
.ms-node {
  position: absolute;
  top: 26px;
  z-index: 2;
  width: 13px;
  height: 13px;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #e88b8f;
  box-shadow: 0 0 0 3px rgba(232, 139, 143, 0.22);
}

.dark .ms-node {
  border-color: #1f1f23;
}

.ms-item.is-left .ms-node {
  right: -6.5px;
}

.ms-item.is-right .ms-node {
  left: -6.5px;
}

.ms-card {
  overflow: hidden;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.07);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.dark .ms-card {
  background: #26262a;
}

.ms-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(156, 136, 120, 0.2);
}

.ms-image {
  width: 100%;
  height: 168px;
  object-fit: cover;
  cursor: zoom-in;
  transition: filter 0.25s ease;
}

.ms-image:hover {
  filter: brightness(0.92);
}

.ms-card-body {
  padding: 16px 18px 18px;
}

.ms-date {
  font-size: 12px;
  letter-spacing: 1px;
  color: #b0a698;
}

.ms-name {
  margin: 7px 0 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: #3a3a3a;
}

.dark .ms-name {
  color: #e6e6e6;
}

.ms-desc {
  margin: 9px 0 0;
  font-size: 13.5px;
  line-height: 1.75;
  color: #6f6659;
  white-space: pre-wrap;
}

.dark .ms-desc {
  color: #a9a9ad;
}

.ms-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.ms-tag {
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(232, 139, 143, 0.14);
  font-size: 12px;
  color: #c07c80;
}

.ms-empty {
  padding: 90px 0;
  text-align: center;
  color: #b0a698;
}

/* 窄屏收成单列，轴线移到最左 */
@media (max-width: 768px) {
  .ms-timeline::before {
    left: 8px;
  }

  .ms-year {
    justify-content: flex-start;
    padding-left: 34px;
  }

  .ms-item,
  .ms-item.is-right {
    left: 0;
    width: 100%;
    padding: 0 0 0 34px;
  }

  .ms-item.is-left .ms-node,
  .ms-item.is-right .ms-node {
    left: 1.5px;
    right: auto;
  }
}
</style>

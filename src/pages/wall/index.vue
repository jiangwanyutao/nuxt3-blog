<template>
  <div class="wall-page">
    <header class="wall-hero">
      <div class="wall-dots">
        <span v-for="dot in DOTS" :key="dot.delay" :style="{ background: dot.color, width: dot.size, height: dot.size, animationDelay: dot.delay }" />
      </div>

      <h1 class="wall-title">留言墙</h1>
      <p class="wall-subtitle">想对我说些什么？来吧</p>

      <div class="wall-divider">
        <i />
        <span />
        <i />
      </div>
    </header>

    <nav class="wall-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.mark"
        class="wall-tab"
        :class="{ active: tab.mark === activeMark }"
        @click="switchCate(tab.mark)"
      >
        {{ tab.name }}
      </button>
    </nav>

    <main class="wall-main">
      <WallMasonry v-if="walls.length" :items="walls" />
      <p v-else class="wall-empty">这里还空着，来贴上第一张便签吧</p>
    </main>

    <button type="button" class="wall-add-btn" aria-label="写留言" @click="showModal = true">
      <span>+</span>
    </button>

    <WallAddModal v-model:show="showModal" :cates="cates" @submitted="refreshList" />

    <footer class="wall-footer">— 每一条留言，都是一颗发光的心 —</footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getWallCateList, getWallList, type WallCate, type WallItem } from '~/api/wall'

useHead({ title: '留言墙' })

/** 「全部」标签的固定标识，不对应任何后端分类 */
const ALL_MARK = 'all'

const DOTS = [
  { color: '#fb7185', size: '8px', delay: '0s' },
  { color: '#fbbf24', size: '6px', delay: '.5s' },
  { color: '#a78bfa', size: '10px', delay: '1s' },
  { color: '#60a5fa', size: '6px', delay: '1.5s' },
  { color: '#34d399', size: '8px', delay: '2s' }
]

const route = useRoute()
const router = useRouter()
const showModal = ref(false)

const pickData = (res: any) => (res?.code === 200 ? res.data : null)

const { data: cateRaw } = await useAsyncData('wall-cates', () => getWallCateList())

const cates = computed<WallCate[]>(() => pickData(cateRaw.value) || [])

const tabs = computed(() => [{ id: 0, name: '全部', mark: ALL_MARK, sort: -1 }, ...cates.value])

const activeMark = computed(() => (route.query.cate as string) || ALL_MARK)

const activeCateId = computed(() => {
  if (activeMark.value === ALL_MARK) return 0
  return cates.value.find((c) => c.mark === activeMark.value)?.id || 0
})

const { data: listRaw, refresh: refreshList } = await useAsyncData(
  'wall-list',
  () => getWallList(activeCateId.value),
  // 分类切换时重新拉取（activeCateId 依赖分类列表，故其就绪后才会变化）
  { watch: [activeCateId] }
)

const walls = computed<WallItem[]>(() => pickData(listRaw.value)?.records || [])

const switchCate = (mark: string) => {
  router.push({ query: mark === ALL_MARK ? {} : { cate: mark } })
}
</script>

<style scoped>
.wall-page {
  position: relative;
  min-height: 100vh;
  padding: 0 clamp(16px, 4vw, 56px) 80px;
}

.wall-hero {
  padding: 90px 0 8px;
  text-align: center;
}

.wall-dots {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 26px;
}

.wall-dots span {
  border-radius: 50%;
  opacity: 0.75;
  animation: wall-float 3s ease-in-out infinite;
}

.wall-title {
  margin: 0 0 14px;
  font-size: clamp(40px, 7vw, 68px);
  font-weight: 700;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #f59e0b, #f43f5e, #8b5cf6, #f59e0b);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: wall-shimmer 5s linear infinite;
}

.wall-subtitle {
  margin: 0;
  font-size: 15px;
  letter-spacing: 4px;
  color: #a49b8f;
}

.wall-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

.wall-divider i {
  width: 70px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ddd5ca);
}

.wall-divider i:last-child {
  background: linear-gradient(270deg, transparent, #ddd5ca);
}

.wall-divider span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
}

.wall-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 36px 0 28px;
}

.wall-tab {
  padding: 9px 20px;
  border: 1px solid #ece6de;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  color: #6f6659;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.dark .wall-tab {
  border-color: #3a3a40;
  background: rgba(45, 45, 50, 0.8);
  color: #bbb;
}

.wall-tab:hover {
  color: #e88b8f;
  transform: scale(1.05);
}

.wall-tab.active {
  border-color: transparent;
  background: #e88b8f;
  color: #fff;
  transform: scale(1.05);
}

.wall-main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px 0 40px;
}

.wall-empty {
  padding: 70px 0;
  text-align: center;
  color: #b0a698;
}

.wall-add-btn {
  position: fixed;
  right: 32px;
  bottom: 140px;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0a6a9, #e07d82);
  font-size: 30px;
  line-height: 1;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(224, 125, 130, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wall-add-btn:hover {
  transform: scale(1.12);
  box-shadow: 0 12px 30px rgba(224, 125, 130, 0.5);
}

.wall-add-btn span {
  transform: translateY(-2px);
}

.wall-footer {
  padding-top: 20px;
  text-align: center;
  font-size: 13px;
  letter-spacing: 3px;
  color: #c3bbb0;
}

@keyframes wall-float {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-14px);
    opacity: 1;
  }
}

@keyframes wall-shimmer {
  from {
    background-position: 0% center;
  }
  to {
    background-position: 200% center;
  }
}

@media (max-width: 640px) {
  .wall-add-btn {
    right: 20px;
    bottom: 120px;
  }
}
</style>

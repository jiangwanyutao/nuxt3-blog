<template>
  <div class="wall-masonry">
    <div v-for="(column, colIndex) in columns" :key="colIndex" class="wall-column">
      <article
        v-for="item in column"
        :key="item.id"
        class="wall-card"
        :style="cardStyle(item)"
      >
        <span class="wall-pin" :style="{ background: theme(item).pin }" />

        <span class="wall-badge" :style="{ background: theme(item).badge }">
          {{ item.cate?.name || '留言' }}
        </span>

        <p class="wall-content">{{ item.content }}</p>

        <footer class="wall-meta">
          <span class="wall-author">{{ item.name || '匿名' }}</span>
          <span class="wall-time">{{ formatRelativeTime(item.createTime) }}</span>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { WallItem } from '~/api/wall'
import { formatRelativeTime } from '~/composables/useRelativeTime'

const props = defineProps<{ items: WallItem[] }>()

/** 便签配色：底色渐变 / 图钉 / 分类角标 */
const THEMES: Record<string, { bg: string; pin: string; badge: string }> = {
  '#ffe3944d': {
    bg: 'linear-gradient(145deg,#FEF3C7,#FDE68A)',
    pin: 'linear-gradient(135deg,#fbbf24,#d97706)',
    badge: 'rgba(251,191,36,.28)'
  },
  '#fcafa24d': {
    bg: 'linear-gradient(145deg,#FFE4E6,#FECDD3)',
    pin: 'linear-gradient(135deg,#fb7185,#e11d48)',
    badge: 'rgba(251,113,133,.28)'
  },
  '#a8ed8a4d': {
    bg: 'linear-gradient(145deg,#D1FAE5,#A7F3D0)',
    pin: 'linear-gradient(135deg,#34d399,#059669)',
    badge: 'rgba(52,211,153,.28)'
  },
  '#caa7f74d': {
    bg: 'linear-gradient(145deg,#EDE9FE,#DDD6FE)',
    pin: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
    badge: 'rgba(167,139,250,.28)'
  },
  '#92e6f54d': {
    bg: 'linear-gradient(145deg,#DBEAFE,#BFDBFE)',
    pin: 'linear-gradient(135deg,#60a5fa,#2563eb)',
    badge: 'rgba(96,165,250,.28)'
  }
}

const DEFAULT_THEME = THEMES['#ffe3944d']

/** 固定的倾斜角序列：随机会导致 SSR 与客户端不一致而水合报错 */
const ROTATIONS = [-3, 2.5, -1.8, 4, -2.8, 1.5, -3.5, 3, -2, 1.8, -3.2, 2.5]

const theme = (item: WallItem) => THEMES[item.color] || DEFAULT_THEME

const columnCount = ref(4)

const resolveColumnCount = (width: number) => {
  if (width < 640) return 1
  if (width < 900) return 2
  if (width < 1200) return 3
  return 4
}

const updateColumnCount = () => {
  columnCount.value = resolveColumnCount(window.innerWidth)
}

onMounted(() => {
  updateColumnCount()
  window.addEventListener('resize', updateColumnCount)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateColumnCount)
})

/** 按内容长度粗估卡片高度，用于把新卡片放进当前最矮的一列 */
const estimateHeight = (item: WallItem) => {
  const lines = Math.ceil(item.content.length / 16)
  return 140 + Math.min(lines, 8) * 22
}

const columns = computed<WallItem[][]>(() => {
  const result: WallItem[][] = Array.from({ length: columnCount.value }, () => [])
  const heights = new Array(columnCount.value).fill(0)

  props.items.forEach((item) => {
    const target = heights.indexOf(Math.min(...heights))
    result[target].push(item)
    heights[target] += estimateHeight(item) + 32
  })

  return result
})

const indexOf = (item: WallItem) => props.items.findIndex((i) => i.id === item.id)

const cardStyle = (item: WallItem) => {
  const index = indexOf(item)
  return {
    background: theme(item).bg,
    rotate: `${ROTATIONS[index % ROTATIONS.length]}deg`,
    animationDelay: `${Math.min(index, 20) * 80 + 120}ms`
  }
}
</script>

<style scoped>
.wall-masonry {
  display: flex;
  align-items: flex-start;
  gap: 22px;
}

.wall-column {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 32px;
}

.wall-card {
  position: relative;
  padding: 26px 22px 18px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
  opacity: 0;
  animation: wall-card-enter 0.6s ease forwards;
  transition: rotate 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    scale 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    translate 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.45s ease;
}

.wall-card:hover {
  rotate: 0deg !important;
  scale: 1.06;
  translate: 0 -10px;
  z-index: 5;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.14);
}

/* 纸张纹理：靠噪点让便签不像纯色卡片 */
.wall-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)' opacity='0.5'/%3E%3C/svg%3E");
}

.wall-pin {
  position: absolute;
  top: -8px;
  left: 50%;
  width: 16px;
  height: 16px;
  translate: -50% 0;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35),
    inset 0 -3px 6px rgba(0, 0, 0, 0.15),
    inset 0 3px 6px rgba(255, 255, 255, 0.4);
}

.wall-pin::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
}

.wall-badge {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: #4b4237;
}

.wall-content {
  position: relative;
  margin: 0 0 16px;
  max-height: 190px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.75;
  color: #3b352d;
  white-space: pre-wrap;
  word-break: break-word;
}

.wall-content::-webkit-scrollbar {
  width: 0;
}

.wall-meta {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
}

.wall-author {
  font-weight: 600;
  color: #5b5348;
}

.wall-time {
  color: #9a9188;
}

@keyframes wall-card-enter {
  from {
    opacity: 0;
    translate: 0 46px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@media (max-width: 640px) {
  .wall-masonry {
    gap: 0;
  }
}
</style>

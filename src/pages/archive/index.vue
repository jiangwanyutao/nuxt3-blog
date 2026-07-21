<template>
  <div class="archive-page">
    <header class="archive-hero">
      <h1 class="archive-title">归档</h1>
      <p class="archive-subtitle">共 {{ articles.length }} 篇文章</p>
    </header>

    <div class="archive-layout">
      <!-- 左：时间轴归档 -->
      <section class="archive-timeline">
        <div v-for="group in grouped" :key="group.year" class="archive-year">
          <h2 class="year-label">{{ group.year }}</h2>
          <ul class="year-list">
            <li v-for="a in group.items" :key="a.id">
              <NuxtLink :to="`/article/${a.id}`" class="archive-link">
                <span class="archive-date">{{ a.dateLabel }}</span>
                <span class="archive-name">{{ a.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
        <p v-if="!articles.length" class="archive-empty">暂无文章</p>
      </section>

      <!-- 右：统计图表 -->
      <aside class="archive-stats">
        <div class="stat-card">
          <h3 class="stat-title">分类统计</h3>
          <div ref="cateChartRef" class="chart-box"></div>
        </div>
        <div class="stat-card">
          <h3 class="stat-title">标签统计</h3>
          <div ref="tagChartRef" class="chart-box"></div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getArticleList } from '~/api/article'
import { useDateFormat } from '@vueuse/core'

/** 归档最多拉取的文章数 */
const ARCHIVE_FETCH_LIMIT = 200

const { data: listRaw } = await useAsyncData('archive-articles', () =>
  getArticleList({ page: 1, limit: ARCHIVE_FETCH_LIMIT })
)

interface ArchiveItem {
  id: number
  title: string
  createTime: string
  dateLabel: string
  categoryName: string
  tagNames: string[]
}

const nameOf = (v: any): string => {
  if (!v) return ''
  if (typeof v === 'string') return v
  return v.name || v.categoryName || ''
}

const articles = computed<ArchiveItem[]>(() => {
  const res = listRaw.value as any
  const items = res?.code === 200 ? res.data?.items || [] : []
  return items
    .map((a: any) => ({
      id: a.id,
      title: a.title,
      createTime: a.createTime,
      dateLabel: useDateFormat(a.createTime, 'MM-DD').value,
      categoryName: nameOf(a.category) || '未分类',
      tagNames: Array.isArray(a.tags) ? a.tags.map(nameOf).filter(Boolean) : []
    }))
    .sort(
      (x: ArchiveItem, y: ArchiveItem) =>
        new Date(y.createTime).getTime() - new Date(x.createTime).getTime()
    )
})

const grouped = computed(() => {
  const map = new Map<string, ArchiveItem[]>()
  for (const a of articles.value) {
    const year = String(new Date(a.createTime).getFullYear())
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(a)
  }
  return Array.from(map.entries())
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, items]) => ({ year, items }))
})

/** 统计各分类/标签的文章数（基于实际文章数据，而非后端冗余计数） */
const countBy = (getKeys: (a: ArchiveItem) => string[]) => {
  const counter = new Map<string, number>()
  for (const a of articles.value) {
    for (const k of getKeys(a)) {
      counter.set(k, (counter.get(k) || 0) + 1)
    }
  }
  return Array.from(counter.entries()).map(([name, value]) => ({ name, value }))
}

// ---- echarts（仅客户端，动态引入） ----
const cateChartRef = ref<HTMLElement | null>(null)
const tagChartRef = ref<HTMLElement | null>(null)
let charts: any[] = []
let onResize: (() => void) | null = null

const pieOption = (data: Array<{ name: string; value: number }>) => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} 篇 ({d}%)' },
  legend: { bottom: 0, type: 'scroll', textStyle: { color: '#999' } },
  series: [
    {
      type: 'pie',
      radius: ['38%', '64%'],
      center: ['50%', '44%'],
      itemStyle: { borderRadius: 6, borderWidth: 2, borderColor: 'transparent' },
      label: { show: false },
      data
    }
  ]
})

onMounted(async () => {
  if (!articles.value.length) return
  const echarts = await import('echarts')
  const pairs: Array<[HTMLElement | null, Array<{ name: string; value: number }>]> = [
    [cateChartRef.value, countBy((a) => [a.categoryName])],
    [tagChartRef.value, countBy((a) => a.tagNames)]
  ]
  for (const [el, data] of pairs) {
    if (!el || !data.length) continue
    const chart = echarts.init(el)
    chart.setOption(pieOption(data))
    charts.push(chart)
  }
  onResize = () => charts.forEach((c) => c.resize())
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  if (onResize) window.removeEventListener('resize', onResize)
  charts.forEach((c) => c.dispose())
  charts = []
})

useSeoMeta({
  title: '归档 - 江晚正愁余 Blog',
  description: '博客文章归档与分类、标签统计'
})
</script>

<style scoped>
.archive-page {
  min-height: 100vh;
  padding: 120px 24px 80px;
  max-width: 1100px;
  margin: 0 auto;
}

.archive-hero {
  text-align: center;
  margin-bottom: 48px;
}

.archive-title {
  font-size: 40px;
  font-weight: 700;
  margin: 0 0 12px;
  background: linear-gradient(120deg, #e89b8f, #9c8878);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.archive-subtitle {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.archive-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  align-items: start;
}

/* ---- 时间轴 ---- */
.archive-year {
  margin-bottom: 32px;
}

.year-label {
  font-size: 24px;
  font-weight: 700;
  color: #9c8878;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0ece7;
}

.year-list {
  list-style: none;
  margin: 0;
  padding: 0 0 0 12px;
  border-left: 2px solid #f0ece7;
}

.year-list li {
  position: relative;
  padding: 6px 0 6px 18px;
}

.year-list li::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d6c9bc;
  transition: all 0.2s ease;
}

.year-list li:hover::before {
  background: #e89b8f;
  transform: translateY(-50%) scale(1.4);
}

.archive-link {
  display: flex;
  align-items: baseline;
  gap: 14px;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.archive-link:hover {
  background: #f5f3f0;
}

.dark .archive-link:hover {
  background: rgba(255, 255, 255, 0.06);
}

.archive-date {
  flex-shrink: 0;
  font-size: 13px;
  color: #b0a698;
  font-family: ui-monospace, monospace;
}

.archive-name {
  font-size: 15px;
  color: #444;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .archive-name {
  color: #ccc;
}

.archive-link:hover .archive-name {
  color: #9c8878;
}

.archive-empty {
  text-align: center;
  color: #999;
  padding: 60px 0;
}

/* ---- 统计卡片 ---- */
.archive-stats {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 100px;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.dark .stat-card {
  background: #26262a;
}

.stat-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: #9c8878;
}

.chart-box {
  width: 100%;
  height: 260px;
}

@media (max-width: 900px) {
  .archive-layout {
    grid-template-columns: 1fr;
  }

  .archive-stats {
    position: static;
  }
}
</style>

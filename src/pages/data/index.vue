<template>
  <div class="dp-page">
    <!-- 固定背景层：网格 + 三团弥散光晕（随页面滚动保持不动） -->
    <div class="dp-bg">
      <div class="dp-grid" />
      <div class="dp-orb dp-orb-1" />
      <div class="dp-orb dp-orb-2" />
      <div class="dp-orb dp-orb-3" />
    </div>

    <header class="dp-hero">
      <div class="dp-hero-mask" />
      <div class="dp-hero-text">
        <h1>数据统计</h1>
        <p>博客运营数据一览</p>
      </div>
    </header>

    <!-- 卡片容器上提，压住 hero 底部 -->
    <div class="dp-wrap">
      <div class="dp-card">
        <!-- ============ 数据统计 ============ -->
        <section class="dp-section">
          <div class="dp-section-head">
            <span class="dp-section-icon">📊</span>
            <div>
              <h2>数据统计</h2>
              <p>博客核心指标概览</p>
            </div>
          </div>

          <div class="dp-stat-grid">
            <div v-for="card in statCards" :key="card.title" class="dp-stat" :class="`is-${card.tone}`">
              <span class="dp-stat-icon">{{ card.icon }}</span>
              <div class="dp-stat-num">
                <p class="dp-stat-value">{{ card.value }}</p>
                <p class="dp-stat-label">{{ card.title }}</p>
              </div>
            </div>
          </div>

          <div class="dp-two-col">
            <div class="dp-panel">
              <div class="dp-panel-head">
                <span class="dp-panel-icon">🗂️</span>
                <div>
                  <h3>分类一览</h3>
                  <p>文章分类占比分布</p>
                </div>
              </div>
              <div v-if="categories.length" ref="pieEl" class="dp-chart" />
              <p v-else class="dp-panel-empty">暂无分类数据</p>
            </div>

            <div class="dp-panel">
              <div class="dp-panel-head">
                <span class="dp-panel-icon">🏷️</span>
                <div>
                  <h3>标签墙</h3>
                  <p>文章标签云展示</p>
                </div>
              </div>
              <div v-if="tags.length" class="dp-tags">
                <span
                  v-for="(tag, i) in tags"
                  :key="tag.name"
                  class="dp-tag"
                  :class="`tone-${i % 6}`"
                  :title="`${tag.name}（${tag.value} 篇）`"
                >
                  {{ tag.name }}
                </span>
              </div>
              <p v-else class="dp-panel-empty">暂无标签数据</p>
            </div>
          </div>
        </section>

        <!-- ============ 文章归纳 ============ -->
        <section class="dp-section">
          <div class="dp-section-head">
            <span class="dp-section-icon">🗃️</span>
            <div>
              <h2>文章归纳</h2>
              <p>按时间线归档的文章列表</p>
            </div>
          </div>

          <div v-if="archive.length" class="dp-accordion">
            <div v-for="year in archive" :key="year.year" class="dp-year">
              <button
                type="button"
                class="dp-year-head"
                :aria-expanded="openYears.has(year.year)"
                @click="toggleYear(year.year)"
              >
                <span class="dp-year-title">
                  <span class="dp-year-num">{{ year.year }} 年</span>
                  <span class="dp-year-meta">
                    共 <b>{{ year.total }}</b> 篇 · 约 <b>{{ (year.wordCount / 1000).toFixed(2) }}K</b> 字
                  </span>
                </span>
                <span class="dp-year-arrow" :class="{ 'is-open': openYears.has(year.year) }">⌄</span>
              </button>

              <div v-show="openYears.has(year.year)" class="dp-months">
                <div v-for="m in year.months" :key="m.month" class="dp-month">
                  <span class="dp-month-line" />
                  <span class="dp-month-dot" />
                  <div class="dp-month-box">
                    <div class="dp-month-head">
                      <span class="dp-month-name">{{ m.month }}月</span>
                      <span class="dp-month-meta">{{ m.total }} 篇 · {{ (m.wordCount / 1000).toFixed(2) }}K 字</span>
                    </div>
                    <ul class="dp-article-list">
                      <li v-for="a in m.list" :key="a.id">
                        <NuxtLink :to="`/article/${a.id}`" class="dp-article">
                          <span class="dp-article-main">
                            <span class="dp-article-date">{{ a.dateLabel }}</span>
                            {{ a.title }}
                          </span>
                          <span class="dp-article-view">👁 {{ a.viewCount }}</span>
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="dp-panel-empty">还没有文章</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getSiteStats, type SiteStats } from '~/api/website'
import { getArticleList } from '~/api/article'
import { getApprovedFriendLinks } from '~/api/friendLink'

useHead({ title: '数据统计' })

/** 归档最多拉取的文章数，与归档页保持一致 */
const ARCHIVE_FETCH_LIMIT = 200

const EMPTY: SiteStats = {
  overview: {
    articleCount: 0,
    wordCount: 0,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    categoryCount: 0,
    tagCount: 0,
    runningDays: 0
  },
  categories: [],
  tags: [],
  trend: []
}

// 三个接口互不依赖，并行取，避免串行等待
const { data: bundle } = await useAsyncData('data-page', async () => {
  const [statsRes, listRes, linkRes] = await Promise.all([
    getSiteStats(),
    getArticleList({ page: 1, limit: ARCHIVE_FETCH_LIMIT }),
    getApprovedFriendLinks()
  ])
  return { statsRes, listRes, linkRes }
})

/** 后端各接口的列表字段名不统一（items/records/list），这里统一取出来 */
const pick = (res: any, ...keys: string[]): any[] => {
  if (res?.code !== 200) return []
  for (const k of keys) {
    if (Array.isArray(res.data?.[k])) return res.data[k]
  }
  return Array.isArray(res.data) ? res.data : []
}

const stats = computed<SiteStats>(() => {
  const res = bundle.value?.statsRes as any
  return res?.code === 200 && res.data ? { ...EMPTY, ...res.data } : EMPTY
})

const categories = computed(() => stats.value.categories.filter((c) => c.value > 0))
const tags = computed(() => stats.value.tags)
const linkCount = computed(() => pick(bundle.value?.linkRes, 'records', 'list', 'items').length)

const statCards = computed(() => {
  const o = stats.value.overview
  return [
    { title: '文章总计', value: o.articleCount, icon: '📝', tone: 'sky' },
    { title: '评论总计', value: o.commentCount, icon: '💬', tone: 'amber' },
    { title: '分类总计', value: o.categoryCount, icon: '🗂️', tone: 'emerald' },
    { title: '友链总计', value: linkCount.value, icon: '🔗', tone: 'rose' }
  ]
})

// ---------- 归档分组 ----------
interface ArchiveArticle {
  id: number
  title: string
  dateLabel: string
  viewCount: number
}
interface MonthGroup {
  month: number
  total: number
  wordCount: number
  list: ArchiveArticle[]
}
interface YearGroup {
  year: number
  total: number
  wordCount: number
  months: MonthGroup[]
}

const pad2 = (n: number) => String(n).padStart(2, '0')

const archive = computed<YearGroup[]>(() => {
  const items = pick(bundle.value?.listRes, 'items', 'records', 'list')
  const byYear = new Map<number, YearGroup>()

  for (const a of items) {
    const d = new Date(a.createTime)
    if (Number.isNaN(d.getTime())) continue
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    // 字数按正文长度估算，与原版口径一致
    const wordCount = (a.content || '').length

    let y = byYear.get(year)
    if (!y) {
      y = { year, total: 0, wordCount: 0, months: [] }
      byYear.set(year, y)
    }
    let m = y.months.find((x) => x.month === month)
    if (!m) {
      m = { month, total: 0, wordCount: 0, list: [] }
      y.months.push(m)
    }

    m.list.push({
      id: a.id,
      title: a.title,
      dateLabel: `${pad2(month)}-${pad2(d.getDate())}`,
      viewCount: a.viewCount ?? 0
    })
    m.total++
    m.wordCount += wordCount
    y.total++
    y.wordCount += wordCount
  }

  const years = [...byYear.values()].sort((a, b) => b.year - a.year)
  for (const y of years) {
    y.months.sort((a, b) => b.month - a.month)
    for (const m of y.months) m.list.sort((a, b) => b.dateLabel.localeCompare(a.dateLabel))
  }
  return years
})

/** 默认展开最新一年，其余折叠 */
const openYears = ref(new Set<number>())
const toggleYear = (year: number) => {
  // 换新 Set 而不是原地增删：Set 成员变更不会触发模板重新求值
  const next = new Set(openYears.value)
  next.has(year) ? next.delete(year) : next.add(year)
  openYears.value = next
}

// ---------- 分类饼图 ----------
const pieEl = ref<HTMLElement | null>(null)
let chart: any = null
let onResize: (() => void) | null = null

const PIE_COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899']

onMounted(async () => {
  if (archive.value.length) openYears.value = new Set([archive.value[0].year])

  if (!pieEl.value || !categories.value.length) return
  const echarts = await import('echarts')
  chart = echarts.init(pieEl.value)
  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(0,0,0,0.08)',
      borderWidth: 1,
      textStyle: { color: '#1e293b' }
    },
    legend: { show: false },
    color: PIE_COLORS,
    series: [
      {
        name: '数量统计',
        type: 'pie',
        // 环形而非实心饼，与原版一致
        radius: ['40%', '75%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        padAngle: 3,
        itemStyle: { borderRadius: 8, borderWidth: 0 },
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 12 },
        labelLine: { show: true, length: 8, length2: 6 },
        emphasis: {
          itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.2)' },
          label: { show: true }
        },
        data: categories.value.map((c) => ({ name: c.name, value: c.value }))
      }
    ]
  })

  onResize = () => chart?.resize()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (onResize) window.removeEventListener('resize', onResize)
  chart?.dispose?.()
  chart = null
})
</script>

<style scoped>
.dp-page {
  position: relative;
  min-height: 100vh;
}

/* ---------- 固定背景 ---------- */
.dp-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.dp-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
  background-size: 64px 64px;
}

.dp-orb {
  position: absolute;
  border-radius: 50%;
}

.dp-orb-1 {
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 800px;
  background: rgba(249, 115, 22, 0.06);
  filter: blur(120px);
}

.dp-orb-2 {
  top: 25%;
  right: 0;
  width: 384px;
  height: 384px;
  background: rgba(167, 139, 250, 0.08);
  filter: blur(80px);
}

.dp-orb-3 {
  bottom: 25%;
  left: 0;
  width: 320px;
  height: 320px;
  background: rgba(34, 211, 238, 0.08);
  filter: blur(80px);
}

/* ---------- Hero ---------- */
.dp-hero {
  position: relative;
  height: 60vh;
  min-height: 340px;
  background-image: url('/images/banner/5.jpg');
  background-size: cover;
  background-position: center;
}

.dp-hero-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.45) 100%);
}

.dp-hero-text {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
}

.dp-hero-text h1 {
  margin: 0;
  font-size: clamp(24px, 4vw, 40px);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
}

.dp-hero-text p {
  margin: 10px 0 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

/* ---------- 卡片容器 ---------- */
.dp-wrap {
  position: relative;
  z-index: 10;
  width: 92%;
  max-width: 1152px;
  margin: -48px auto 64px;
}

.dp-card {
  padding: clamp(24px, 4vw, 48px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.1);
}

.dark .dp-card {
  border-color: rgba(51, 65, 85, 0.5);
  background: rgba(24, 24, 27, 0.95);
}

.dp-section + .dp-section {
  margin-top: 48px;
}

.dp-section-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.dp-section-icon {
  font-size: 30px;
  line-height: 1;
}

.dp-section-head h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.dp-section-head p {
  margin: 2px 0 0;
  font-size: 13px;
  color: #64748b;
}

.dark .dp-section-head h2 {
  color: #f1f5f9;
}

.dark .dp-section-head p {
  color: #94a3b8;
}

/* ---------- 统计卡片 ---------- */
.dp-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.dp-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid;
  border-radius: 16px;
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}

.dp-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.dp-stat-icon {
  font-size: 34px;
  line-height: 1;
}

.dp-stat-num {
  text-align: right;
}

.dp-stat-value {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.dp-stat-label {
  margin: 2px 0 0;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.9;
}

.dp-stat.is-sky {
  border-color: #bae6fd;
  background: #f0f9ff;
  color: #0284c7;
}

.dp-stat.is-amber {
  border-color: #fde68a;
  background: #fffbeb;
  color: #d97706;
}

.dp-stat.is-emerald {
  border-color: #a7f3d0;
  background: #ecfdf5;
  color: #059669;
}

.dp-stat.is-rose {
  border-color: #fecdd3;
  background: #fff1f2;
  color: #e11d48;
}

.dark .dp-stat.is-sky {
  border-color: rgba(14, 165, 233, 0.3);
  background: rgba(14, 165, 233, 0.1);
  color: #38bdf8;
}

.dark .dp-stat.is-amber {
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
}

.dark .dp-stat.is-emerald {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
}

.dark .dp-stat.is-rose {
  border-color: rgba(244, 63, 94, 0.3);
  background: rgba(244, 63, 94, 0.1);
  color: #fb7185;
}

/* ---------- 两栏面板 ---------- */
.dp-two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
}

.dp-panel {
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.5);
}

.dark .dp-panel {
  border-color: rgba(51, 65, 85, 0.5);
  background: rgba(30, 41, 59, 0.3);
}

.dp-panel-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.dp-panel-icon {
  font-size: 24px;
  line-height: 1;
}

.dp-panel-head h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
}

.dp-panel-head p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #64748b;
}

.dark .dp-panel-head h3 {
  color: #f1f5f9;
}

.dp-chart {
  width: 100%;
  min-width: 260px;
  height: 280px;
}

.dp-panel-empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

/* ---------- 标签墙 ---------- */
.dp-tags {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 4px;
}

.dp-tag {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: default;
  transition: box-shadow 0.2s ease-out;
}

.dp-tag:hover {
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.1);
}

.dp-tag.tone-0 {
  background: #e0f2fe;
  color: #0369a1;
}
.dp-tag.tone-1 {
  background: #ede9fe;
  color: #6d28d9;
}
.dp-tag.tone-2 {
  background: #d1fae5;
  color: #047857;
}
.dp-tag.tone-3 {
  background: #fef3c7;
  color: #b45309;
}
.dp-tag.tone-4 {
  background: #ffe4e6;
  color: #be123c;
}
.dp-tag.tone-5 {
  background: #e0e7ff;
  color: #4338ca;
}

.dark .dp-tag {
  background: rgba(148, 163, 184, 0.14);
  color: #cbd5e1;
}

/* ---------- 归档手风琴 ---------- */
.dp-year {
  border-bottom: 1px solid #e2e8f0;
}

.dark .dp-year {
  border-color: rgba(51, 65, 85, 0.5);
}

.dp-year-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 18px 4px;
  border: 0;
  background: none;
  cursor: pointer;
  text-align: left;
}

.dp-year-title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 16px;
}

.dp-year-num {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.dark .dp-year-num {
  color: #f1f5f9;
}

.dp-year-meta {
  font-size: 13px;
  color: #64748b;
}

.dp-year-meta b {
  color: var(--color-primary, #f97316);
  font-weight: 600;
}

.dp-year-arrow {
  font-size: 20px;
  color: #94a3b8;
  transition: transform 0.3s ease-out;
}

.dp-year-arrow.is-open {
  transform: rotate(180deg);
}

.dp-months {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 4px 0 24px 8px;
}

.dp-month {
  position: relative;
  padding-left: 24px;
}

.dp-month-line {
  position: absolute;
  left: 0;
  top: 6px;
  width: 1px;
  height: calc(100% - 8px);
  background: linear-gradient(to bottom, rgba(249, 115, 22, 0.6), #e2e8f0);
}

.dp-month-dot {
  position: absolute;
  left: -4px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary, #f97316);
  box-shadow: 0 0 0 2px #fff;
}

.dark .dp-month-dot {
  box-shadow: 0 0 0 2px #18181b;
}

.dp-month-box {
  padding: 16px;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  background: rgba(248, 250, 252, 0.8);
}

.dark .dp-month-box {
  border-color: rgba(51, 65, 85, 0.5);
  background: rgba(30, 41, 59, 0.3);
}

.dp-month-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.dp-month-name {
  font-size: 17px;
  font-weight: 600;
  color: #334155;
}

.dark .dp-month-name {
  color: #e2e8f0;
}

.dp-month-meta {
  font-size: 13px;
  color: #64748b;
}

.dp-article-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.dp-article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 12px;
  border-radius: 8px;
  color: #475569;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.dp-article:hover {
  background: rgba(241, 245, 249, 0.8);
  color: var(--color-primary, #f97316);
}

.dark .dp-article {
  color: #cbd5e1;
}

.dark .dp-article:hover {
  background: rgba(51, 65, 85, 0.5);
}

.dp-article-main {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dp-article-date {
  margin-right: 8px;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: #94a3b8;
}

.dp-article-view {
  flex: none;
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 900px) {
  .dp-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dp-two-col {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 520px) {
  .dp-stat-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .dp-article-view {
    display: none;
  }
}
</style>

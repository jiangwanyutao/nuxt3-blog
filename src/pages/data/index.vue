<template>
  <div class="ds-page">
    <header class="ds-hero">
      <h1 class="ds-title">数据看板</h1>
      <p class="ds-subtitle">这个博客的全部数字</p>
    </header>

    <!-- 概览数字 -->
    <section class="ds-grid">
      <div v-for="card in cards" :key="card.label" class="ds-card">
        <span class="ds-value">{{ card.display }}</span>
        <span class="ds-label">{{ card.label }}</span>
      </div>
    </section>

    <!-- 图表 -->
    <ClientOnly>
      <section class="ds-charts">
        <div class="ds-chart-box">
          <h3 class="ds-chart-title">近 12 个月发文</h3>
          <div ref="trendRef" class="ds-chart" />
          <p v-if="!hasTrend" class="ds-chart-empty">这段时间还没有发布文章</p>
        </div>

        <div class="ds-chart-box">
          <h3 class="ds-chart-title">分类分布</h3>
          <div ref="categoryRef" class="ds-chart" />
          <p v-if="!stats.categories.length" class="ds-chart-empty">暂无分类数据</p>
        </div>
      </section>
    </ClientOnly>

    <!-- 标签词云 -->
    <section v-if="stats.tags.length" class="ds-tags-box">
      <h3 class="ds-chart-title">标签云</h3>
      <div class="ds-tags">
        <NuxtLink
          v-for="tag in stats.tags"
          :key="tag.name"
          to="/tags"
          class="ds-tag"
          :style="tagStyle(tag.value)"
        >
          {{ tag.name }}
          <sup>{{ tag.value }}</sup>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getSiteStats, type SiteStats } from '~/api/website'

useHead({ title: '数据看板' })

/** 标签云字号区间（px） */
const TAG_FONT_MIN = 13
const TAG_FONT_MAX = 26

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

const { data: raw } = await useAsyncData('site-stats', () => getSiteStats())

const stats = computed<SiteStats>(() => {
  const res = raw.value as any
  return res?.code === 200 && res.data ? { ...EMPTY, ...res.data } : EMPTY
})

/** 万以上折算成「x.x 万」，避免大数字撑破卡片 */
const formatNumber = (n: number) => (n >= 10000 ? `${(n / 10000).toFixed(1)} 万` : String(n))

const cards = computed(() => {
  const o = stats.value.overview
  return [
    { label: '篇文章', display: formatNumber(o.articleCount) },
    { label: '总字数', display: formatNumber(o.wordCount) },
    { label: '总浏览', display: formatNumber(o.viewCount) },
    { label: '获赞数', display: formatNumber(o.likeCount) },
    { label: '条评论', display: formatNumber(o.commentCount) },
    { label: '个分类', display: formatNumber(o.categoryCount) },
    { label: '个标签', display: formatNumber(o.tagCount) },
    { label: '天运行', display: formatNumber(o.runningDays) }
  ]
})

const hasTrend = computed(() => stats.value.trend.some((t) => t.value > 0))

const maxTagCount = computed(() => Math.max(1, ...stats.value.tags.map((t) => t.value)))

const tagStyle = (value: number) => {
  const ratio = value / maxTagCount.value
  return {
    fontSize: `${TAG_FONT_MIN + ratio * (TAG_FONT_MAX - TAG_FONT_MIN)}px`,
    opacity: String(0.62 + ratio * 0.38)
  }
}

// ---- echarts（仅客户端，动态引入，与归档页保持一致的用法） ----
const trendRef = ref<HTMLElement | null>(null)
const categoryRef = ref<HTMLElement | null>(null)
let charts: any[] = []
let onResize: (() => void) | null = null

const trendOption = () => ({
  grid: { left: 38, right: 16, top: 22, bottom: 28 },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: stats.value.trend.map((t) => t.month.slice(2)),
    axisLine: { lineStyle: { color: '#ddd5ca' } },
    axisLabel: { color: '#a49b8f', fontSize: 11 }
  },
  yAxis: {
    type: 'value',
    minInterval: 1,
    splitLine: { lineStyle: { color: '#f0ece6' } },
    axisLabel: { color: '#a49b8f', fontSize: 11 }
  },
  series: [
    {
      type: 'line',
      smooth: true,
      symbolSize: 7,
      data: stats.value.trend.map((t) => t.value),
      itemStyle: { color: '#e88b8f' },
      areaStyle: { color: 'rgba(232,139,143,0.16)' }
    }
  ]
})

const categoryOption = () => ({
  grid: { left: 10, right: 30, top: 10, bottom: 10, containLabel: true },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: {
    type: 'value',
    minInterval: 1,
    splitLine: { lineStyle: { color: '#f0ece6' } },
    axisLabel: { color: '#a49b8f', fontSize: 11 }
  },
  yAxis: {
    type: 'category',
    // 条形图自下而上绘制，反转后最大值才在顶部
    data: [...stats.value.categories].reverse().map((c) => c.name),
    axisLine: { lineStyle: { color: '#ddd5ca' } },
    axisLabel: { color: '#8a8175', fontSize: 12 }
  },
  series: [
    {
      type: 'bar',
      barWidth: 14,
      itemStyle: { color: '#9c8878', borderRadius: [0, 7, 7, 0] },
      data: [...stats.value.categories].reverse().map((c) => c.value)
    }
  ]
})

onMounted(async () => {
  const echarts = await import('echarts')

  const pairs: Array<[HTMLElement | null, () => any, boolean]> = [
    [trendRef.value, trendOption, hasTrend.value],
    [categoryRef.value, categoryOption, stats.value.categories.length > 0]
  ]

  for (const [el, option, shouldRender] of pairs) {
    if (!el || !shouldRender) continue
    const chart = echarts.init(el)
    chart.setOption(option())
    charts.push(chart)
  }

  onResize = () => charts.forEach((c) => c.resize())
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (onResize) window.removeEventListener('resize', onResize)
  charts.forEach((c) => c.dispose())
  charts = []
})
</script>

<style scoped>
.ds-page {
  min-height: 100vh;
  padding: 0 clamp(16px, 4vw, 56px) 90px;
}

.ds-hero {
  padding: 90px 0 36px;
  text-align: center;
}

.ds-title {
  margin: 0 0 14px;
  font-size: clamp(36px, 6vw, 58px);
  font-weight: 700;
  letter-spacing: 3px;
  background: linear-gradient(90deg, #9c8878, #e88b8f, #c9a227);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ds-subtitle {
  margin: 0;
  font-size: 15px;
  letter-spacing: 4px;
  color: #a49b8f;
}

.ds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  max-width: 1100px;
  margin: 0 auto 36px;
}

.ds-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 22px 14px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dark .ds-card {
  background: #26262a;
}

.ds-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 26px rgba(156, 136, 120, 0.18);
}

.ds-value {
  font-size: 26px;
  font-weight: 700;
  color: #9c8878;
}

.ds-label {
  font-size: 12.5px;
  letter-spacing: 1px;
  color: #a49b8f;
}

.ds-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto 24px;
}

.ds-chart-box,
.ds-tags-box {
  padding: 20px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.06);
}

.dark .ds-chart-box,
.dark .ds-tags-box {
  background: #26262a;
}

.ds-tags-box {
  max-width: 1100px;
  margin: 0 auto;
}

.ds-chart-title {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 600;
  color: #9c8878;
}

.ds-chart {
  width: 100%;
  height: 260px;
}

.ds-chart-empty {
  margin: -230px 0 0;
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #b0a698;
}

.ds-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px 16px;
}

.ds-tag {
  color: #8a8175;
  text-decoration: none;
  line-height: 1.5;
  transition: color 0.25s ease, transform 0.25s ease;
}

.ds-tag:hover {
  color: #e88b8f;
  transform: translateY(-2px);
}

.ds-tag sup {
  margin-left: 2px;
  font-size: 10px;
  color: #c3bbb0;
}
</style>

<template>
  <section v-if="articles.length" class="side-card">
    <h3 class="side-title">
      <Icon name="material-symbols:local-fire-department-outline" size="17" />
      热门文章
    </h3>

    <ul class="hot-list">
      <li v-for="(item, index) in articles" :key="item.id">
        <NuxtLink :to="`/article/${item.id}`" class="hot-item">
          <span class="hot-rank" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
          <span class="hot-info">
            <span class="hot-name">{{ item.title }}</span>
            <span class="hot-meta">👁 {{ item.viewCount || 0 }}</span>
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getPopularArticles } from '~/api/article'

const props = withDefaults(defineProps<{ excludeId?: number; limit?: number }>(), { limit: 6 })

interface HotArticle {
  id: number
  title: string
  viewCount?: number
}

// 多取一条，便于排除当前文章后仍能凑满
const { data: raw } = await useAsyncData(`sidebar-hot-${props.excludeId ?? 'all'}`, () =>
  getPopularArticles(props.limit + 1)
)

const articles = computed<HotArticle[]>(() => {
  const res = raw.value as any
  if (res?.code !== 200) return []
  const list = Array.isArray(res.data) ? res.data : res.data?.items || []
  return list
    .filter((a: HotArticle) => Number(a.id) !== Number(props.excludeId))
    .slice(0, props.limit)
})
</script>

<style scoped>
.side-card {
  padding: 18px 18px 16px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.06);
}

.dark .side-card {
  background: #26262a;
}

.side-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 600;
  color: #9c8878;
}

.hot-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.hot-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 7px 0;
  text-decoration: none;
}

.hot-rank {
  flex-shrink: 0;
  width: 19px;
  height: 19px;
  border-radius: 6px;
  background: #ece6de;
  font-size: 12px;
  line-height: 19px;
  text-align: center;
  color: #8a8175;
}

.dark .hot-rank {
  background: #35353b;
  color: #aaa;
}

/* 前三名用暖色区分，其余保持中性 */
.hot-rank.rank-1 {
  background: #e88b8f;
  color: #fff;
}

.hot-rank.rank-2 {
  background: #efb08a;
  color: #fff;
}

.hot-rank.rank-3 {
  background: #e8c98b;
  color: #fff;
}

.hot-info {
  min-width: 0;
}

.hot-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13.5px;
  line-height: 1.6;
  color: #4a4a4a;
  transition: color 0.25s ease;
}

.dark .hot-name {
  color: #d0d0d4;
}

.hot-item:hover .hot-name {
  color: #e88b8f;
}

.hot-meta {
  display: block;
  margin-top: 3px;
  font-size: 11.5px;
  color: #b0a698;
}
</style>

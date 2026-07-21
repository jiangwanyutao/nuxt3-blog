<template>
  <section v-if="articles.length" class="related-section">
    <h3 class="related-title">
      <Icon name="material-symbols:auto-awesome-outline" size="18" />
      {{ isFallback ? '热门推荐' : '相关文章' }}
    </h3>

    <div class="related-grid">
      <NuxtLink
        v-for="item in articles"
        :key="item.id"
        :to="`/article/${item.id}`"
        class="related-card"
      >
        <div class="related-cover">
          <img :src="item.cover || DEFAULT_COVER" :alt="item.title" loading="lazy" />
        </div>
        <div class="related-info">
          <p class="related-name">{{ item.title }}</p>
          <p class="related-date">{{ formatDate(item.createTime) }}</p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getRelatedArticles, getPopularArticles } from '~/api/article'
import { useDateFormat } from '@vueuse/core'

const props = defineProps<{ articleId: number }>()

/** 推荐位展示数量 */
const RELATED_LIMIT = 4
const DEFAULT_COVER = '/images/banner/3.jpg'

interface RelatedItem {
  id: number
  title: string
  cover?: string
  createTime?: string
}

const pickList = (res: any): RelatedItem[] => {
  if (res?.code !== 200) return []
  const data = res.data
  return Array.isArray(data) ? data : data?.items || []
}

// 相关文章为空时回退到热门文章，避免推荐位空着
const { data: raw } = await useAsyncData(
  `article-related-${props.articleId}`,
  async () => {
    const related = await getRelatedArticles(props.articleId, RELATED_LIMIT)
    const list = pickList(related)
    if (list.length) return { list, fallback: false }

    const popular = await getPopularArticles(RELATED_LIMIT + 1)
    return { list: pickList(popular), fallback: true }
  }
)

const isFallback = computed(() => (raw.value as any)?.fallback ?? false)

const articles = computed<RelatedItem[]>(() => {
  const list = ((raw.value as any)?.list || []) as RelatedItem[]
  // 排除当前文章自身，并截断到展示数量
  return list.filter((a) => Number(a.id) !== Number(props.articleId)).slice(0, RELATED_LIMIT)
})

const formatDate = (date?: string) => (date ? useDateFormat(date, 'YYYY-MM-DD').value : '')
</script>

<style scoped>
.related-section {
  margin-top: 32px;
}

.related-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 18px;
  font-size: 17px;
  font-weight: 600;
  color: #9c8878;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 18px;
}

.related-card {
  display: block;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  text-decoration: none;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dark .related-card {
  background: #26262a;
}

.related-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 28px rgba(156, 136, 120, 0.22);
}

.related-cover {
  height: 110px;
  overflow: hidden;
}

.related-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.related-card:hover .related-cover img {
  transform: scale(1.08);
}

.related-info {
  padding: 12px 14px 14px;
}

.related-name {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: #3a3a3a;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dark .related-name {
  color: #ddd;
}

.related-card:hover .related-name {
  color: #9c8878;
}

.related-date {
  margin: 0;
  font-size: 12px;
  color: #b0a698;
}
</style>

<template>
  <div class="tags-page">
    <header class="tags-hero">
      <h1 class="tags-title">标签墙</h1>
      <p class="tags-subtitle">共 {{ tags.length }} 个标签，点击标签搜索相关文章</p>
    </header>

    <div class="tag-cloud">
      <button
        v-for="(tag, i) in tags"
        :key="tag.id"
        class="tag-item"
        :style="tagStyle(tag, i)"
        @click="searchTag(tag.name)"
      >
        {{ tag.name }}
        <span v-if="tag.useCount > 0" class="tag-count">{{ tag.useCount }}</span>
      </button>
    </div>

    <p v-if="!tags.length" class="tags-empty">暂无标签</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getTags } from '~/api/article'
import { useSearchStore } from '~/stores/searchStore'

interface TagItem {
  id: number
  name: string
  color?: string
  useCount: number
}

const searchStore = useSearchStore()

const { data: tagsRaw } = await useAsyncData('all-tags', () => getTags())

const tags = computed<TagItem[]>(() => {
  const res = tagsRaw.value as any
  return res?.code === 200 ? res.data || [] : []
})

const maxUse = computed(() => Math.max(1, ...tags.value.map((t) => t.useCount)))

/** 字号按使用次数在 14-30px 间缩放，颜色取标签自带色 */
const tagStyle = (tag: TagItem, index: number) => {
  const ratio = tag.useCount / maxUse.value
  const fontSize = 14 + ratio * 16
  const color = tag.color || '#9c8878'
  return {
    fontSize: `${fontSize.toFixed(1)}px`,
    color,
    borderColor: `${color}55`,
    backgroundColor: `${color}14`,
    animationDelay: `${(index % 12) * 0.25}s`
  }
}

const searchTag = (name: string) => {
  searchStore.openWith(name)
}

useSeoMeta({
  title: '标签墙 - 江晚正愁余 Blog',
  description: '博客全部文章标签'
})
</script>

<style scoped>
.tags-page {
  min-height: 100vh;
  padding: 120px 24px 80px;
  max-width: 960px;
  margin: 0 auto;
}

.tags-hero {
  text-align: center;
  margin-bottom: 48px;
}

.tags-title {
  font-size: 40px;
  font-weight: 700;
  margin: 0 0 12px;
  background: linear-gradient(120deg, #e89b8f, #9c8878);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.tags-subtitle {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 14px 18px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border: 1px solid;
  border-radius: 999px;
  cursor: pointer;
  line-height: 1.4;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: tag-float 4s ease-in-out infinite;
}

.tag-item:hover {
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation-play-state: paused;
}

.tag-count {
  font-size: 0.75em;
  opacity: 0.7;
}

.tags-empty {
  text-align: center;
  color: #999;
  padding: 60px 0;
}

@keyframes tag-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
</style>

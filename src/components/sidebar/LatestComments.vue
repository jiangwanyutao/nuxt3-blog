<template>
  <section v-if="comments.length" class="side-card">
    <h3 class="side-title">
      <Icon name="material-symbols:mode-comment-outline" size="16" />
      最新评论
    </h3>

    <ul class="cm-list">
      <li v-for="item in comments" :key="item.id" class="cm-item">
        <NuxtLink :to="`/article/${item.articleId}`" class="cm-link">
          <img
            class="cm-avatar"
            :src="item.guestAvatar || FALLBACK_AVATAR"
            :alt="item.guestName || '匿名'"
            loading="lazy"
            @error="onAvatarError"
          />

          <span class="cm-body">
            <span class="cm-head">
              <span class="cm-name">{{ item.guestName || '匿名' }}</span>
              <span class="cm-time">{{ formatRelativeTime(item.createTime) }}</span>
            </span>
            <span class="cm-content">{{ item.content }}</span>
            <span class="cm-from">《{{ item.articleTitle }}》</span>
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getRecentComments } from '~/api/comment'
import { formatRelativeTime } from '~/composables/useRelativeTime'

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 5 })

/** 头像取不到时兜底，避免出现破图 */
const FALLBACK_AVATAR = 'https://www.gravatar.com/avatar/0?d=identicon&s=40'

interface RecentComment {
  id: number
  articleId: number
  articleTitle: string
  content: string
  guestName?: string
  guestAvatar?: string
  createTime: string
}

const { data: raw } = await useAsyncData('sidebar-recent-comments', () =>
  getRecentComments(props.limit)
)

const comments = computed<RecentComment[]>(() => {
  const res = raw.value as any
  return res?.code === 200 ? res.data?.records || [] : []
})

const onAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img.src !== FALLBACK_AVATAR) img.src = FALLBACK_AVATAR
}
</script>

<style scoped>
.side-card {
  padding: 18px 18px 14px;
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

.cm-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.cm-item + .cm-item {
  border-top: 1px solid #f0ece6;
}

.dark .cm-item + .cm-item {
  border-top-color: #33333a;
}

.cm-link {
  display: flex;
  gap: 10px;
  padding: 11px 0;
  text-decoration: none;
}

.cm-avatar {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0ece6;
}

.cm-body {
  min-width: 0;
  flex: 1;
}

.cm-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.cm-name {
  font-size: 13px;
  font-weight: 600;
  color: #5b5348;
}

.dark .cm-name {
  color: #cfcfd4;
}

.cm-time {
  flex-shrink: 0;
  font-size: 11px;
  color: #b8b0a6;
}

.cm-content {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 3px;
  font-size: 12.5px;
  line-height: 1.65;
  color: #6f6659;
  word-break: break-word;
}

.dark .cm-content {
  color: #a2a2a8;
}

.cm-from {
  display: block;
  margin-top: 4px;
  font-size: 11.5px;
  color: #b0a698;
  transition: color 0.25s ease;
}

.cm-link:hover .cm-from {
  color: #e88b8f;
}
</style>

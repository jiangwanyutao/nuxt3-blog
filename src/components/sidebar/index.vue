<template>
  <div class="sidebar">
    <!-- 作者卡 -->
    <section class="side-card author-card">
      <img v-if="avatar" class="author-avatar" :src="avatar" :alt="nickname" @error="avatarBroken = true" />
      <span v-else class="author-avatar author-avatar-text">{{ nickname.slice(0, 1) }}</span>

      <p class="author-name">{{ nickname }}</p>
      <p v-if="slogan" class="author-slogan">{{ slogan }}</p>

      <div class="author-actions">
        <NuxtLink to="/about" class="author-btn">关于我</NuxtLink>
        <NuxtLink to="/friendShip" class="author-btn ghost">友链</NuxtLink>
      </div>

      <ClientOnly>
        <p class="author-runtime">
          <CommonRunTime />
        </p>
      </ClientOnly>
    </section>

    <SidebarHotArticles :exclude-id="articleId" />

    <SidebarLatestComments />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBlogStore } from '~/stores/blogStore'

// 站点配置里没有头像字段，作者信息由文章页从 article.user 传入
const props = defineProps<{
  articleId?: number
  authorName?: string
  authorAvatar?: string
}>()

const blogStore = useBlogStore()
const avatarBroken = ref(false)

const nickname = computed(() => props.authorName || blogStore.blogConfig?.title || '江晚正愁余')
const slogan = computed(() => blogStore.blogConfig?.slogan || '')
// 没有头像或加载失败时降级为文字头像，不引用任何可能 404 的占位图
const avatar = computed(() => (avatarBroken.value ? '' : props.authorAvatar || ''))
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.side-card {
  padding: 18px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.06);
}

.dark .side-card {
  background: #26262a;
}

.author-card {
  text-align: center;
}

.author-avatar {
  display: inline-block;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0ece6;
}

.author-avatar-text {
  background: linear-gradient(135deg, #f0a6a9, #e07d82);
  font-size: 28px;
  line-height: 68px;
  color: #fff;
}

.author-name {
  margin: 10px 0 0;
  font-size: 15px;
  font-weight: 600;
  color: #4a4a4a;
}

.dark .author-name {
  color: #e0e0e4;
}

.author-slogan {
  margin: 6px 0 0;
  font-size: 12.5px;
  line-height: 1.7;
  color: #a49b8f;
}

.author-actions {
  display: flex;
  justify-content: center;
  gap: 9px;
  margin-top: 14px;
}

.author-btn {
  padding: 5px 16px;
  border-radius: 999px;
  background: #e88b8f;
  font-size: 12.5px;
  color: #fff;
  text-decoration: none;
  transition: background 0.25s ease;
}

.author-btn:hover {
  background: #dd7a7f;
}

.author-btn.ghost {
  border: 1px solid #ece6de;
  background: transparent;
  color: #8a8175;
}

.dark .author-btn.ghost {
  border-color: #3a3a40;
  color: #aaa;
}

.author-btn.ghost:hover {
  border-color: #e88b8f;
  color: #e88b8f;
}

.author-runtime {
  margin: 14px 0 0;
  font-size: 11.5px;
  color: #b0a698;
}
</style>

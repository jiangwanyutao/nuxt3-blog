<script setup lang="ts">
import type { Article } from '@/types/article'

interface Props {
  item: Article
}

defineProps<Props>()

const router = useRouter()

const createTime = computed(() => (time: string) => useDateFormat(time, 'YYYY-MM-DD').value)
</script>

<template>
  <article class="article-card">
    <a :href="`/article/${item.id}`" class="article-link">
      <div class="article-image">
        <img 
          :src="item.cover || item.articleCover || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'" 
          :alt="item.title || item.articleTitle" 
        />
        <div v-if="item.isTop" class="top-badge">
          <Icon name="ant-design:pushpin-filled" size="14" />
          <span>置顶</span>
        </div>
      </div>
      <div class="article-content">
        <h2 class="article-title">{{ item.title || item.articleTitle }}</h2>
        <p class="article-excerpt">{{ item.summary || item.articleContent || '暂无摘要' }}</p>
        <div class="article-meta">
          <span class="meta-item">
            <Icon name="mingcute:time-fill" size="14" />
            {{ createTime(item.createTime) }}
          </span>
          <span class="meta-item">
            <Icon name="mdi:eye" size="14" />
            {{ item.viewCount || 0 }}
          </span>
          <span class="meta-item">
            <Icon name="fe:comment" size="14" />
            {{ item.commentCount || 0 }}条
          </span>
          <button class="like-btn" @click.prevent="() => {}">
            <Icon name="mdi:heart-outline" size="16" />
          </button>
        </div>
      </div>
    </a>
  </article>
</template>

<style scoped>
.article-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(232, 180, 168, 0.2);
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.article-image {
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: #f5f3f0;
  position: relative;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.08);
}

.top-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #f5d4cc 0%, #e8b4a8 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(232, 180, 168, 0.3);
}

.article-content {
  padding: 24px;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.article-card:hover .article-title {
  color: #e8b4a8;
}

.article-excerpt {
  font-size: 14px;
  color: #6a6a6a;
  line-height: 1.7;
  margin: 0 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #f5f3f0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #9a9a9a;
}

.like-btn {
  margin-left: auto;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #faf9f7;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #e8b4a8;
}

.like-btn:hover {
  background: #e8b4a8;
  color: white;
  transform: scale(1.1);
}
</style>

<template>
  <div class="article-list-page">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">阅读</h2>
        <span class="article-count">{{ totalCount }}篇</span>
      </div>
      <p class="sidebar-description">所谓旁观者清，也有站着说话不嫌腰疼的意思。</p>
      
      <nav class="sidebar-nav">
        <a 
          href="#"
          :class="['nav-item', { active: !selectedCategory }]"
          @click.prevent="selectCategory('')"
        >
          <div class="nav-content">
            <span class="nav-icon">📚</span>
            <span class="nav-label">全部文章</span>
          </div>
          <span class="nav-count">{{ totalCount }}</span>
        </a>
        <a 
          v-for="category in categories" 
          :key="category.id"
          href="#"
          :class="['nav-item', { active: selectedCategory === category.name }]"
          @click.prevent="selectCategory(category.name)"
        >
          <div class="nav-content">
            <span class="nav-icon">{{ getCategoryIcon(category.name) }}</span>
            <span class="nav-label">{{ category.name }}</span>
          </div>
          <span class="nav-count">{{ category.articleCount || 0 }}</span>
        </a>
      </nav>

      <!-- 分类分页 -->
      <div class="category-pagination" v-if="categoryTotalPages > 1">
        <button 
          class="category-page-btn"
          :class="{ active: categoryPage === page }"
          v-for="page in categoryTotalPages"
          :key="page"
          @click="categoryPage = page"
        >
          {{ page }}
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- 布局切换（网格 / 瀑布流） -->
      <div class="layout-toolbar">
        <button
          class="layout-btn"
          :class="{ active: layoutMode === 'grid' }"
          title="网格布局"
          @click="setLayout('grid')"
        >
          <Icon name="material-symbols:grid-view" size="18" />
        </button>
        <button
          class="layout-btn"
          :class="{ active: layoutMode === 'waterfall' }"
          title="瀑布流布局"
          @click="setLayout('waterfall')"
        >
          <Icon name="material-symbols:view-quilt" size="18" />
        </button>
      </div>

      <!-- Featured Articles -->
      <div class="featured-articles" :class="{ waterfall: layoutMode === 'waterfall' }">
        <article 
          v-for="article in articleList" 
          :key="article.id"
          class="featured-card"
        >
          <NuxtLink :to="`/article/${article.id}`" class="featured-link">
            <div class="featured-image">
              <img 
                :src="coverOf(article.cover || article.articleCover)"
                :alt="article.title || article.articleTitle" 
              />
              <div class="image-overlay"></div>
              
              <!-- Top Meta -->
              <div class="top-meta">
                <span class="article-category">
                  <Icon name="material-symbols:category-outline" size="14" />
                  {{ article.category || '未分类' }}
                </span>
                <span class="article-date">
                  <Icon name="mingcute:time-fill" size="14" />
                  {{ formatDate(article.createTime) }}
                </span>
              </div>

              <!-- Bottom Tags -->
              <div class="bottom-tags" v-if="article.tagVOList && article.tagVOList.length">
                <span 
                  v-for="tag in article.tagVOList.slice(0, 2)" 
                  :key="tag.id"
                  class="tag"
                >
                  <Icon name="mdi:tag-outline" size="12" />
                  {{ tag.tagName }}
                </span>
              </div>

              <!-- Comments Badge -->
              <div class="comments-badge">
                <Icon name="fe:comment" size="14" />
                {{ article.commentCount || 0 }}条
              </div>

              <!-- Top Badge -->
              <div v-if="article.isTop" class="top-badge">
                <Icon name="ant-design:pushpin-filled" size="12" />
                置顶
              </div>
            </div>

            <div class="featured-content">
              <h2 class="featured-title">{{ article.title || article.articleTitle }}</h2>
              <p class="featured-excerpt">{{ article.summary || article.articleContent || '暂无摘要' }}</p>
              
              <!-- Stats -->
              <div class="article-stats">
                <span class="stat-item">
                  <Icon name="mdi:eye" size="14" />
                  {{ article.viewCount || 0 }}
                </span>
                <span class="stat-item">
                  <Icon name="mdi:heart-outline" size="14" />
                  {{ article.likeCount || 0 }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>

      <!-- Empty State -->
      <div v-if="articleList.length === 0" class="empty-state">
        <Icon name="mdi:file-document-outline" size="64" />
        <p>暂无文章</p>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="page-btn prev-btn" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <Icon name="mdi:chevron-left" size="20" />
        </button>
        
        <button 
          v-for="page in displayPages" 
          :key="page"
          :class="['page-btn', { active: page === currentPage }]"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        
        <button 
          class="page-btn next-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          <Icon name="mdi:chevron-right" size="20" />
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Article } from '@/types/article'
import { getArticleList, getCategories } from '~/api/article'

// SEO 元数据
useSeoMeta({
  title: '文章列表 - 江晚正愁余 Blog',
  description: '浏览所有技术文章，涵盖前端开发、Vue3、Nuxt3、NestJS 等技术栈',
  ogTitle: '文章列表 - 江晚正愁余 Blog',
  ogDescription: '探索前端技术文章，分享开发经验与实践心得',
})

// 分类列表
const selectedCategory = ref<string>('')
const categoryPage = ref(1)
const categoryPageSize = 5
const currentPage = ref(1)
const pageSize = ref(12)

// =============================================
//  SSR 数据预取
// =============================================
const { data: categoriesRaw } = await useAsyncData('article-categories', () => getCategories())
const categories = computed<any[]>(() => {
  const res = categoriesRaw.value as any
  return res?.data || []
})

const { data: articlesRaw, refresh: refreshArticles } = await useAsyncData(
  'article-list',
  () => getArticleList({
    page: currentPage.value,
    limit: pageSize.value,
    ...(selectedCategory.value ? { category: selectedCategory.value } : {})
  }),
  { watch: false }
)

const articleList = computed<Article[]>(() => {
  const res = articlesRaw.value as any
  return res?.data?.items || []
})
const totalCount = computed(() => (articlesRaw.value as any)?.data?.total || 0)
const totalPages = computed(() => (articlesRaw.value as any)?.data?.totalPages || 1)

// 分类分页计算
const categoryTotalPages = computed(() => Math.ceil(categories.value.length / categoryPageSize))

// 显示的页码
const displayPages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }
  
  const current = currentPage.value
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  if (end - start < 4) {
    if (start === 1) end = Math.min(total, 5)
    else start = Math.max(1, total - 4)
  }
  
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// 获取分类图标
const getCategoryIcon = (categoryName: string) => {
  const iconMap: Record<string, string> = {
    '前端': '💻', '后端': '⚙️', '数据库': '🗄️', '算法': '🧮',
    '网络': '🌐', '操作系统': '🖥️', '中间件': '🔧', '数据结构': '📊'
  }
  return iconMap[categoryName] || '📝'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return useDateFormat(dateString, 'YYYY-MM-DD').value
}

// ---- 列表布局切换（网格 / 瀑布流），localStorage 记忆 ----
const LAYOUT_MODE_KEY = 'article_layout_mode'
const layoutMode = ref<'grid' | 'waterfall'>('grid')

const setLayout = (mode: 'grid' | 'waterfall') => {
  layoutMode.value = mode
  try {
    localStorage.setItem(LAYOUT_MODE_KEY, mode)
  } catch {
    // 写入失败可忽略
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem(LAYOUT_MODE_KEY)
    if (saved === 'waterfall' || saved === 'grid') layoutMode.value = saved
  } catch {
    // 读取失败保持默认
  }
})

// 选择分类
const selectCategory = async (category: string) => {
  selectedCategory.value = category
  currentPage.value = 1
  await refreshArticles()
}

// 切换页码
const changePage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  await refreshArticles()
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.article-list-page {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 48px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 64px 32px;
  background: #faf9f7;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.sidebar-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}

.sidebar-title {
  font-size: 32px;
  font-weight: 700;
  color: #e8b4a8;
  margin: 0;
}

.article-count {
  font-size: 12px;
  color: #9a9a9a;
  background: #f5f3f0;
  padding: 4px 10px;
  border-radius: 12px;
}

.sidebar-description {
  font-size: 14px;
  color: #6a6a6a;
  line-height: 1.7;
  margin: 0 0 32px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 14px;
  text-decoration: none;
  color: #6a6a6a;
  font-size: 15px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: #e8b4a8;
  border-radius: 0 3px 3px 0;
  transition: height 0.3s ease;
}

.nav-item:hover {
  background: #f5f3f0;
  color: #2c2c2c;
}

.nav-item.active {
  background: #fef5f3;
  color: #e8b4a8;
  font-weight: 600;
}

.nav-item.active::before {
  height: 24px;
}

.nav-icon {
  font-size: 18px;
}

.nav-label {
  flex: 1;
}

.nav-count {
  font-size: 12px;
  color: #9a9a9a;
  background: #f5f3f0;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.nav-item.active .nav-count {
  background: #fef5f3;
  color: #e8b4a8;
  font-weight: 600;
}

/* 分类分页 */
.category-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f5f3f0;
}

.category-page-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 50%;
  color: #6a6a6a;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-page-btn:hover {
  background: #f5f3f0;
  color: #2c2c2c;
}

.category-page-btn.active {
  background: linear-gradient(135deg, #e8b4a8 0%, #d89b8d 100%);
  color: white;
  font-weight: 600;
}

/* Main Content */
.main-content {
  min-height: 100vh;
}

.featured-articles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 32px;
  margin-bottom: 48px;
}

/* 瀑布流布局（CSS columns 实现） */
.featured-articles.waterfall {
  display: block;
  columns: 2;
  column-gap: 32px;
}

.featured-articles.waterfall .featured-card {
  break-inside: avoid;
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .featured-articles.waterfall {
    columns: 1;
  }
}

/* 布局切换工具条 */
.layout-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 16px;
}

.layout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid #e8e5e0;
  border-radius: 8px;
  background: #fff;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
}

.layout-btn:hover {
  color: #9c8878;
  border-color: #9c8878;
}

.layout-btn.active {
  background: #9c8878;
  border-color: #9c8878;
  color: #fff;
}

.featured-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.featured-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(232, 180, 168, 0.25);
}

.featured-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.featured-image {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.featured-card:hover .featured-image img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4));
}

.top-meta {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
}

.article-category,
.article-date {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  font-size: 12px;
  color: #4a4a4a;
}

.bottom-tags {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  z-index: 2;
}

.tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  font-size: 11px;
  color: #6a6a6a;
}

.comments-badge {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(232, 180, 168, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  font-size: 12px;
  color: white;
  z-index: 2;
}

.top-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f5d4cc 0%, #e8b4a8 100%);
  color: white;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  z-index: 3;
}

.featured-content {
  padding: 20px;
}

.featured-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0 0 10px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.featured-card:hover .featured-title {
  color: #e8b4a8;
}

.featured-excerpt {
  font-size: 13px;
  color: #6a6a6a;
  line-height: 1.6;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-stats {
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid #f5f3f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9a9a9a;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #9a9a9a;
}

.empty-state p {
  margin-top: 16px;
  font-size: 16px;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 0;
}

.page-btn {
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #f5f3f0;
  border-radius: 12px;
  color: #6a6a6a;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f5f3f0;
  border-color: #e8b4a8;
  color: #2c2c2c;
}

.page-btn.active {
  background: linear-gradient(135deg, #e8b4a8 0%, #d89b8d 100%);
  border-color: #e8b4a8;
  color: white;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .article-list-page {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .sidebar {
    position: static;
  }

  .featured-articles {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .featured-articles {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="moments-page">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">说说</h2>
        <span class="moment-count">{{ totalCount }}条</span>
      </div>
      <p class="sidebar-description">瞬时随想，分享生活的点点滴滴。</p>
      
      <nav class="sidebar-nav">
        <a 
          href="#"
          :class="['nav-item', { active: selectedType === 'all' }]"
          @click.prevent="selectType('all')"
        >
          <div class="nav-content">
            <span class="nav-icon">📝</span>
            <span class="nav-label">全部说说</span>
          </div>
          <span class="nav-count">{{ totalCount }}</span>
        </a>
        <a 
          href="#"
          :class="['nav-item', { active: selectedType === 'text' }]"
          @click.prevent="selectType('text')"
        >
          <div class="nav-content">
            <span class="nav-icon">💬</span>
            <span class="nav-label">文字说说</span>
          </div>
          <span class="nav-count">{{ textCount }}</span>
        </a>
        <a 
          href="#"
          :class="['nav-item', { active: selectedType === 'music' }]"
          @click.prevent="selectType('music')"
        >
          <div class="nav-content">
            <span class="nav-icon">🎵</span>
            <span class="nav-label">音乐分享</span>
          </div>
          <span class="nav-count">{{ musicCount }}</span>
        </a>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div class="moments-grid">
        <!-- 动态渲染说说卡片 -->
        <article 
          v-for="moment in momentsData" 
          :key="moment.id" 
          class="moment-card"
          :class="getMomentCardClass(moment)"
        >
          <!-- 音乐类型说说 -->
          <template v-if="moment.type === 'music'">
            <div class="moment-header">
              <p class="moment-text">{{ moment.content }}</p>
            </div>
            
            <div class="music-player" v-if="moment.musicInfo">
              <img 
                :src="moment.musicInfo.cover || '/placeholder.svg?height=80&width=80'" 
                :alt="moment.musicInfo.title" 
                class="album-cover"
              />
              <div class="music-info">
                <h3 class="song-title">{{ moment.musicInfo.title }}</h3>
                <p class="artist-name">{{ moment.musicInfo.artist }}</p>
                <p class="song-meta">{{ moment.musicInfo.meta }}</p>
              </div>
            </div>

            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${moment.musicInfo?.progress || 0}%` }"></div>
            </div>
            <div class="time-display">
              <span>{{ moment.musicInfo?.currentTime || '0:00' }}</span>
              <span>{{ moment.musicInfo?.duration || '0:00' }}</span>
            </div>
          </template>

          <!-- 普通文本说说 -->
          <template v-else>
            <div class="moment-content">
              <p class="moment-text">{{ moment.content }}</p>
            </div>

            <!-- 图片展示 -->
            <div v-if="moment.images && moment.images.length > 0" class="moment-images">
              <img 
                v-for="(image, index) in moment.images.slice(0, 4)" 
                :key="index"
                :src="image" 
                :alt="`图片${index + 1}`"
                class="moment-image"
              />
            </div>
          </template>

          <!-- 说说底部信息 -->
          <div class="moment-footer">
            <div class="moment-meta">
              <span class="meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ formatTime(moment.createTime) }}
              </span>
              <span v-if="moment.user" class="meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {{ moment.user.nickName || moment.user.userName }}
              </span>
              <span v-if="moment.location" class="meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {{ moment.location }}
              </span>
            </div>
            <button 
              class="like-btn" 
              :class="{ liked: moment.isLiked }" 
              @click="toggleLike(moment)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="moment.isLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span v-if="moment.likeCount > 0" class="like-count">{{ moment.likeCount }}</span>
            </button>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-if="momentsData.length === 0" class="empty-state">
        <Icon name="mdi:message-text-outline" size="64" />
        <p>暂无说说</p>
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

      <!-- 页面留言板 -->
      <CommentPageComment page-id="moments" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { getMomentsList, toggleMomentLike, type MomentItem } from '~/api/moments'

// 扩展说说类型，添加页面需要的字段
interface ExtendedMomentItem extends MomentItem {
  type?: string
  musicInfo?: {
    title: string
    artist: string
    meta: string
    cover: string
    progress: number
    currentTime: string
    duration: string
  }
}

// SEO 元数据（替代 definePageMeta 的 title）
useSeoMeta({
  title: '即刻短文 - 江晚正愁余 Blog',
  description: '随想随感，分享生活的点点滴滴',
  ogTitle: '即刻短文 - 江晚正愁余 Blog',
  ogDescription: '瞬时随想，记录生活与技术的点滴瞬间',
})

// 响应式数据
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const selectedType = ref('all')

// =============================================
//  SSR 数据预取
// =============================================
const { data: momentsRaw, refresh: refreshMoments } = await useAsyncData(
  'moments-list',
  () => getMomentsList({ page: currentPage.value, size: pageSize.value, isPublic: true }),
  { watch: false }
)

// 解析原始数据
const allMoments = computed<ExtendedMomentItem[]>(() => {
  const res = momentsRaw.value
  if (res?.code === 200 && res.data?.list?.length) {
    return res.data.list.map((item: MomentItem) => ({
      ...item,
      type: detectMomentType(item),
      musicInfo: extractMusicInfo(item)
    }))
  }
  return getDefaultMomentsData()
})

const momentsData = computed(() => {
  if (selectedType.value === 'all') return allMoments.value
  return allMoments.value.filter(m => m.type === selectedType.value)
})

const totalCount = computed(() => (momentsRaw.value as any)?.data?.total || allMoments.value.length)
const totalPages = computed(() =>
  (momentsRaw.value as any)?.data?.totalPages || Math.ceil(totalCount.value / pageSize.value)
)
const textCount = computed(() => allMoments.value.filter(m => m.type === 'text').length)
const musicCount = computed(() => allMoments.value.filter(m => m.type === 'music').length)

// 选择类型
const selectType = async (type: string) => {
  selectedType.value = type
  currentPage.value = 1
  await refreshMoments()
}

// 切换页码
const changePage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  await refreshMoments()
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 显示的页码
const displayPages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
    return pages
  }
  
  const current = currentPage.value
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, 5)
    } else {
      start = Math.max(1, total - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 检测说说类型
const detectMomentType = (moment: MomentItem): string => {
  if (moment.content?.includes('分享一首歌') || moment.linkUrl?.includes('music')) {
    return 'music'
  }
  return 'text'
}

// 提取音乐信息
const extractMusicInfo = (moment: MomentItem) => {
  if (detectMomentType(moment) === 'music') {
    return {
      title: moment.linkTitle || '未知歌曲',
      artist: '未知艺术家',
      meta: '作词：未知',
      cover: moment.linkImage || '/placeholder.svg?height=80&width=80',
      progress: 35,
      currentTime: '0:00',
      duration: '4:09'
    }
  }
  return undefined
}

// 获取说说卡片样式类
const getMomentCardClass = (moment: ExtendedMomentItem): string => {
  return moment.type === 'music' ? 'music-card' : 'text-card'
}

// 格式化时间
const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (days > 7) {
    return date.toLocaleDateString()
  } else if (days > 0) {
    return `${days} 天前`
  } else if (hours > 0) {
    return `${hours} 小时前`
  } else if (minutes > 0) {
    return `${minutes} 分钟前`
  } else {
    return '刚刚'
  }
}

// 点赞切换
const toggleLike = async (moment: MomentItem) => {
  try {
    const response = await toggleMomentLike(moment.id)
    if (response && response.code === 200) {
      moment.isLiked = response.data.isLiked
      moment.likeCount = response.data.likeCount
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    // 简单的本地切换作为fallback
    moment.isLiked = !moment.isLiked
    moment.likeCount += moment.isLiked ? 1 : -1
  }
}

// 默认说说数据
const getDefaultMomentsData = (): ExtendedMomentItem[] => {
  return [
    {
      id: 1,
      userId: 1,
      content: '分享一首歌曲～',
      isPublic: true,
      allowComment: true,
      likeCount: 5,
      commentCount: 2,
      shareCount: 0,
      viewCount: 10,
      createTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date().toISOString(),
      type: 'music',
      musicInfo: {
        title: '雅俗共赏',
        artist: '许嵩',
        meta: '作词：许嵩',
        cover: '/placeholder.svg?height=80&width=80',
        progress: 35,
        currentTime: '0:00',
        duration: '4:09'
      },
      user: {
        userId: 1,
        userName: 'admin',
        nickName: '安知鱼'
      },
      location: '深圳'
    },
    {
      id: 2,
      userId: 1,
      content: '总算是把动态博客弄好了，哈～',
      isPublic: true,
      allowComment: true,
      likeCount: 3,
      commentCount: 1,
      shareCount: 0,
      viewCount: 8,
      createTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date().toISOString(),
      type: 'text',
      user: {
        userId: 1,
        userName: 'admin',
        nickName: '安知鱼'
      }
    },
    {
      id: 3,
      userId: 1,
      content: '今天的天气真好，适合出去走走。阳光洒在身上暖洋洋的，心情也跟着明朗起来。',
      isPublic: true,
      allowComment: true,
      likeCount: 7,
      commentCount: 3,
      shareCount: 1,
      viewCount: 15,
      createTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date().toISOString(),
      type: 'text',
      user: {
        userId: 1,
        userName: 'admin',
        nickName: '安知鱼'
      },
      location: '杭州'
    }
  ]
}

</script>

<style scoped>
.moments-page {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 48px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 60px 32px;
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

.moment-count {
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

/* Main Content */
.main-content {
  min-height: 100vh;
}

.moments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 380px));
  gap: 24px;
  margin-bottom: 48px;
  justify-content: start;
}

/* Moment Card */
.moment-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.moment-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
  transform: translateY(-4px);
}

.moment-header {
  margin-bottom: 12px;
}

.moment-content {
  margin-bottom: 16px;
}

.moment-text {
  font-size: 14px;
  line-height: 1.6;
  color: #2c2c2c;
  font-weight: 400;
}

/* 图片展示 */
.moment-images {
  display: grid;
  /* grid-template-columns: repeat(2, 1fr); */
  gap: 8px;
  margin-bottom: 16px;
  max-height: 280px;
  overflow: hidden;
}

.moment-images.single-image {
  grid-template-columns: 1fr;
}

.moment-images.three-images {
  grid-template-columns: repeat(3, 1fr);
}

.moment-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.moment-image:hover {
  transform: scale(1.05);
}

/* Music Player */
.music-player {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f7f5 0%, #f3f1ee 100%);
  border-radius: 12px;
}

.album-cover {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.music-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  min-width: 0;
}

.song-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-name {
  font-size: 13px;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-meta {
  font-size: 11px;
  color: #999;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 4px;
  background: #e8e6e3;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #9c8878 0%, #a89585 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-bottom: 16px;
}

/* Moment Footer */
.moment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0eeeb;
  margin-top: 12px;
}

.moment-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.meta-item svg {
  color: #999;
  width: 13px;
  height: 13px;
}

.like-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 36px;
  height: 36px;
  border: none;
  background: #f8f7f5;
  border-radius: 18px;
  color: #999;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 8px;
}

.like-btn:hover {
  background: #f0eeeb;
  transform: scale(1.1);
}

.like-btn.liked {
  background: #ffe8e8;
  color: #ff6b6b;
}

.like-count {
  font-size: 12px;
  font-weight: 500;
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

/* Comments Section */
.comments-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.03);
  margin: 0 auto;
  font-size: 13px;
}

.comments-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0eeeb;
}

.comments-header h2 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.comments-header svg {
  color: #666;
  width: 16px;
  height: 16px;
}

.comment-count {
  margin-left: auto;
  font-size: 11px;
  color: #999;
}

.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  text-align: center;
}

.user-icon {
  color: #ccc;
  margin-bottom: 16px;
  width: 40px;
  height: 40px;
}

.login-text {
  font-size: 13px;
  color: #666;
  margin-bottom: 20px;
}

.login-buttons {
  display: flex;
  gap: 10px;
}

.btn-login,
.btn-register {
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.btn-login {
  background: #2c2c2c;
  color: white;
}

.btn-login:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-register {
  background: white;
  color: #2c2c2c;
  border: 1px solid #e0e0e0;
}

.btn-register:hover {
  background: #f8f7f5;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 1024px) {
  .moments-page {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .sidebar {
    position: static;
  }

  .moments-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .moments-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .moment-card {
    padding: 20px;
  }

  .comments-section {
    padding: 24px;
  }
}
</style>

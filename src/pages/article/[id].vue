<template>
  <div class="article-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <h2>文章加载失败</h2>
      <p>{{ error }}</p>
      <button @click="fetchArticle" class="retry-btn">重试</button>
    </div>

    <!-- Article Content -->
    <template v-else-if="article">
      <!-- Hero Section with Cover Image -->
      <div class="hero-section" :style="{ opacity: heroOpacity }">
        <img :src="article.cover || '/default-cover.jpg'" alt="文章封面" class="hero-image" />
        <div class="hero-overlay"></div>

        <!-- Article Header -->
        <div class="article-header" :style="{ fontWeight: titleWeight }">
          <h1 class="article-title">{{ article.title }}</h1>
          <p class="article-subtitle">{{ article.summary }}</p>
          <div class="header-meta">
           
            <span class="author-name flex items-center gap-2">
              <img :src="article.user?.avatar || '/default-avatar.png'" alt="作者头像" class="author-avatar-small" />
              {{ article.user?.nickName || '匿名' }}
            </span>
            <span class="category">分类：{{ getCategoryName(article.category) }}</span>
          </div>


          <div class="article-meta-bar">
            <div class="meta-left">
              <span class="date">发布时间: {{ formatDate(article.createTime) }}</span>
              <span class="views">👁 {{ article.viewCount || 0 }}</span>
              <span class="comments">💬 {{ article.commentCount || 0 }}</span>
              <span class="words">共 {{ wordCount }}字</span>
              <span class="read-time">阅读时长: {{ readTime }}分钟</span>
            </div>
            <div class="meta-right">
              <button class="icon-btn" title="分享"><i class="share-icon">⇧</i></button>
              <button class="icon-btn" title="收藏"><i class="bookmark-icon">⊕</i></button>
              <button class="icon-btn" title="更多"><i class="more-icon">⋯</i></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Article Content -->
      <div class="article-content-wrapper" :style="{ maxWidth: contentWidth }">
        <div class="article-content">
          <!-- Chapter Navigation -->
          <aside class="chapter-nav">
            <h3 class="chapter-nav-title">目录</h3>
            <ul class="chapter-list">
              <li v-for="chapter in chapters" :key="chapter.id" :class="{ active: activeChapter === chapter.id }"
                @click="scrollToChapter(chapter.id)">
                <span class="chapter-number">{{ chapter.id }}</span>
                <span class="chapter-title">{{ chapter.title }}</span>
              </li>
            </ul>
          </aside>

          <!-- Main Content with Markdown -->
          <article class="main-content">
            <div class="markdown-body" v-html="renderedContent"></div>
          </article>
        </div>

        <!-- Author Info Card with Navigation -->
        <div class="author-card">
          <div class="author-section">
            <!-- Left: Author Info -->
            <div class="author-left">
              <h3 class="author-title">本文作者·{{  article.user?.nickName }}</h3>
              <p class="author-bio">
              嘿，我是{{  article.user?.nickName }}！当我不在征服JavaScript的怪异行为时，可能在品尝咖啡或探索城市角落。坚信技术应该服务于人，致力于通过代码让网络世界变得更美好。在这里分享我的技术见解和学习心得，希望能与志同道合的开发者共同成长。
              这个博客记录了我的学习历程、项目经验和偶尔的技术沉思。我相信分享的力量，所以这里没有"高深莫测"的术语堆砌，只有实实在在的学习笔记和开发心得。
              期待与你交流，一起在前端的海洋中航行！
              </p>
              <div class="author-actions">
                <NuxtLink to="/about" class="action-btn">+ 更多资料</NuxtLink>
                <button class="action-btn icon-only">✉</button>
                <button class="action-btn icon-only">☺</button>
                <button class="action-btn icon-only">♡</button>
              </div>
            </div>

            <!-- Center: Avatar -->
            <div class="author-center">
              <img :src="article?.user?.avatar || 'https://i.pravatar.cc/150?img=12'" alt="作者头像" class="author-avatar" />
            </div>

            <!-- Right: Meta & Navigation -->
            <div class="author-right">
              <h3 class="meta-title">本文阅读信息</h3>
              <div class="meta-info-grid">
                <p class="meta-item has-tooltip">
                  <i class="icon">ⓘ</i> 具有版权性
                  <span class="tooltip">
                    请您在转载、复制时注明本文作者、链接及内容来源信息。若涉及转载第三方内容，还需一同注明。
                  </span>
                </p>
                <p class="meta-item has-tooltip">
                  <i class="icon">⏰</i> 不具时效性
                  <span class="tooltip">
                    文章内容不具时效性。若文章内容有错误之处，请您批评指正。
                  </span>
                </p>
              </div>

              <!-- Article Navigation -->
              <div class="article-navigation">
                <NuxtLink 
                  v-if="prevArticle" 
                  :to="`/article/${prevArticle.id}`" 
                  class="nav-link"
                >
                  <span class="nav-arrow">‹</span>
                  <span class="nav-text">
                    <span class="nav-label">上一篇</span>
                    <span class="nav-title">{{ prevArticle.title }}</span>
                  </span>
                </NuxtLink>
                
                <NuxtLink 
                  v-if="nextArticle" 
                  :to="`/article/${nextArticle.id}`" 
                  class="nav-link"
                >
                  <span class="nav-arrow">›</span>
                  <span class="nav-text">
                    <span class="nav-label">下一篇</span>
                    <span class="nav-title">{{ nextArticle.title }}</span>
                  </span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <Comment :articleId="articleId" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { useBlogStore } from '~/stores/blogStore'
import 'github-markdown-css/github-markdown.css'
import type { Article } from '@/types/article'
import { useRoute } from 'vue-router'
import { useDateFormat } from '@vueuse/core'

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
} as any)

const route = useRoute()
const articleId = parseInt(route.params.id as string)
const blogStore = useBlogStore()

// 响应式数据
const article = ref<Article | null>(null)
const loading = ref(true)
const error = ref('')
const scrollY = ref(0)
const prevArticle = ref<{ id: number; title: string } | null>(null)
const nextArticle = ref<{ id: number; title: string } | null>(null)

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!article.value?.content) return ''

  // 解析 Markdown
  let html = marked.parse(article.value.content) as string

  // 手动处理代码高亮
  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g
  html = html.replace(codeBlockRegex, (match, lang, code) => {
    try {
      const decodedCode = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')

      if (lang && hljs.getLanguage(lang)) {
        const highlighted = hljs.highlight(decodedCode, { language: lang }).value
        return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`
      }
      return `<pre><code class="hljs">${hljs.highlightAuto(decodedCode).value}</code></pre>`
    } catch (err) {
      console.error('代码高亮失败:', err)
      return match
    }
  })

  return html
})

// 计算字数
const wordCount = computed(() => {
  if (!article.value?.content) return '0'
  // 移除Markdown标记和HTML标签
  const textContent = article.value.content
    .replace(/[#*`_~\[\]()]/g, '') // 移除Markdown标记
    .replace(/<[^>]*>/g, '') // 移除HTML标签
    .replace(/\s+/g, '') // 移除空白字符
  return textContent.length.toLocaleString()
})

// 计算阅读时间（按每分钟300字计算）
const readTime = computed(() => {
  if (!article.value?.content) return '1'
  const count = parseInt(wordCount.value.replace(/,/g, ''))
  const time = Math.ceil(count / 300)
  return time.toString()
})

// 滚动动效
const heroOpacity = computed(() => {
  const fadeStart = 0
  const fadeEnd = 400
  if (scrollY.value <= fadeStart) return 1
  if (scrollY.value >= fadeEnd) return 0.3
  return 1 - ((scrollY.value - fadeStart) / (fadeEnd - fadeStart)) * 0.7
})

const titleWeight = computed(() => {
  const weightStart = 0
  const weightEnd = 300
  if (scrollY.value <= weightStart) return 600
  if (scrollY.value >= weightEnd) return 800
  const progress = (scrollY.value - weightStart) / (weightEnd - weightStart)
  return 600 + progress * 200
})

// 内容宽度 - 滚动到200px后直接变成100%
const contentWidth = computed(() => {
  return scrollY.value > 200 ? '100%' : '1200px'
})

// 解析Markdown生成目录
const chapters = computed(() => {
  if (!renderedContent.value) return []

  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = renderedContent.value
  
  // 优先解析 h1, h2, h3 标题
  const headings = tempDiv.querySelectorAll('h1, h2, h3')
  
  if (headings.length > 0) {
    // 有标题，使用标题作为目录
    return Array.from(headings).map((heading, index) => ({
      id: index + 1,
      title: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1)),
      type: 'heading'
    }))
  }
  
  // 没有标题，尝试解析数字列表（1. 2. 3.）
  const listItems = tempDiv.querySelectorAll('ol > li')
  
  if (listItems.length > 0) {
    return Array.from(listItems).map((item, index) => {
      // 获取列表项的文本内容（去除子元素）
      const text = item.textContent?.trim() || ''
      // 只取第一行或前50个字符作为标题
      const title = text.split('\n')[0].substring(0, 50)
      
      return {
        id: index + 1,
        title: title,
        level: 1,
        type: 'list'
      }
    })
  }
  
  // 如果都没有，尝试解析段落（p标签）作为章节
  const paragraphs = tempDiv.querySelectorAll('p')
  if (paragraphs.length > 3) {
    // 只有段落数量足够多时才使用段落作为目录
    return Array.from(paragraphs).slice(0, 10).map((p, index) => {
      const text = p.textContent?.trim() || ''
      const title = text.substring(0, 30) + (text.length > 30 ? '...' : '')
      
      return {
        id: index + 1,
        title: title,
        level: 1,
        type: 'paragraph'
      }
    })
  }
  
  return []
})

const activeChapter = ref(1)

const scrollToChapter = (chapterId: number) => {
  const chapter = chapters.value[chapterId - 1]
  if (!chapter) return
  
  let targetElement = null
  
  // 根据目录类型查找对应的元素
  if (chapter.type === 'heading') {
    // 标题类型：查找 h1, h2, h3
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3')
    targetElement = headings[chapterId - 1]
  } else if (chapter.type === 'list') {
    // 列表类型：查找 ol > li
    const listItems = document.querySelectorAll('.markdown-body ol > li')
    targetElement = listItems[chapterId - 1]
  } else if (chapter.type === 'paragraph') {
    // 段落类型：查找 p
    const paragraphs = document.querySelectorAll('.markdown-body p')
    targetElement = paragraphs[chapterId - 1]
  }
  
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeChapter.value = chapterId
  }
}

// 滚动处理
const handleScroll = () => {
  scrollY.value = window.scrollY

  if (chapters.value.length === 0) return
  
  // 根据目录类型获取对应的元素
  let elements: NodeListOf<Element> | null = null
  const firstChapter = chapters.value[0]
  
  if (firstChapter.type === 'heading') {
    elements = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3')
  } else if (firstChapter.type === 'list') {
    elements = document.querySelectorAll('.markdown-body ol > li')
  } else if (firstChapter.type === 'paragraph') {
    elements = document.querySelectorAll('.markdown-body p')
  }
  
  if (!elements) return
  
  // 从后往前遍历，找到第一个在视口上方的元素
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i] as HTMLElement
    if (element && element.getBoundingClientRect().top <= 200) {
      activeChapter.value = i + 1
      break
    }
  }
}

// 获取文章详情
const fetchArticle = async () => {
  if (!articleId || isNaN(articleId)) {
    error.value = '无效的文章ID'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { getArticleById } = await import('~/api/article')
    const response = await getArticleById(articleId) as any

    console.log('文章详情响应:', response)

    if (response && response.code === 200) {
      article.value = response.data
      console.log('文章详情获取成功:', article.value)
      
      // 设置导航栏文章标题到 store
      if (article.value?.title) {
        blogStore.setCurrentArticleTitle(article.value.title)
      }
      
      // 获取上一篇和下一篇文章
      await fetchAdjacentArticles()
    } else {
      error.value = response?.message || '获取文章详情失败'
    }
  } catch (err: any) {
    console.error('获取文章详情失败:', err)
    error.value = err.message || '获取文章详情失败'
  } finally {
    loading.value = false
  }
}

// 获取上一篇和下一篇文章
const fetchAdjacentArticles = async () => {
  try {
    const { getArticleList } = await import('~/api/article')
    const response = await getArticleList({ 
      page: 1, 
      limit: 100
    }) as any
    
    console.log('文章列表响应:', response)
    
    if (response) {
      const articles = response.data.items
      console.log('文章列表:', articles)
      console.log('当前文章ID:', articleId)
      
      const currentIndex = articles.findIndex((a: any) => a.id === articleId)
      console.log('当前文章索引:', currentIndex)
      
      if (currentIndex > 0) {
        // 有上一篇
        prevArticle.value = {
          id: articles[currentIndex - 1].id,
          title: articles[currentIndex - 1].title
        }
        console.log('上一篇文章:', prevArticle.value)
      }
      
      if (currentIndex >= 0 && currentIndex < articles.length - 1) {
        // 有下一篇
        nextArticle.value = {
          id: articles[currentIndex + 1].id,
          title: articles[currentIndex + 1].title
        }
        console.log('下一篇文章:', nextArticle.value)
      }
    }
  } catch (err) {
    console.error('获取相邻文章失败:', err)
  }
}

// 获取分类名称
const getCategoryName = (category: string | { id: number; categoryName: string } | undefined) => {
  if (!category) return '未分类'
  if (typeof category === 'string') return category
  return category.categoryName || '未分类'
}

// 格式化日期
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  return useDateFormat(dateString, 'YYYY年MM月DD日 HH:mm').value
}

// 页面加载时获取文章
onMounted(() => {
  fetchArticle()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // 离开文章页时清空标题
  blogStore.clearCurrentArticleTitle()
})

// 页面标题
useHead({
  title: computed(() => article.value?.title || '文章详情'),
  meta: [
    {
      name: 'description',
      content: computed(() => article.value?.summary || '文章详情页面')
    }
  ]
})
</script>

<style scoped>
.article-detail-page {
  min-height: 100vh;
  background: #faf9f7;
  /* padding-top: 64px; */
  /* 为导航栏留出空间 */
}

/* Loading and Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #e89b8f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.retry-btn {
  padding: 10px 20px;
  background: #e89b8f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 16px;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 70vh;
  height: auto;
  overflow: hidden;
  transition: opacity 0.3s ease;
  padding-bottom: 80px;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));
}

.article-header {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  width: 90%;
  max-width: 1000px;
  transition: font-weight 0.3s ease;
  padding: 20px 0;
}

.header-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 10px;
  font-size: 14px;
  opacity: 0.9;
}

.category {
  display: flex;
  align-items: center;
  gap: 6px;
}

.category::before {
  content: '◆';
  font-size: 12px;
}

.article-title {
  font-size: 48px;
  line-height: 1.3;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.article-subtitle {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.95;
  margin: 0 0 5px 0;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
}

.article-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  font-size: 13px;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.author-avatar-small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.meta-right {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Article Content */
.article-content-wrapper {
  margin: -40px auto 0;
  padding: 0 24px 80px;
  transition: max-width 0.3s ease;
}

.article-content {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 48px;
  background: white;
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
  position: relative;
  z-index: 10;
}

/* Chapter Navigation */
.chapter-nav {
  position: sticky;
  top: 100px;
  height: fit-content;
  align-self: flex-start;
}

.chapter-nav-title {
  font-size: 16px;
  font-weight: 600;
  color: #9c8878;
  margin: 0 0 20px 0;
}

.chapter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chapter-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #666;
}

.chapter-list li:hover {
  background: #f5f3f0;
  color: #9c8878;
}

.chapter-list li.active {
  background: #f5f3f0;
  color: #9c8878;
  font-weight: 600;
}

.chapter-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #e8e5e0;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.chapter-list li.active .chapter-number {
  background: #9c8878;
  color: white;
}

/* Main Content */
.main-content {
  min-height: 600px;
}

/* Markdown 内容样式 */
.markdown-body {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #2c2c2c;
}

.markdown-body h1 {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body code {
  background: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-size: 85%;
}

.markdown-body pre {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
}

.markdown-body pre code {
  background: transparent;
  padding: 0;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 8px;
  margin: 20px 0;
}

.markdown-body blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 16px 0;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

/* Author Card - Three Column Layout */
.author-card {
  background: #f5f3f0;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 20px;
}

.author-section {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 40px;
  align-items: start;
}

/* Left Column - Author Info */
.author-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.author-title {
  font-size: 15px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0 0 8px 0;
  line-height: 22.5px;
}

.author-bio {
  font-size: 13px;
  line-height: 1.7;
  color: #666;
  margin: 0 0 8px 0;
  flex: 1;
}

.author-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  background: white;
  border-radius: 20px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn.icon-only {
  width: 36px;
  padding: 8px;
  text-align: center;
}

.action-btn:hover {
  background: #e8e5e0;
  transform: translateY(-1px);
}

/* Center Column - Avatar */
.author-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Right Column - Meta & Navigation */
.author-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 0;
}

.meta-title {
  font-size: 15px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0 0 8px 0;
  line-height: 22.5px;
  text-align: right;
}

.meta-info-grid {
  display: flex;
  height: 110.5px;
  gap: 8px 16px;
  justify-content: center;
}

.meta-item {
  margin: 0;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  cursor: help;
  transition: color 0.2s ease;
}

.meta-item:hover {
  color: #2c2c2c;
}

/* Tooltip 样式 */
.meta-item.has-tooltip {
  position: relative;
}

.tooltip {
  position: absolute;
  left: 50%;
  top: calc(70% + 0px);
  transform: translateX(-50%) translateY(-5px);
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  font-size: 12px;
  line-height: 1.6;
  color: #666;
  width: 240px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  pointer-events: none;
  white-space: normal;
}

.tooltip::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: white;
}

.meta-item.has-tooltip:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* Article Navigation in Right Column */
.author-right .article-navigation {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}

.author-right .nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 10px;
  background: rgba(0,0,0,0.06);
}

.author-right .nav-link:hover {
  background: rgba(0,0,0,0.05);
}

.author-right .nav-arrow {
  font-size: 20px;
  color: #999;
  flex-shrink: 0;
  line-height: 1;
}

.author-right .nav-text {
  display: inline;
  flex: 1;
  min-width: 0;
}

.author-right .nav-label {
  font-size: 12px;
  color: #666;
  margin-right: 4px;
}

.author-right .nav-title {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .article-content {
    grid-template-columns: 1fr;
    padding: 32px 24px;
  }

  .chapter-nav {
    position: static;
    margin-bottom: 32px;
  }
  
  .author-section {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }
  
  .author-left,
  .author-right {
    align-items: center;
  }
  
  .author-actions {
    justify-content: center;
  }
  
  .author-right .nav-link:hover {
    transform: none;
  }
}

@media (max-width: 768px) {
  .article-detail-page {
    padding-top: 64px;
    /* 与桌面端保持一致 */
  }

  .hero-section {
    height: 50vh;
  }

  .article-title {
    font-size: 32px;
  }

  .article-content {
    padding: 32px 24px;
  }

  .article-content-wrapper {
    margin: -20px auto 0;
    padding: 0 16px 40px;
  }

}
</style>
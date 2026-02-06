<template>
  <div class="contonter">
    <CommonBackground ref="target"></CommonBackground>
    <div
      class="w-[80%] mx-auto max-w-screen-2xl"
      style="display: flex; margin-top: 20px"
    >
      <div class="gossip">
        <n-icon
          size="33"
          style="position: absolute; top: 50%; left: 10px; z-index: 1; transform: translateY(-50%)"
          class="icons"
        >
          <ApertureOutline />
        </n-icon>
        <n-carousel
          direction="vertical"
          dot-placement="right"
          mousewheel
          style="width: 100%; height: 50px"
          autoplay
          :centered-slides="true"
        >
          <n-carousel-item
            v-for="item in syMomentsData"
            :key="item.id"
            style="height: 100%; line-height: 100%"
          >
            <NuxtLink
              :to="`${item.path}`"
              class="flex items-center"
              style="margin-left: 55px"
            >
              <!-- <Icon
                size="20"
                :name="item.icon"
              /> -->
              <span style="margin-right: 20px; height: 100%; line-height: 50px">{{
                item.content
              }}</span>
            </NuxtLink>
          </n-carousel-item>
        </n-carousel>
        <div
          class="go_gossip"
          @click="$router.push({ name: 'Moments' })"
        >
          <n-icon size="25">
            <ArrowForwardCircle />
          </n-icon>
        </div>
      </div>
    </div>
    <!--      主体-->
    <div class="blog_main_one">
      <HomeAbout></HomeAbout>
      <HomeFriendship></HomeFriendship>
    </div>
    <HomeAboutInfo></HomeAboutInfo>
    <div class="wz_main">
      <div id="wz_main_div1">
        <!-- 文章分类导航 -->
        <div class="articleClassification">
          <div style="width: 95%;">
            <span
              class="articleClassification_dvi"
              :class="{ liBgc: selectedCategoryIndex === 0 }"
              @click="liClick(0, '')"
              >全部</span
            >
            <span
              class="articleClassification_dvi"
              :class="{ liBgc: selectedCategoryIndex === index + 1 }"
              v-for="(item, index) in ArticleTypes"
              @click="liClick(index + 1, item)"
              :key="index"
              >{{ item }}</span
            >
          </div>
          <NuxtLink
            to="/article"
            class="gd"
            >更多</NuxtLink
          >
        </div>

        <!-- 文章列表 -->
        <div class="articles-grid">
          <ArticleCard v-for="item in articleList" :key="item.id" :item="item" />
        </div>
      </div>

      <div class="wz_yc">
        <!-- 博主面板 -->
        <HomeUserInfo />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ApertureOutline, ArrowForwardCircle } from '@vicons/ionicons5'
import { useBlogStore } from '@/stores/blogStore'
import { getArticleList, getCategories } from '~/api/article'
import { getMomentsList } from '~/api/moments'
import type { Article } from '@/types/article'

const blogStore = useBlogStore()

// SEO 元数据
useSeoMeta({
  title: '江晚正愁余 Blog - 首页',
  description: '江晚正愁余的个人博客，分享前端技术、Vue3、Nuxt3 开发经验与生活感悟',
  ogTitle: '江晚正愁余 Blog',
  ogDescription: '前端开发者的个人博客，记录技术成长与生活的点滴',
  ogImage: '/images/banner/3.jpg',
})

// 说说显示类型
interface MomentDisplayItem {
  id: number
  content: string
  icon: string
  path: string
}

// 默认数据
const defaultMoments: MomentDisplayItem[] = [
  { id: 1, content: '欢迎来到江晚正愁余Blog！', icon: 'material-symbols:chat-bubble-outline', path: '/moments' },
  { id: 2, content: '分享生活中的美好时刻', icon: 'material-symbols:favorite-outline', path: '/moments' },
  { id: 3, content: '记录每一个精彩瞬间', icon: 'material-symbols:photo-camera-outline', path: '/moments' },
]

const defaultArticles: Article[] = [
  {
    id: 1,
    articleTitle: '欢迎来到江晚正愁余Blog',
    articleCover: 'https://cdn.qiniu.jwyt.cloud/common/298f491fc98a464b9b434564c42bf4aa.jpg',
    articleContent: '这是一个基于Nuxt3和NestJS构建的现代化博客系统。',
    category: { id: 1, categoryName: 'Vue' },
    tagVOList: [{ id: 1, tagName: 'Vue' }, { id: 2, tagName: 'Nuxt3' }],
    isTop: 1,
    createTime: new Date().toISOString(),
  },
]

// =============================================
//  SSR 数据预取 —— 服务端 + 客户端都会执行
// =============================================

// 1. 博客配置
await blogStore.blogInfoData()

// 2. 说说数据
const { data: momentsRaw } = await useAsyncData('home-moments', () =>
  getMomentsList({ page: 1, size: 5, isPublic: true })
)
const syMomentsData = computed<MomentDisplayItem[]>(() => {
  const res = momentsRaw.value
  if (res && res.code === 200 && res.data?.list?.length) {
    return res.data.list.map((item: any) => ({
      id: item.id,
      content: item.content || '暂无内容',
      icon: 'material-symbols:chat-bubble-outline',
      path: '/moments',
    }))
  }
  return defaultMoments
})

// 3. 文章分类
const { data: categoriesRaw } = await useAsyncData('home-categories', () =>
  getCategories()
)
const ArticleTypes = computed<string[]>(() => {
  const res = categoriesRaw.value as any
  if (res?.data?.length) {
    return res.data.map((cat: any) => cat.categoryName || cat.name)
  }
  return []
})

// 4. 文章列表
const selectedCategoryIndex = ref(0)
const selectedCategory = ref('')

const { data: articlesRaw, refresh: refreshArticles } = await useAsyncData(
  'home-articles',
  () => getArticleList({ page: 1, limit: 4, ...(selectedCategory.value ? { category: selectedCategory.value } : {}) }),
  { watch: false } // 不自动监听，手动刷新
)
const articleList = computed<Article[]>(() => {
  const res = articlesRaw.value as any
  return res?.data?.items || defaultArticles
})

// =============================================
//  客户端交互
// =============================================

// 分类点击事件（纯响应式，不操作 DOM）
const liClick = async (index: number, category: string) => {
  selectedCategoryIndex.value = index
  selectedCategory.value = category
  await refreshArticles()
}
</script>
<style scoped lang="scss">
/* 分类头部 */
.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 48px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0ebe5;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.category-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f5d4cc 0%, #e8b4a8 100%);
  color: white;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
}

.category-name {
  font-size: 28px;
  font-weight: 600;
  color: #e8b4a8;
  margin: 0;
}

.category-meta {
  display: flex;
  align-items: center;
  gap: 24px;
}

.category-description {
  color: #9a9a9a;
  font-size: 14px;
  margin: 0;
}

.enter-category {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e8b4a8;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
}

.enter-category:hover {
  color: #d89b8d;
  gap: 10px;
}

@media (max-width: 768px) {
  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .category-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

/* 文章网格布局 */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}

.contonter {
  position: relative;
}
.p-sticky {
  position: fixed;
  top: 100px;
  left: 316px;
  width: 300px;
}
.acticle {
  width: 696px;
}
.firstcolumn {
  width: 400px;
  height: 400px;
}
.firstcolumn-bak {
  width: 280px;
}
.information {
  width: 280px;
  height: 400px;
  background-color: rgba(0, 128, 0, 0.12);
}

.s-sticky {
  position: sticky;
  top: 100px;
}
.gossip {
  width: 100%;
  height: 50px;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: #ffffff 1px solid;
}
.gossip:hover {
  border: #0b8bd9 1px solid;
}

.el-carousel {
  border-radius: 10px;
}

.el-carousel__item {
  color: #000;
  letter-spacing: 1px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.el-carousel__item a {
  cursor: pointer;
  color: #000;
}

.el-carousel__item a:hover {
  color: #687bf2;
}
.go_gossip {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  background-color: #353535;
  color: #fff;
}

.go_gossip:hover {
  background-color: #687bf2;
  color: #fff;
}
.icons:hover {
  border-radius: 50%;
  background-color: #687bf2;
  color: #fff;
}

.blog_main_one {
  user-select: none;
  height: 250px;
  width: 80%;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.wz_main {
  width: 80%;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  user-select: none;
}

#wz_main_div1 {
  width: 80%;
}

.wz_yc {
  display: flex;
  flex-direction: column;
  width: 19%;
}

.articleClassification {
  background-color: #fff;
  height: 50px;
  line-height: 50px;
  border-radius: 10px;
  display: flex;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: #ffffff 1px solid;
}
.articleClassification:hover {
  border: #0b8bd9 1px solid;
}

.gd {
  margin: 0 0 0 10px;
  color: #000;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 20px;
  width: 50px;
  line-height: 50px;
  text-align: center;
}

.gd:hover {
  color: #2853df;
}

.articleClassification_dvi {
  padding: 5px 15px;
  margin: 0 0 0 10px;
  color: #000;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
}

.articleClassification_dvi:hover {
  background-color: #2853df;
  color: #fff;
}

@media (max-width: 1200px) {
  .wz_main {
    width: 100%;
    justify-content: center;
  }

  #wz_main_div1 {
    width: 100%;
  }

  .wz_yc {
    display: none !important;
  }
  .blog_main_one {
    display: none !important;
  }

  .articleClassification {
    display: none !important;
  }
}
</style>

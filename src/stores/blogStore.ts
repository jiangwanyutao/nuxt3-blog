// import { getYiYan2 } from '@/apis/poetry'
import type { SiteConfig } from '@/types/home'

// 博客配置信息类型
interface BlogConfig {
  configId: string
  title: string
  hoverTitle: string
  slogan: string
  contactList: Array<{
    icon: string
    link: string
    name: string
  }>
  startTime: string
  visitCount: string
  icpNumber: string
  createTime: string
  updateTime: string
  runningDays: number
}

export const useBlogStore = defineStore('blog', () => {
  // 博客基本信息
  const siteConfig = ref<SiteConfig | null>(null)
  
  // 博客配置信息
  const blogConfig = ref<BlogConfig | null>(null)
  
  // 文章数
  const articleCount = ref(0)
  // 分类数
  const categoryCount = ref(0)
  // 标签数
  const tagCount = ref(0)
  // 访问数
  const viewsCount = ref(0)
  // 菜单
  const menuList = ref([
    {
      icon: 'noto:house-with-garden',
      text: '开始浏览',
      path: '/',
      class: 'menu-item-home',
      children: [
        {
          icon: 'mynaui:sparkles',
          text: '网站',
          children: [
            {
              icon: '',
              path: '/',
              text: '个人主页'
            },
            {
              icon: '',
              path: 'https://jwyt.cloud',
              text: '云盘主页'
            }
          ]
        },
        {
          icon: 'mynaui:train',
          text: '项目',
          children: [
            {
              icon: '',
              path: 'https://chat.jwyt.cloud',
              text: 'ChatGpt'
            },
            {
              icon: '',
              text: '网站主题项目'
            }
          ]
        }
      ]
    },
    {
      icon: '',
      text: '关于',
      path: '/about',
      class: 'menu-item-archives',
    },
  ])
  // banner
  const bannerList = ref([
    {
      title: 'Web音乐播放器',
      describe: '高颜值的第三方网易云播放器',
      link: 'https://music.sakura520.co/',
      bgSrc: 'http://view.lixingyong.com/images/2020/07/20/53c1c3913427ee7504fd228dbda06d6b.md.png'
    },
    {
      title: '图库',
      describe: '这里有好多图片',
      link: 'https://view.lixingyong.com/explore/trending',
      bgSrc: 'http://view.lixingyong.com/images/2020/07/15/-----4k_.md.jpg'
    },
    {
      title: 'sakura',
      describe: '本站 Sakura 主题',
      link: '',
      bgSrc: 'http://view.lixingyong.com/images/2020/10/09/wallhaven-6qxrzx.md.png'
    }
  ])
  // 一言
  const yiYan = ref('梦想是一个天真的词，实现梦想是一个残酷的词')
  
  // 当前阅读的文章标题（用于导航栏滚动显示）
  const currentArticleTitle = ref('')
  
  // 设置当前文章标题
  function setCurrentArticleTitle(title: string) {
    currentArticleTitle.value = title
  }
  
  // 清空当前文章标题
  function clearCurrentArticleTitle() {
    currentArticleTitle.value = ''
  }

  // 查看博客信息
  async function blogInfoData() {
    try {
      const { data } = await api.auth.apiGetConfig();
      console.log(data, '博客配置列表')
      
      // 存储博客配置信息
      if (data) {
        blogConfig.value = data
        
        // 同时更新访问数
        viewsCount.value = parseInt(data.visitCount) || 0
      }
    } catch (error) {
      console.error('获取博客配置失败:', error)
    }
  }
  async function setYiYan() {
    // 每日一言
    const { data } = await getYiYan2()
    if (data.value) {
      yiYan.value = data.value.hitokoto
    }
  }

  return {
    siteConfig,
    blogConfig,
    menuList,
    bannerList,
    articleCount,
    categoryCount,
    tagCount,
    viewsCount,
    yiYan,
    currentArticleTitle,
    blogInfoData,
    setYiYan,
    setCurrentArticleTitle,
    clearCurrentArticleTitle
  }
}, {
  persist: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  } as any
})

console.log(import.meta.hot,'import.meta.hot')
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useBlogStore, import.meta.hot))

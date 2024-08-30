// import { getYiYan2 } from '@/apis/poetry'
import type { SiteConfig } from '@/types/home'

export const useBlogStore = defineStore('blog', () => {
  // 博客基本信息
  const siteConfig = ref<SiteConfig | null>(100)
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
          icon: 'noto:house-with-garden',
          text: '网站',
          children: [
            {
              icon: 'noto:house-with-garden',
              path: '/about',
              text: '关于'
            },
            {
              icon: 'noto:house-with-garden',
              path: '/',
              text: '博客'
            },
            {
              icon: 'noto:house-with-garden',
              path: 'https://jwyt.cloud',
              text: '云盘主页'
            }
          ]
        },
        {
          icon: 'noto:house-with-garden',
          text: '项目',
          children: [
            {
              icon: 'noto:house-with-garden',
              path: 'https://chat.jwyt.cloud',
              text: 'ChatGpt'
            },
            {
              icon: 'noto:house-with-garden',
              text: '网站主题项目'
            }
          ]
        }
      ]
    },
    {
      icon: 'flat-color-icons:calendar',
      text: '归档',
      path: '/archives',
      class: 'menu-item-archives',
      children: [
        {
          icon: 'flat-color-icons:calendar',
          text: '树洞1',
          path: '/archives',
          class: 'menu-item-archives'
        },
        {
          icon: 'flat-color-icons:calendar',
          text: '树洞1',
          path: '/archives',
          class: 'menu-item-archives'
        },
        {
          icon: 'flat-color-icons:calendar',
          text: '树洞1',
          path: '/archives',
          class: 'menu-item-archives'
        }
      ]
    },
    {
      icon: 'icon-park:category-management',
      text: '分类',
      path: '/category',
      class: 'menu-item-category',
      children: [
        {
          icon: 'flat-color-icons:calendar',
          text: '树洞2',
          path: '/archives',
          class: 'menu-item-archives'
        },
        {
          icon: 'flat-color-icons:calendar',
          text: '树洞2',
          path: '/archives',
          class: 'menu-item-archives'
        },
        {
          icon: 'flat-color-icons:calendar',
          text: '树洞2',
          path: '/archives',
          class: 'menu-item-archives'
        }
      ]
    },
    {
      icon: 'icon-park:comments',
      text: '说说',
      path: '/talk',
      class: 'menu-item-talk',
      children: [
        {
          icon: 'flat-color-icons:calendar',
          text: '树洞3',
          path: '/archives',
          class: 'menu-item-archives'
        },
        {
          icon: 'flat-color-icons:calendar',
          text: '树洞3',
          path: '/archives',
          class: 'menu-item-archives'
        },
        {
          icon: 'flat-color-icons:calendar',
          text: '树洞3',
          path: '/archives',
          class: 'menu-item-archives'
        }
      ]
    }
    // {
    //   icon: 'icon-park:message',
    //   text: '留言',
    //   path: '/message',
    //   class: 'menu-item-message'
    // },
    // {
    //   icon: 'icon-park:friends-circle',
    //   text: '友链',
    //   path: '/link',
    //   class: 'menu-item-friends'
    // },
    // {
    //   icon: 'flat-color-icons:gallery',
    //   text: '图库',
    //   path: '/album',
    //   class: 'menu-item-album'
    // }
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
  // 开始浏览 单独配置信息 包含网站和项目两个分类

  // 查看博客信息
  async function blogInfoData() {
    const { home } = useApi()
    const { data } = await home.getBlogInfo({ lazy: true })
    if (data.value) {
      viewsCount.value = data.value.data.viewCount
      tagCount.value = data.value.data.tagCount
      articleCount.value = data.value.data.articleCount
      categoryCount.value = data.value.data.categoryCount
      siteConfig.value = data.value.data.siteConfig ? '100' : '0'
    }
  }
  async function setYiYan() {
    // 每日一言
    const { data } = await getYiYan2()
    if (data.value) {
      // const yiyanObj = data.value as string
      yiYan.value = data.value.hitokoto
    }
  }

  return {
    siteConfig,
    menuList,
    bannerList,
    articleCount,
    categoryCount,
    tagCount,
    viewsCount,
    yiYan,
    blogInfoData,
    setYiYan
  }
})

// console.log(import.meta.hot)
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useBlogStore, import.meta.hot))

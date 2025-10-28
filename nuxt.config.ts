// https://nuxt.com/docs/api/configuration/nuxt-config
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
export default defineNuxtConfig({
  devServer: {
    port: 3001
  },
  //资源放入src目录
  srcDir: 'src/',
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: '江晚正愁余 Blog',
      meta: [
         { charset: 'utf-8' },
        { name: 'keywords', content: '江晚正愁余,blog,个人博客,博客,sakura,主题,前端,知识库,nuxt3' },
        { name: 'author', content: '江晚正愁余' },
        { name: 'description', content: '江晚正愁余 & 前端开发 & Nuxt3 & 个人博客 & 个人知识库' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        // 🎯 预加载首屏关键图片
        { rel: 'preload', href: '/images/banner/3.jpg', as: 'image' }, // 首屏默认显示的图片 (currentBgIndex = 3)
        { rel: 'preload', href: '/images/banner/log.png', as: 'image' },
        { rel: 'preload', href: '/images/banner/backImg.jpg', as: 'image' },
        // 💡 智能预加载策略：
        // - About 页面图片：鼠标悬停"关于"链接时预加载（使用 PreloadLink 组件）
        // - 其他 Banner 图片：在首屏加载后自动预加载（见 background.vue 的 preloadImages 方法）
        // 详见：PreloadLink 组件和 useImagePreload composable
      ]
    }
  },
  routeRules: {
    // 首页预渲染
    '/': { prerender: true },
  },
  runtimeConfig: {
    // apiSecret 只能在服务器端上访问
    apiSecret: '',
    // public 命名空间中定义的，在服务器端和客户端都可以普遍访问
    public: { 
      env:true,
      baseURL: process.env.NUXT_PUBLIC_API_BASE
     }
  },
  devtools: { enabled: true },
  //插件
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@nuxtjs/color-mode',
    '@nuxt/image'
  ],
  colorMode: {
    classSuffix: '' // 用于添加到 HTML 或组件的类名后缀
  },
  imports: {
    // 自动导入 store 模块
    dirs: ['stores', 'api']
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate']
  },
  css: ['~/assets/css/main.css', '~/assets/css/animation.css'],
  script: [],
  plugins: [],
  image: {
    presets: {
      cover: {
        modifiers: {
          fit: 'cover',
          format: 'jpg,png,webp,avif'
        }
      }
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? ['naive-ui', 'vueuc', '@css-render/vue3-ssr', '@juggle/resize-observer', 'fsevents']
        : ['@juggle/resize-observer']
  },
  vite: {
    build: {
      plugins: process.env.NODE_ENV === 'production'
    },
    plugins: [
      Components({
        resolvers: [NaiveUiResolver()] // Automatically register all components in the `components` directory
      })
    ],
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc']
          : [],
      exclude: ['@juggle/resize-observer']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/style/main.scss";'
        }
      }
    }
  }
})

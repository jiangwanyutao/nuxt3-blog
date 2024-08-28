// https://nuxt.com/docs/api/configuration/nuxt-config
import Components from 'unplugin-vue-components/vite';
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers';
export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
  //资源放入src目录
  srcDir: 'src/',
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  runtimeConfig: {
    // apiSecret 只能在服务器端上访问
    apiSecret: '',
    // public 命名空间中定义的，在服务器端和客户端都可以普遍访问
    public: { baseURL: process.env.NUXT_PUBLIC_API_BASE }
  },
  devtools: { enabled: true },
  //插件
  modules:[
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@nuxtjs/color-mode',
    "@nuxt/image",
  ],
  colorMode: {
    classSuffix: '', // 用于添加到 HTML 或组件的类名后缀
  },
  imports: {
    // 自动导入 store 模块
    dirs: ['stores','api']
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate']
  },
  css: ['~/assets/css/main.css','~/assets/css/animation.css'],
  script:[],
  plugins: [],
  image: {
    presets: {
      cover: {
        modifiers: {
          fit: 'cover',
          format: 'jpg,png,webp,avif',
        },
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
      ? [
        'naive-ui',
        'vueuc',
        '@css-render/vue3-ssr',
        '@juggle/resize-observer',
        'fsevents'
      ]
      : ['@juggle/resize-observer']
  },
  vite: {
    build:{
      plugins: process.env.NODE_ENV === 'production'
    },
    plugins: [
      Components({
        resolvers: [NaiveUiResolver()], // Automatically register all components in the `components` directory
      }),
    ],
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
        ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
        : []
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

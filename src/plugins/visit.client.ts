import requestUtil from '~/composables/requestUtil'

/** 匿名访客标识在 localStorage 中的键名 */
const VISITOR_KEY = 'blog_visitor_id'

/** 生成一个不含个人信息的随机访客标识，仅用于区分 UV */
const createVisitorId = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

const getVisitorId = (): string => {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = createVisitorId()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    // 隐私模式下 localStorage 不可用，退化为一次性标识
    return createVisitorId()
  }
}

/**
 * 访问埋点：路由切换后上报当前路径。
 * 服务端按「访客 + 路径」做 30 分钟去重，刷新页面不会重复计数。
 */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  // 首屏 app:mounted 与路由 afterEach 会对同一路径各触发一次，
  // 这里记住上一次上报的路径，避免重复请求（服务端也有去重，但没必要白跑一趟）
  let lastReported = ''

  const report = (path: string) => {
    if (path === lastReported) return
    lastReported = path

    // 埋点是旁路行为，任何失败都不该影响浏览，因此不 await 也不抛出
    requestUtil
      .post(
        '/visit/record',
        { path, visitorId: getVisitorId(), referer: document.referrer || undefined },
        { isToken: false }
      )
      .catch(() => {})
  }

  nuxtApp.hook('app:mounted', () => {
    report(router.currentRoute.value.fullPath)
  })

  router.afterEach((to) => {
    report(to.fullPath)
  })
})

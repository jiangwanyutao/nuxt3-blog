import { createPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as any
  pinia.use(createPersistedState({
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    auto: true, // 自动持久化所有 store
  }))
})

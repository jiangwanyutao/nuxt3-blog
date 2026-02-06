import type { Poetry, IHitokoto } from '~/types/poetry'

// 获取诗词
export function getPoetry() {
  return useLazyFetch<Poetry>('https://v1.jinrishici.com/all.json')
}

// 一言
export function getYiYan() {
  return useLazyFetch('https://v.api.aa1.cn/api/yiyan/index.php?type=json')
}

export function getYiYan2() {
  return useLazyFetch<IHitokoto>('https://v1.hitokoto.cn/?encode=json&c=d&c=j&c=k&c=k&c=i&lang=cn')
}

//一言 单独api诗词
export function getYiYan3() {
  return requestUtil.get('https://api.vvhan.com/api/ian/shici')
}


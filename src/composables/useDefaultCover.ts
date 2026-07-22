/**
 * 文章无封面时的统一兜底图。
 *
 * 抽出来之前全站有五套互不相同的写法：
 * - Related.vue 用 /images/banner/3.jpg（本地存在，是唯一真正可用的那个）
 * - Card.vue 与 article/index.vue 各自硬编码了一个 Unsplash 外链（依赖外网）
 * - article/[id].vue 用 /default-cover.jpg、moments 用 /placeholder.svg —— 两个都 404
 *
 * 统一到本地资源：不依赖外网、不会 404、风格与站点首屏一致。
 */
export const DEFAULT_COVER = '/images/banner/3.jpg'

/** 取文章封面，缺省时回退到兜底图 */
export const coverOf = (cover?: string | null) => cover || DEFAULT_COVER

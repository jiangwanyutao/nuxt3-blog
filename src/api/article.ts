import requestUtil from '~/composables/requestUtil'
import type { Article, ArticleInfo, ArticleQuery, ArticleRecommend, Archives, ArticleConditionList, SearchArticle } from '@/types/article'

// 定义公开文章查询参数
export interface PublicArticleQuery {
  page?: number
  limit?: number
  keyword?: string
  category?: string
}

/**
 * 获取文章列表
 * @param params 查询参数
 */
export const getArticleList = (params: PublicArticleQuery) => {
  return requestUtil.get('/public/article/list', params, { isToken: false })
}

/**
 * 获取文章详情
 * @param articleId 文章ID
 */
export const getArticleById = (articleId: number) => {
  return requestUtil.get(`/public/article/${articleId}`, {}, { isToken: false })
}

/**
 * 获取推荐文章
 */
export const getRecommendArticles = () => {
  return requestUtil.get('/public/article/popular', {}, { isToken: false })
}

/**
 * 获取相关文章
 * @param articleId 文章ID
 * @param limit 数量限制
 */
export const getRelatedArticles = (articleId: number, limit: number = 5) => {
  return requestUtil.get(`/public/article/${articleId}/related`, { limit }, { isToken: false })
}

/**
 * 获取热门文章
 * @param limit 数量限制
 */
export const getPopularArticles = (limit: number = 10) => {
  return requestUtil.get('/public/article/popular', { limit }, { isToken: false })
}

/**
 * 搜索文章
 * @param keyword 关键词
 */
export const searchArticles = (keyword: string) => {
  return requestUtil.get('/public/article/list', { keyword }, { isToken: false })
}

/**
 * 文章点赞
 * @param articleId 文章ID
 */
export const likeArticle = (articleId: number) => {
  return requestUtil.post('/article/like', { articleId }, { isToken: false })
}

/**
 * 增加文章浏览量
 * @param articleId 文章ID
 */
export const updateViewCount = (articleId: number) => {
  return requestUtil.post(`/public/article/${articleId}/view`, {}, { isToken: false })
}

/**
 * 获取所有文章分类
 */
export const getCategories = () => {
  return requestUtil.get('/public/article/categories', {}, { isToken: false })
}

/**
 * 获取所有文章标签
 */
export const getTags = () => {
  return requestUtil.get('/public/article/tags', {}, { isToken: false })
}

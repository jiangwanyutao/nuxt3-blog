import type { CategoryVO } from './category'
import type { TagVO } from './tag'
import type { PageQuery } from './index'

/**
 * 文章
 */
export interface Article {
  /**
   * 文章id
   */
  id: number
  /**
   * 文章缩略图 (前端字段)
   */
  articleCover?: string
  /**
   * 文章标题 (前端字段)
   */
  articleTitle?: string
  /**
   * 文章内容 (前端字段)
   */
  articleContent?: string
  /**
   * 文章分类 (前端字段)
   */
  category?: CategoryVO | string
  /**
   * 文章标签 (前端字段)
   */
  tagVOList?: TagVO[]
  /**
   * 是否置顶 (0否 1是)
   */
  isTop?: number | boolean
  /**
   * 发表时间
   */
  createTime: string
  
  // 后端字段
  /**
   * 文章标题 (后端字段)
   */
  title?: string
  /**
   * 文章摘要 (后端字段)
   */
  summary?: string
  /**
   * 文章内容 (后端字段)
   */
  content?: string
  /**
   * 文章封面 (后端字段)
   */
  cover?: string
  /**
   * 文章标签 (后端字段)
   */
  tags?: string[]
  /**
   * 浏览数
   */
  viewCount?: number
  /**
   * 点赞数
   */
  likeCount?: number
  /**
   * 评论数
   */
  commentCount?: number
  /**
   * 发布状态
   */
  publishStatus?: string
  /**
   * 用户ID
   */
  userId?: number
  /**
   * 用户信息
   */
  user?: {
    id: number
    userName: string
    nickName: string
    avatar?: string
    remark?: string
  }
}

/**
 * 文章上下篇
 */
export interface ArticlePagination {
  /**
   * 文章id
   */
  id: number
  /**
   * 文章缩略图
   */
  articleCover: string
  /**
   * 文章标题
   */
  articleTitle: string
}

/**
 * 推荐文章
 */
export interface ArticleRecommend {
  /**
   * 文章id
   */
  id: number
  /**
   * 文章标题
   */
  articleTitle: string
  /**
   * 文章缩略图
   */
  articleCover: string
  /**
   * 发布时间
   */
  createTime: string
}

/**
 * 文章信息
 */
export interface ArticleInfo {
  /**
   * 文章id
   */
  id: number
  /**
   * 文章缩略图
   */
  articleCover: string
  /**
   * 文章标题
   */
  articleTitle: string
  /**
   * 文章内容
   */
  articleContent: string
  /**
   * 文章类型 (1原创 2转载 3翻译)
   */
  articleType: number
  /**
   * 浏览量
   */
  viewCount: number
  /**
   * 点赞量
   */
  likeCount: number
  /**
   * 文章分类
   */
  category: CategoryVO
  /**
   * 文章标签
   */
  tagVOList: TagVO[]
  /**
   * 发表时间
   */
  createTime: string
  /**
   * 上一篇文章
   */
  lastArticle: ArticlePagination
  /**
   * 下一篇文章
   */
  nextArticle: ArticlePagination
  /**
   * 更新时间
   */
  updateTime: string
}

/**
 * 归档
 */
export interface Archives {
  /**
   * 文章id
   */
  id: number
  /**
   * 文章标题
   */
  articleTitle: string
  /**
   * 文章缩略图
   */
  articleCover: string
  /**
   * 发布时间
   */
  createTime: string
}

/**
 * 文章分类、标签
 */
export interface ArticleCondition {
  /**
   * 文章id
   */
  id: number
  /**
   * 文章缩略图
   */
  articleCover: string
  /**
   * 文章标题
   */
  articleTitle: string
  /**
   * 文章分类
   */
  category: CategoryVO
  /**
   * 文章标签
   */
  tagVOList: TagVO[]
  /**
   * 发布时间
   */
  createTime: string
}

/**
 * 文章条件列表
 */
export interface ArticleConditionList {
  /**
   * 文章列表
   */
  articleConditionVOList: ArticleCondition[]
  /**
   * 条件名
   */
  name: string
}

/**
 * 文章参数
 */
export interface ArticleQuery extends PageQuery {
  /**
   * 分类id
   */
  categoryId: number
  /**
   * 标签id
   */
  // tagId: number
}

/**
 * 文章搜索
 */
export interface SearchArticle {
  /**
   * 文章id
   */
  id: number
  /**
   * 文章标题
   */
  articleTitle: string
  /**
   * 文章内容
   */
  articleContent: string
}

import { ref } from 'vue'
import { getArticleLikeState, likeArticle, unlikeArticle } from '~/api/article'

/**
 * 文章点赞状态管理。
 * 服务端按访客 IP 去重，因此 likeCount 与 liked 一律以接口返回为准，
 * 本地只做乐观更新让点击有即时反馈，请求回来后再对齐。
 */
export const useArticleLike = (initialCount = 0) => {
  const liked = ref(false)
  const likeCount = ref(initialCount)
  const pending = ref(false)

  const applyState = (res: any) => {
    if (res?.code !== 200 || !res.data) return false
    liked.value = !!res.data.liked
    likeCount.value = res.data.likeCount ?? likeCount.value
    return true
  }

  /** 拉取当前访客的点赞状态，失败时保持默认值（未点赞） */
  const syncState = async (articleId: number) => {
    try {
      applyState(await getArticleLikeState(articleId))
    } catch {
      // 状态查询失败不影响阅读，按未点赞展示即可
    }
  }

  const toggle = async (articleId: number) => {
    if (pending.value) return

    const prevLiked = liked.value
    const prevCount = likeCount.value

    // 乐观更新：先动 UI，请求结果再校正
    liked.value = !prevLiked
    likeCount.value = Math.max(0, prevCount + (prevLiked ? -1 : 1))
    pending.value = true

    try {
      const res = prevLiked ? await unlikeArticle(articleId) : await likeArticle(articleId)
      if (!applyState(res)) {
        liked.value = prevLiked
        likeCount.value = prevCount
      }
    } catch {
      liked.value = prevLiked
      likeCount.value = prevCount
    } finally {
      pending.value = false
    }
  }

  return { liked, likeCount, pending, syncState, toggle }
}

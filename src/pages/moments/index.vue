<template>
  <div class="mm-page">
    <!-- 封面：图片 + 右下角昵称与头像，压住封面底边 -->
    <header class="mm-cover">
      <div class="mm-cover-clip">
        <img :src="coverImage" alt="" class="mm-cover-img" />
        <div class="mm-cover-mask" />
      </div>
      <div class="mm-owner">
        <span class="mm-owner-name">{{ ownerName }}</span>
        <img v-if="ownerAvatar" :src="ownerAvatar" :alt="ownerName" class="mm-owner-avatar" />
        <div v-else class="mm-owner-avatar mm-owner-avatar-empty">{{ ownerName.slice(0, 1) }}</div>
      </div>
    </header>

    <main class="mm-feed">
      <article v-for="m in moments" :key="m.id" class="mm-item">
        <img v-if="m.user?.avatar" :src="m.user.avatar" :alt="m.user?.nickName" class="mm-avatar" />
        <div v-else class="mm-avatar mm-avatar-empty">{{ (m.user?.nickName || '匿').slice(0, 1) }}</div>

        <div class="mm-body">
          <div class="mm-name">{{ m.user?.nickName || '匿名' }}</div>

          <p v-if="m.content" class="mm-text">{{ m.content }}</p>

          <!-- 图片：1 张大图；4 张走 2×2；其余每行 3 张。这是朋友圈的排布规则 -->
          <div v-if="m.images?.length" class="mm-images" :class="gridClass(m.images.length)">
            <button
              v-for="(img, i) in m.images.slice(0, 9)"
              :key="i"
              type="button"
              class="mm-image"
              @click="openImage(img, m.user?.nickName)"
            >
              <img :src="img" :alt="`图片 ${i + 1}`" loading="lazy" />
            </button>
          </div>

          <div v-if="m.location" class="mm-location">{{ m.location }}</div>

          <div class="mm-meta">
            <time class="mm-time">{{ formatTime(m.createTime) }}</time>

            <!-- 面板要贴着按钮弹出，所以定位参照系放在这层，而不是整行 -->
            <span class="mm-action-wrap">
              <button class="mm-action" :aria-label="`操作 ${m.id}`" @click="togglePanel(m.id)">
                <span /><span />
              </button>

              <div v-if="openPanelId === m.id" class="mm-panel">
                <button class="mm-panel-btn" @click="onLike(m)">
                  <span class="mm-panel-icon">{{ m.isLiked ? '♥' : '♡' }}</span>
                  {{ m.isLiked ? '取消' : '赞' }}
                </button>
                <span class="mm-panel-sep" />
                <button class="mm-panel-btn" @click="focusComment(m.id)">
                  <span class="mm-panel-icon">💬</span>
                  评论
                </button>
              </div>
            </span>
          </div>

          <!-- 赞与评论共用一块浅色底，朋友圈里它们是连在一起的 -->
          <div v-if="m.likeCount > 0 || commentsOf(m.id).length" class="mm-social">
            <div v-if="m.likeCount > 0" class="mm-likes">
              <span class="mm-like-icon">♥</span>
              <span class="mm-like-text">{{ likeText(m) }}</span>
            </div>

            <div v-if="m.likeCount > 0 && commentsOf(m.id).length" class="mm-social-line" />

            <ul v-if="commentsOf(m.id).length" class="mm-comments">
              <li v-for="c in commentsOf(m.id)" :key="c.id" class="mm-comment">
                <span class="mm-comment-name">{{ nameOf(c) }}：</span>{{ c.content }}
              </li>
            </ul>
          </div>

          <!-- 评论输入：点「评论」后展开，游客填昵称与邮箱即可 -->
          <div v-if="composerId === m.id" class="mm-composer">
            <textarea
              ref="composerInput"
              v-model="draft.content"
              class="mm-composer-text"
              rows="2"
              maxlength="500"
              placeholder="说点什么…"
            />
            <div class="mm-composer-row">
              <input v-model="draft.name" class="mm-composer-input" maxlength="20" placeholder="昵称" />
              <input v-model="draft.email" class="mm-composer-input" maxlength="60" placeholder="邮箱（不公开）" />
            </div>
            <div class="mm-composer-foot">
              <span class="mm-composer-tip">评论需管理员审核后才会显示</span>
              <div class="mm-composer-btns">
                <button class="mm-composer-cancel" @click="closeComposer">取消</button>
                <button class="mm-composer-send" :disabled="!canSend || sending" @click="submitComment(m)">
                  {{ sending ? '发送中…' : '发送' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <p v-if="!moments.length && !loading" class="mm-empty">还没有发过说说</p>

      <button v-if="hasMore" class="mm-more" :disabled="loading" @click="loadMore">
        {{ loading ? '加载中…' : '查看更多' }}
      </button>
    </main>

    <PhotographyLightbox :show="lightbox.show" :image="lightbox.image" @close="lightbox.show = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getMomentsList,
  getMomentComments,
  addMomentGuestComment,
  getMomentGuestLike,
  likeMomentAsGuest,
  unlikeMomentAsGuest,
  type MomentItem
} from '~/api/moments'
import utilMsg from '~/composables/utilMsg'

useSeoMeta({
  title: '说说 - 江晚正愁余 Blog',
  description: '随想随感，分享生活的点点滴滴'
})

/** 封面用站点已有的 banner 图，不额外引资源 */
const coverImage = '/images/banner/6.png'
const PAGE_SIZE = 10

const moments = ref<MomentItem[]>([])
const total = ref(0)
const page = ref(1)
const loading = ref(false)
const openPanelId = ref<number | null>(null)

/** 每条说说的评论，按说说 id 存；朋友圈里评论是直接铺在下面的，不用点开 */
const commentMap = reactive<Record<number, any[]>>({})
const commentsOf = (id: number) => commentMap[id] || []

const hasMore = computed(() => moments.value.length < total.value)

const ownerName = computed(() => moments.value[0]?.user?.nickName || '江晚正愁余')
const ownerAvatar = computed(() => moments.value[0]?.user?.avatar || '')

const load = async (reset = false) => {
  if (loading.value) return
  loading.value = true
  try {
    const res: any = await getMomentsList({ page: reset ? 1 : page.value, size: PAGE_SIZE })
    if (res?.code !== 200) return
    const list = res.data?.list || []
    moments.value = reset ? list : [...moments.value, ...list]
    total.value = res.data?.total || 0
    if (reset) page.value = 1
    // 评论与点赞态并行取，逐条串行会让整页明显变慢
    await Promise.all([
      ...list.map((m: MomentItem) => loadComments(m.id)),
      ...list.map((m: MomentItem) => loadLikeState(m))
    ])
  } finally {
    loading.value = false
  }
}

const loadComments = async (id: number) => {
  try {
    const res: any = await getMomentComments(id, 1, 50)
    if (res?.code === 200) commentMap[id] = res.data?.list || []
  } catch {
    // 评论拉不到不影响说说本身展示
    commentMap[id] = []
  }
}

/**
 * 回填当前访客的点赞态。列表接口返回的 isLiked 是按登录用户算的，
 * 访客恒为 false，不回填的话刷新后已点的赞会显示成没点。
 */
const loadLikeState = async (m: any) => {
  try {
    const res: any = await getMomentGuestLike(m.id)
    if (res?.code === 200 && res.data) {
      m.isLiked = !!res.data.liked
      if (typeof res.data.likeCount === 'number') m.likeCount = res.data.likeCount
    }
  } catch {
    // 拿不到点赞态不影响说说展示，维持列表接口给的值
  }
}

const loadMore = async () => {
  page.value += 1
  await load()
}

const togglePanel = (id: number) => {
  openPanelId.value = openPanelId.value === id ? null : id
}

const onLike = async (m: any) => {
  openPanelId.value = null
  const prevLiked = m.isLiked
  const prevCount = m.likeCount
  // 先改本地再发请求，失败回滚：点赞是高频轻操作，等往返会很迟钝
  m.isLiked = !prevLiked
  m.likeCount = prevCount + (prevLiked ? -1 : 1)
  try {
    const res: any = prevLiked ? await unlikeMomentAsGuest(m.id) : await likeMomentAsGuest(m.id)
    if (res?.code !== 200) throw new Error(res?.msg || '点赞失败')
    // 以服务端返回的计数为准：同 IP 重复点赞不累加，本地那次 +1 可能是多算的
    if (typeof res.data?.likeCount === 'number') m.likeCount = res.data.likeCount
    if (typeof res.data?.liked === 'boolean') m.isLiked = res.data.liked
  } catch (e: any) {
    m.isLiked = prevLiked
    m.likeCount = prevCount
    utilMsg.$message.warning(e?.message || '点赞失败，请稍后再试')
  }
}

// ---------- 评论 ----------
const composerId = ref<number | null>(null)
const sending = ref(false)
/** 昵称与邮箱记在本地，不用每条都重填 */
const draft = reactive({ content: '', name: '', email: '' })

const canSend = computed(() => draft.content.trim() && draft.name.trim() && draft.email.trim())

const focusComment = (id: number) => {
  openPanelId.value = null
  composerId.value = id
}

const closeComposer = () => {
  composerId.value = null
  draft.content = ''
}

const submitComment = async (m: any) => {
  if (!canSend.value || sending.value) return
  sending.value = true
  try {
    const res: any = await addMomentGuestComment(m.id, {
      content: draft.content.trim(),
      name: draft.name.trim(),
      email: draft.email.trim()
    })
    if (res?.code !== 200) throw new Error(res?.msg || '评论失败')

    // 后端存为待审核，这里不能把评论插进列表 —— 那会造成「我看得见、别人看不见」的假象
    utilMsg.$message.success(res?.msg || '评论已提交，等待审核后显示')
    localStorage.setItem('mm_guest', JSON.stringify({ name: draft.name, email: draft.email }))
    closeComposer()
  } catch (e: any) {
    utilMsg.$message.warning(e?.message || '评论失败，请稍后再试')
  } finally {
    sending.value = false
  }
}

const nameOf = (c: any) => c.user?.nickName || c.guestName || '匿名'

/** 朋友圈的赞是一串名字，不是数字 */
const likeText = (m: any) => {
  const names = (m.likeUsers || []).map((u: any) => u.nickName).filter(Boolean)
  if (names.length) return names.join('，')
  return `${m.likeCount} 人觉得很赞`
}

/** 1 张大图；4 张走 2×2；其余每行 3 张 */
const gridClass = (n: number) => (n === 1 ? 'is-single' : n === 4 ? 'is-quad' : 'is-grid')

const formatTime = (t: string) => {
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return ''
  const diff = Date.now() - d.getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return '刚刚'
  if (min < 60) return `${min} 分钟前`
  const hour = Math.floor(min / 60)
  if (hour < 24) return `${hour} 小时前`
  const day = Math.floor(hour / 24)
  if (day < 30) return `${day} 天前`
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const lightbox = reactive<{ show: boolean; image: { url: string; title: string } | null }>({
  show: false,
  image: null
})

const openImage = (url: string, title?: string) => {
  lightbox.image = { url, title: title || '' }
  lightbox.show = true
}

onMounted(() => {
  // 恢复上次填过的昵称邮箱，省得每条评论都重填
  try {
    const saved = JSON.parse(localStorage.getItem('mm_guest') || '{}')
    if (saved.name) draft.name = saved.name
    if (saved.email) draft.email = saved.email
  } catch {
    // 本地存储损坏不影响页面
  }
  load(true)
})
</script>

<style scoped>
.mm-page {
  min-height: 100vh;
  background: #fff;
}

/* ---------- 封面 ---------- */
/*
  overflow: hidden 只能加在内层：头像要靠负 bottom 溢出封面底边，
  裁剪写在外层会把头像切掉一半。
*/
.mm-cover {
  position: relative;
  height: 42vh;
  min-height: 260px;
}

.mm-cover-clip {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.mm-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mm-cover-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.28));
}

/* 昵称与头像压在封面底边，头像超出一截 —— 朋友圈的标志性构图 */
.mm-owner {
  position: absolute;
  right: 5%;
  bottom: -26px;
  display: flex;
  align-items: flex-end;
  gap: 14px;
}

.mm-owner-name {
  padding-bottom: 34px;
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
}

.mm-owner-avatar {
  width: 74px;
  height: 74px;
  border-radius: 8px;
  border: 3px solid #fff;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
}

.mm-owner-avatar-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c8c8c8;
  color: #fff;
  font-size: 28px;
}

/* ---------- 信息流 ---------- */
/*
 * 收窄到 520：原来 640 时正文列有 554px 宽，而图片最宽只有 220，
 * 时间贴左、「···」贴右之后两者相距 330px，按钮看着像飞出去了。
 * 收窄列宽 + 放大图片，让内容把这一行填满。
 */
.mm-feed {
  max-width: 520px;
  margin: 0 auto;
  padding: 56px 16px 80px;
}

.mm-item {
  display: flex;
  gap: 12px;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.mm-item:last-of-type {
  border-bottom: none;
}

.mm-avatar {
  flex: none;
  width: 42px;
  height: 42px;
  border-radius: 6px;
  object-fit: cover;
}

.mm-avatar-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c8c8c8;
  color: #fff;
  font-size: 18px;
}

.mm-body {
  flex: 1;
  min-width: 0;
}

.mm-name {
  margin-bottom: 6px;
  color: #576b95;
  font-size: 15px;
  font-weight: 600;
}

.mm-text {
  margin: 0 0 8px;
  font-size: 15px;
  line-height: 1.6;
  color: #1a1a1a;
  white-space: pre-wrap;
  word-break: break-word;
}

/* ---------- 图片 ---------- */
.mm-images {
  display: grid;
  gap: 5px;
  margin-bottom: 8px;
}

/* 单图放大到 300：太小时正文区显得空，和右侧的「···」拉开过大空档 */
.mm-images.is-single {
  grid-template-columns: minmax(0, 1fr);
  max-width: 300px;
}

.mm-images.is-quad {
  grid-template-columns: repeat(2, 1fr);
  max-width: 292px;
}

/* 三列铺满正文区，与下方时间行等宽 */
.mm-images.is-grid {
  grid-template-columns: repeat(3, 1fr);
  max-width: 100%;
}

.mm-image {
  padding: 0;
  border: 0;
  background: #f5f5f5;
  cursor: pointer;
  overflow: hidden;
  aspect-ratio: 1;
}

/* 单图不裁成正方形，按原比例展示，和朋友圈一致 */
.mm-images.is-single .mm-image {
  aspect-ratio: auto;
}

.mm-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mm-images.is-single .mm-image img {
  height: auto;
  max-height: 360px;
  object-fit: contain;
}

.mm-location {
  margin-bottom: 6px;
  color: #576b95;
  font-size: 13px;
}

/* ---------- 时间与操作 ---------- */
/*
 * 时间贴左、「···」贴右，与微信一致。
 * 两者挤在一起时，面板往左弹会正好压住时间；分开后弹进的是空白区。
 */
.mm-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

/*
 * 面板的定位参照系必须是按钮这一层。
 * 挂在 .mm-meta 上会以整行为准，right 值就变成「距整行右边缘」，
 * 面板会甩到最右边、和按钮完全脱节。
 */
.mm-action-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.mm-time {
  color: #b2b2b2;
  font-size: 12px;
}

/* 「···」按钮：两个点的胶囊，与朋友圈一致 */
.mm-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 28px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: #f7f7f7;
  cursor: pointer;
}

.mm-action span {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #576b95;
}

/* 紧贴按钮左侧弹出，与微信一致；垂直居中对齐按钮 */
.mm-panel {
  position: absolute;
  right: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  padding: 0 4px;
  border-radius: 5px;
  background: #4c4c4c;
  white-space: nowrap;
  z-index: 5;
}

.mm-panel-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: 0;
  background: none;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.mm-panel-icon {
  font-size: 13px;
}

.mm-panel-sep {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.2);
}

/* ---------- 赞与评论 ---------- */
.mm-social {
  margin-top: 8px;
  padding: 7px 10px;
  border-radius: 4px;
  background: #f7f7f7;
}

.mm-likes {
  display: flex;
  align-items: flex-start;
  gap: 5px;
}

.mm-like-icon {
  flex: none;
  color: #576b95;
  font-size: 13px;
  line-height: 1.5;
}

.mm-like-text {
  color: #576b95;
  font-size: 13px;
  line-height: 1.5;
}

.mm-social-line {
  height: 1px;
  margin: 6px 0;
  background: #e2e2e2;
}

.mm-comments {
  margin: 0;
  padding: 0;
  list-style: none;
}

.mm-comment {
  font-size: 13px;
  line-height: 1.6;
  color: #1a1a1a;
  word-break: break-word;
}

.mm-comment-name {
  color: #576b95;
}

/* ---------- 评论输入 ---------- */
.mm-composer {
  margin-top: 8px;
  padding: 10px;
  border-radius: 4px;
  background: #f7f7f7;
}

.mm-composer-text {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background: #fff;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  color: #1a1a1a;
  resize: vertical;
  outline: none;
}

.mm-composer-text:focus {
  border-color: #a9b7d0;
}

.mm-composer-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.mm-composer-input {
  flex: 1;
  min-width: 0;
  padding: 7px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  color: #1a1a1a;
  outline: none;
}

.mm-composer-input:focus {
  border-color: #a9b7d0;
}

.mm-composer-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
}

.mm-composer-tip {
  font-size: 12px;
  color: #b2b2b2;
}

.mm-composer-btns {
  display: flex;
  gap: 8px;
}

.mm-composer-cancel,
.mm-composer-send {
  padding: 5px 16px;
  border: 0;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.mm-composer-cancel {
  background: #e9e9e9;
  color: #576b95;
}

.mm-composer-send {
  background: #07c160;
  color: #fff;
}

.mm-composer-send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .mm-composer-row {
    flex-direction: column;
  }

  .mm-composer-foot {
    flex-direction: column;
    align-items: flex-start;
  }
}

.mm-empty {
  padding: 60px 0;
  text-align: center;
  color: #b2b2b2;
  font-size: 14px;
}

.mm-more {
  display: block;
  margin: 24px auto 0;
  padding: 8px 24px;
  border: 1px solid #e5e5e5;
  border-radius: 999px;
  background: #fff;
  color: #576b95;
  font-size: 14px;
  cursor: pointer;
}

.mm-more:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .mm-cover {
    height: 34vh;
  }

  .mm-owner-avatar {
    width: 62px;
    height: 62px;
  }

  .mm-feed {
    padding: 48px 14px 60px;
  }
}
</style>

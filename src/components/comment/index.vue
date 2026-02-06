<template>
  <div class="comments-page">
    <!-- Comments Section -->
    <div class="comments-section">
      <div class="comments-container">
        <!-- Comment Form -->
        <div class="comment-form-wrapper">
          <h2 class="comment-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            来几句走心的评论吧
          </h2>

          <div class="comment-form">
            <textarea 
              v-model="commentText"
              class="comment-textarea" 
              placeholder="一句走心评论，胜过千言万语"
              rows="6"
            ></textarea>

            <!-- Emoji Picker -->
            <div class="emoji-picker">
              <button 
                v-for="emoji in emojis" 
                :key="emoji"
                class="emoji-btn"
                @click="addEmoji(emoji)"
              >
                {{ emoji }}
              </button>
              <button class="emoji-more-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </button>
            </div>

            <!-- Form Fields -->
            <div class="form-fields">
              <div class="input-group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input type="text" placeholder="名称" v-model="userName" required />
              </div>
              <div class="input-group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                  <polyline points="3 4 12 13 21 4"></polyline>
                </svg>
                <input type="email" placeholder="邮箱" v-model="userEmail" required />
              </div>
              <div class="input-group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <input type="url" placeholder="博客链接" v-model="userWebsite" required />
              </div>
              <div class="captcha-group" v-if="captchaData.captchaEnabled">
                <div class="captcha-container">
                  <div class="captcha-display" v-html="captchaData.img" @click="refreshCaptcha" title="点击刷新验证码"></div>
                  <input type="text" placeholder="验证码" v-model="captchaInput" class="captcha-input" required />
                </div>
                <!-- <button type="button" class="captcha-refresh" @click="refreshCaptcha">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
                  </svg>
                </button> -->
              </div>
            </div>
            
            <!-- Submit Button -->
            <div class="submit-section">
              <button 
                type="button" 
                class="submit-btn" 
                @click="submitComment" 
                :disabled="!isFormValid || submitting"
              >
                <svg v-if="submitting" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                {{ submitting ? '提交中...' : '发表评论' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Comments List -->
        <div class="comments-list">
          <h3 class="comments-count">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {{ comments.length }}条评论
          </h3>

          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <span>加载评论中...</span>
          </div>
          
          <div v-else-if="comments.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>还没有评论，快来抢沙发吧！</p>
          </div>
          
          <div v-else>
            <div class="comment-item" v-for="item in commentTree" :key="item.comment.id">
              <!-- 父评论 -->
              <div class="comment-main">
                <img 
                  :src="item.comment.guestAvatar || getAvatarUrl(item.comment.guestEmail || item.comment.email || '')" 
                  :alt="item.comment.guestName || item.comment.name || '匿名用户'" 
                  class="comment-avatar"
                  @error="handleAvatarError"
                />
                <div class="comment-body">
                  <div class="comment-header">
                    <span class="comment-name">{{ item.comment.guestName || item.comment.name || '匿名用户' }}</span>
                    <span class="comment-date">{{ formatDate(item.comment.createTime) }}</span>
                    <div class="comment-actions">
                      <button class="comment-reply-btn" @click="startReply(item.comment.id, item.comment.guestName || item.comment.name)" v-if="replyingTo !== item.comment.id">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        回复
                      </button>
                      <button class="comment-cancel-btn" @click="cancelReply" v-if="replyingTo === item.comment.id">
                        取消
                      </button>
                    </div>
                  </div>
                  <p class="comment-content">{{ item.comment.content }}</p>
                  <div class="comment-meta">
                    <span class="meta-item" v-if="item.comment.address">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {{ item.comment.address }}
                    </span>
                    <span class="meta-item" v-if="item.comment.os">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                      {{ item.comment.os }}
                    </span>
                    <span class="meta-item" v-if="item.comment.browser">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      {{ item.comment.browser }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- 子评论（回复） -->
              <div v-if="item.replies.length > 0" class="replies-list">
                <div class="reply-item" v-for="reply in item.replies" :key="reply.id">
                  <img 
                    :src="reply.guestAvatar || getAvatarUrl(reply.guestEmail || reply.email || '')" 
                    :alt="reply.guestName || reply.name || '匿名用户'" 
                    class="comment-avatar reply-avatar"
                    @error="handleAvatarError"
                  />
                  <div class="comment-body">
                    <div class="comment-header">
                      <span class="comment-name">{{ reply.guestName || reply.name || '匿名用户' }}</span>
                      <span class="reply-to">@{{ item.comment.guestName || item.comment.name || '匿名用户' }}</span>
                      <span class="comment-date">{{ formatDate(reply.createTime) }}</span>
                      <div class="comment-actions">
                        <button class="comment-reply-btn" @click="startReply(item.comment.id, reply.guestName || reply.name)" v-if="replyingTo !== item.comment.id">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          回复
                        </button>
                      </div>
                    </div>
                    <p class="comment-content">{{ reply.content }}</p>
                    <div class="comment-meta">
                      <span class="meta-item" v-if="reply.address">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {{ reply.address }}
                      </span>
                      <span class="meta-item" v-if="reply.os">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                          <line x1="8" y1="21" x2="16" y2="21"></line>
                          <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        {{ reply.os }}
                      </span>
                      <span class="meta-item" v-if="reply.browser">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        {{ reply.browser }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Reply Form -->
              <div v-if="replyingTo === item.comment.id" class="reply-form">
                <div class="reply-form-header">
                  <h4>回复 {{ replyToName }}</h4>
                </div>
                
                <textarea 
                  v-model="replyText"
                  class="reply-textarea" 
                  placeholder="写下你的回复..."
                  rows="4"
                ></textarea>
                
                <!-- Reply Emoji Picker -->
                <div class="emoji-picker">
                  <button 
                    v-for="emoji in emojis.slice(0, 15)" 
                    :key="emoji"
                    class="emoji-btn"
                    @click="addEmoji(emoji)"
                  >
                    {{ emoji }}
                  </button>
                </div>
                
                <!-- Reply Form Fields -->
                <div class="reply-fields">
                  <div class="input-group">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input type="text" placeholder="名称" v-model="replyUserName" required />
                  </div>
                  <div class="input-group">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                      <polyline points="3 4 12 13 21 4"></polyline>
                    </svg>
                    <input type="email" placeholder="邮箱" v-model="replyUserEmail" required />
                  </div>
                  <div class="input-group">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    <input type="url" placeholder="博客链接" v-model="replyUserWebsite" required />
                  </div>
                  <div class="captcha-group" v-if="captchaData.captchaEnabled">
                    <div class="captcha-container">
                      <div class="captcha-display" v-html="captchaData.img" @click="refreshCaptcha" title="点击刷新验证码"></div>
                      <input type="text" placeholder="验证码" v-model="replyCaptchaInput" class="captcha-input" required />
                    </div>
                    <!-- <button type="button" class="captcha-refresh" @click="refreshCaptcha">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
                      </svg>
                    </button> -->
                  </div>
                </div>
                
                <!-- Reply Submit Button -->
                <div class="reply-submit-section">
                  <button 
                    type="button" 
                    class="submit-btn reply-submit-btn" 
                    @click="submitReply" 
                    :disabled="!isReplyFormValid || submitting"
                  >
                    <svg v-if="submitting" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    {{ submitting ? '提交中...' : '发表回复' }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 分页 -->
            <div v-if="total > pageSize" class="pagination">
              <button 
                class="pagination-btn" 
                :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)"
              >
                上一页
              </button>
              <span class="pagination-info">{{ currentPage }} / {{ Math.ceil(total / pageSize) }}</span>
              <button 
                class="pagination-btn" 
                :disabled="currentPage >= Math.ceil(total / pageSize)"
                @click="handlePageChange(currentPage + 1)"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useClientIp } from '~/composables/useClientIp'
import { useDeviceInfo } from '~/composables/useDeviceInfo'
import { getCommentList, getReplyList, addComment } from '~/api/comment'
import { getCaptcha, type CaptchaData } from '~/api/captcha'

// 获取客户端IP和设备信息
const { getClientIp } = useClientIp()
const { getBrowserInfo, getOSInfo } = useDeviceInfo()

// Props
interface Props {
  articleId: number
}

const props = defineProps<Props>()

// 表单数据
const commentText = ref('')
const userName = ref('')
const userEmail = ref('')
const userWebsite = ref('')
const captchaInput = ref('')

// 验证码数据
const captchaData = ref<CaptchaData>({
  captchaEnabled: false,
  img: '',
  uuid: ''
})

// 回复相关
const replyingTo = ref<number | null>(null)
const replyToName = ref('')
const replyText = ref('')
const replyUserName = ref('')
const replyUserEmail = ref('')
const replyUserWebsite = ref('')
const replyCaptchaInput = ref('')

// 评论数据
const comments = ref<any[]>([])
const loading = ref(false)
const submitting = ref(false)

// 评论树结构（父评论 -> 子评论）
interface CommentWithReplies {
  comment: any
  replies: any[]
}

const commentTree = computed(() => {
  const tree: CommentWithReplies[] = []
  const parentComments = comments.value.filter(c => !c.parentId)
  
  parentComments.forEach(parent => {
    const replies = comments.value.filter(c => c.parentId === parent.id)
    tree.push({
      comment: parent,
      replies: replies
    })
  })
  
  return tree
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表情包
const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓']

// 计算属性
const isFormValid = computed(() => {
  return commentText.value.trim() && 
         userName.value.trim() && 
         userEmail.value.trim() && 
         userWebsite.value.trim() && 
         (!captchaData.value.captchaEnabled || captchaInput.value.trim())
})

const isReplyFormValid = computed(() => {
  return replyText.value.trim() && 
         replyUserName.value.trim() && 
         replyUserEmail.value.trim() && 
         replyUserWebsite.value.trim() && 
         (!captchaData.value.captchaEnabled || replyCaptchaInput.value.trim())
})

// 添加表情
const addEmoji = (emoji: string) => {
  if (replyingTo.value) {
    replyText.value += emoji
  } else {
    commentText.value += emoji
  }
}

// 获取验证码
const fetchCaptcha = async () => {
  try {
    const response = await getCaptcha() as any
    if (response.code === 200) {
      captchaData.value = response.data
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

// 刷新验证码
const refreshCaptcha = async () => {
  await fetchCaptcha()
}

// 获取评论列表
const fetchComments = async () => {
  if (!props.articleId) return
  
  loading.value = true
  try {
    const response = await getCommentList(props.articleId, currentPage.value, pageSize.value) as any
    if (response.code === 200) {
      comments.value = response.data.records || response.data.list || []
      total.value = response.data.total || 0
    }
  } catch (error) {
    console.error('获取评论失败:', error)
  } finally {
    loading.value = false
  }
}

// 提交评论
const submitComment = async () => {
  if (!isFormValid.value) {
    console.warn('表单验证失败')
    return
  }

  submitting.value = true
  try {
    // 获取客户端真实IP
    const clientIp = await getClientIp()
    // 获取设备和浏览器信息
    const browser = getBrowserInfo()
    const os = getOSInfo()
    
    
    const commentData = {
      articleId: props.articleId,
      content: commentText.value.trim(),
      name: userName.value.trim(),
      email: userEmail.value.trim(),
      website: userWebsite.value.trim(),
      captcha: captchaInput.value.trim(),
      captchaUuid: captchaData.value.uuid,
      clientIp: clientIp || undefined,  // 客户端IP
      browser: browser || undefined,     // 浏览器信息
      os: os || undefined                // 操作系统信息
    }

    const response = await addComment(commentData) as any

    
    if (response) {
      utilMsg.$message.success('评论发表成功！')
      // 重置表单
      commentText.value = ''
      captchaInput.value = ''
      // 刷新评论列表
      await fetchComments()
      // 刷新验证码
      if (captchaData.value.captchaEnabled) {
        await refreshCaptcha()
      }
    } else {
      const errorMsg = response?.msg || '评论提交失败，请稍后重试'
      utilMsg.$message.error(errorMsg)
      console.error('评论提交失败:', errorMsg)
    }
  } catch (error: any) {
    const errorMsg = error?.message || error?.data?.message || '网络错误，请检查网络连接'
    utilMsg.$message.error(errorMsg)
    console.error('提交评论失败:', error)
  } finally {
    submitting.value = false
  }
}

// 提交回复
const submitReply = async () => {
  if (!isReplyFormValid.value || !replyingTo.value) {
    return
  }

  submitting.value = true
  try {
    // 获取客户端真实IP
    const clientIp = await getClientIp()
    // 获取设备和浏览器信息
    const browser = getBrowserInfo()
    const os = getOSInfo()
    
    const replyData = {
      articleId: props.articleId,
      content: replyText.value.trim(),
      parentId: replyingTo.value,
      name: replyUserName.value.trim(),
      email: replyUserEmail.value.trim(),
      website: replyUserWebsite.value.trim(),
      captcha: replyCaptchaInput.value.trim(),
      captchaUuid: captchaData.value.uuid,
      clientIp: clientIp || undefined,  // 客户端IP
      browser: browser || undefined,     // 浏览器信息
      os: os || undefined                // 操作系统信息
    }

    const response = await addComment(replyData) as any
    
    if (response && response.code === 200) {
      utilMsg.$message.success('回复发表成功！')
      // 重置回复表单
      cancelReply()
      // 刷新评论列表
      await fetchComments()
      // 刷新验证码
      if (captchaData.value.captchaEnabled) {
        await refreshCaptcha()
      }
    } else {
      const errorMsg = response?.msg || '回复提交失败，请稍后重试'
      utilMsg.$message.error(errorMsg)
      console.error('回复提交失败:', errorMsg)
    }
  } catch (error: any) {
    const errorMsg = error?.message || error?.data?.message || '网络错误，请检查网络连接'
    utilMsg.$message.error(errorMsg)
    console.error('提交回复失败:', error)
  } finally {
    submitting.value = false
  }
}

// 开始回复
const startReply = (commentId: number, commentName?: string) => {
  replyingTo.value = commentId
  replyToName.value = commentName || '匿名用户'
  replyText.value = ''
  replyUserName.value = userName.value
  replyUserEmail.value = userEmail.value
  replyUserWebsite.value = userWebsite.value
  replyCaptchaInput.value = ''
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  replyToName.value = ''
  replyText.value = ''
  replyUserName.value = ''
  replyUserEmail.value = ''
  replyUserWebsite.value = ''
  replyCaptchaInput.value = ''
}

// 头像加载失败处理
const handleAvatarError = (e: Event) => {
  const target = e.target as HTMLImageElement
  // 使用默认头像
  target.src = 'https://www.gravatar.com/avatar/default?d=identicon&s=64'
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return Math.floor(diff / minute) + ' 分钟前'
  } else if (diff < day) {
    return Math.floor(diff / hour) + ' 小时前'
  } else if (diff < 7 * day) {
    return Math.floor(diff / day) + ' 天前'
  } else {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }
}

// 分页相关
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchComments()
  // 滚动到评论区顶部
  const commentsSection = document.querySelector('.comments-list')
  if (commentsSection) {
    commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 生成头像URL
const getAvatarUrl = (email: string) => {
  // 使用Gravatar或默认头像
  return `https://www.gravatar.com/avatar/${btoa(email)}?d=identicon&s=40`
}

// 组件挂载时初始化
onMounted(async () => {
  await fetchCaptcha()
  await fetchComments()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.comments-page {
  width: 100%;
  background: linear-gradient(to bottom, #faf9f7 0%, #f5f3f0 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* Comments Section */
.comments-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
/* 
.comments-container {
  max-width: 800px;
  margin: 0 auto;
} */

/* Comment Form */
.comment-form-wrapper {
  margin-bottom: 48px;
}

.comment-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 600;
  color: #e88b8b;
  margin-bottom: 24px;
}

.comment-title svg {
  stroke: #e88b8b;
}

.comment-form {
  background: #faf9f7;
  border-radius: 20px;
  padding: 24px;
}

.comment-textarea, .reply-textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #e8e3dd;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.6;
  color: #2c2420;
  background: white;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.comment-textarea:focus, .reply-textarea:focus {
  outline: none;
  border-color: #d4b5a0;
  box-shadow: 0 0 0 3px rgba(212, 181, 160, 0.1);
}

.comment-textarea::placeholder, .reply-textarea::placeholder {
  color: #b5a599;
}

/* Emoji Picker */
.emoji-picker {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e8e3dd;
}

.emoji-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-btn:hover {
  background: #f8f6f3;
  transform: scale(1.15);
}

.emoji-more-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f6f3;
  border-radius: 50%;
  color: #9c8878;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.emoji-more-btn:hover {
  background: #f0ebe6;
  transform: rotate(90deg);
}

/* Form Fields */
.form-fields, .reply-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

@media (max-width: 640px) {
  .form-fields, .reply-fields {
    grid-template-columns: 1fr;
  }
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e8e3dd;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.input-group:focus-within {
  border-color: #d4b5a0;
  box-shadow: 0 0 0 3px rgba(212, 181, 160, 0.1);
}

.input-group svg {
  color: #b5a599;
  flex-shrink: 0;
}

.input-group input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #2c2420;
  background: transparent;
}

.input-group input::placeholder {
  color: #b5a599;
}

.captcha-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.captcha-container {
  flex: 1;
  display: flex;
  border: 1px solid #e8e3dd;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
}

.captcha-container:focus-within {
  border-color: #d4b5a0;
  box-shadow: 0 0 0 3px rgba(212, 181, 160, 0.1);
}

.captcha-display {
  width: 100px;
  height: 48px;
  padding: 8px 12px;
  background: #f8f6f3;
  border-right: 1px solid #e8e3dd;
  font-size: 16px;
  font-weight: 600;
  color: #2c2420;
  text-align: center;
  font-family: 'Courier New', monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.captcha-display svg {
  max-width: 100%;
  max-height: 100%;
  height: auto;
}

.captcha-input {
  flex: 1;
  min-width: 150px;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
  color: #2c2420;
  background: transparent;
  height: 48px;
}

.captcha-input::placeholder {
  color: #b5a599;
}

/* .captcha-refresh {
  width: 28px;
  height: 28px;
  border: none;
  background: #e88b8b;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.captcha-refresh:hover {
  background: #d67878;
  transform: rotate(180deg);
} */

/* Submit Button */
.submit-section, .reply-submit-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #e88b8b;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #d67878;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 139, 139, 0.3);
}

.submit-btn:disabled {
  background: #b5a599;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 分页样式 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding: 20px 0;
}

.pagination-btn {
  padding: 8px 16px;
  background: #e88b8b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #d67878;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  background: #ddd;
  color: #999;
  cursor: not-allowed;
  transform: none;
}

.pagination-info {
  font-size: 14px;
  color: #666;
  min-width: 60px;
  text-align: center;
}

/* Comments List */
.comments-list {
  margin-top: 48px;
}

.comments-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.comments-count svg {
  stroke: #999;
  width: 16px;
  height: 16px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #b5a599;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0ebe6;
  border-top: 3px solid #e88b8b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.empty-state svg {
  color: #d4b5a0;
  margin-bottom: 16px;
}

.comment-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 0;
  margin-bottom: 0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-main {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.comment-name {
  font-size: 14px;
  font-weight: 600;
  color: #2c2420;
}

/* 评论元信息（IP、设备、浏览器） */
.comment-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.meta-item svg {
  flex-shrink: 0;
}

.comment-date {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 0;
  word-wrap: break-word;
}

/* 回复列表样式 */
.replies-list {
  margin-left: 44px;
  margin-top: 12px;
  padding-left: 16px;
  border-left: 2px solid #f0ebe6;
}

.reply-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f8f6f3;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-avatar {
  width: 28px;
  height: 28px;
}

.reply-to {
  font-size: 13px;
  color: #e88b8b;
  font-weight: 500;
}

.comment-reply-btn, .comment-cancel-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  border-radius: 4px;
}

.comment-reply-btn:hover {
  color: #666;
  background: #f5f5f5;
}

.comment-cancel-btn {
  color: #ff6b6b;
}

.comment-cancel-btn:hover {
  background: #fff5f5;
}

.comment-cancel-btn:hover {
  background: #fef0f0;
}

.comment-date {
  font-size: 12px;
  color: #b5a599;
}

.comment-content {
  font-size: 14px;
  line-height: 1.7;
  color: #4a4038;
  white-space: pre-line;
}

/* Reply Form */
.reply-form {
  margin-top: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e3dd;
}

.reply-form-header {
  margin-bottom: 12px;
}

.reply-form-header h4 {
  font-size: 14px;
  color: #e88b8b;
  font-weight: 600;
}

.reply-submit-btn {
  background: #9c8878;
}

.reply-submit-btn:hover:not(:disabled) {
  background: #8a766a;
}

/* Responsive Design */
@media (max-width: 768px) {
  .comments-section {
    padding: 32px 16px;
  }
  
  .form-fields, .reply-fields {
    grid-template-columns: 1fr;
  }
  
  .emoji-picker {
    max-height: 120px;
    overflow-y: auto;
  }
  
  .captcha-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .captcha-container {
    width: 100%;
  }
  
  .captcha-display {
    width: 90px;
    height: 40px;
    font-size: 14px;
  }
  
  .captcha-input {
    height: 40px;
    padding: 8px 12px;
    font-size: 14px;
    min-width: 120px;
  }
}

@media (max-width: 480px) {
  .captcha-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .captcha-container {
    width: 100%;
  }
  
  .captcha-display {
    width: 90px;
    height: 40px;
    font-size: 14px;
  }
  
  .captcha-input {
    height: 40px;
    padding: 8px 12px;
    font-size: 14px;
  }
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #b5a599;
}

/* Post Text */
.post-text {
  font-size: 15px;
  line-height: 1.7;
  color: #4a4038;
  margin-bottom: 20px;
}

/* Post Footer */
.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0ebe6;
}

.post-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #9c8878;
}

.like-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: #f8f6f3;
  border-radius: 50%;
  color: #9c8878;
  cursor: pointer;
  transition: all 0.3s ease;
}

.like-btn:hover {
  background: #f0ebe6;
  transform: scale(1.1);
}

.like-btn.liked {
  color: #e88b8b;
  background: #fef0f0;
}

/* Comments Section */
.comments-section {
  background: white;
  /* padding: 64px 24px; */
}

.comments-container {
  max-width: 1900px;
  margin: 0 auto;
}

/* Comment Form */
.comment-form-wrapper {
  margin-bottom: 48px;
}

.comment-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 600;
  color: #e88b8b;
  margin-bottom: 24px;
}

.comment-title svg {
  stroke: #e88b8b;
}

.comment-form {
  background: #faf9f7;
  border-radius: 20px;
  padding: 24px;
}

.comment-textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #e8e3dd;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.6;
  color: #2c2420;
  background: white;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.comment-textarea:focus {
  outline: none;
  border-color: #d4b5a0;
  box-shadow: 0 0 0 3px rgba(212, 181, 160, 0.1);
}

.comment-textarea::placeholder {
  color: #b5a599;
}

/* Emoji Picker */
.emoji-picker {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e8e3dd;
}

.emoji-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-btn:hover {
  background: #f8f6f3;
  transform: scale(1.15);
}

.emoji-more-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f6f3;
  border-radius: 50%;
  color: #9c8878;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.emoji-more-btn:hover {
  background: #f0ebe6;
  transform: rotate(90deg);
}

/* Form Fields */
.form-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e8e3dd;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.input-group:focus-within {
  border-color: #d4b5a0;
  box-shadow: 0 0 0 3px rgba(212, 181, 160, 0.1);
}

.input-group svg {
  color: #b5a599;
  flex-shrink: 0;
}

.input-group input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #2c2420;
  background: transparent;
}

.input-group input::placeholder {
  color: #b5a599;
}


</style>
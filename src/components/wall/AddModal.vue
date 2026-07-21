<template>
  <n-modal :show="show" @update:show="emit('update:show', $event)">
    <div class="wall-form-card">
      <header class="wall-form-header">
        <h3>写下你想说的话</h3>
        <button type="button" class="wall-form-close" aria-label="关闭" @click="close">×</button>
      </header>

      <form class="wall-form-body" @submit.prevent="submit">
        <label class="wall-field">
          <span class="wall-label">留言内容 <em>*</em></span>
          <textarea
            v-model="form.content"
            class="wall-textarea"
            rows="4"
            :maxlength="CONTENT_MAX"
            placeholder="示例：你好呀！很喜欢你的博客～"
          />
          <span class="wall-counter">{{ form.content.length }} / {{ CONTENT_MAX }}</span>
        </label>

        <div class="wall-row">
          <label class="wall-field">
            <span class="wall-label">昵称（选填）</span>
            <input v-model="form.name" class="wall-input" maxlength="50" placeholder="不填则显示「匿名」" />
          </label>

          <label class="wall-field">
            <span class="wall-label">邮箱（选填）</span>
            <input v-model="form.email" class="wall-input" placeholder="仅站长可见，不会公开" />
          </label>
        </div>

        <div class="wall-field">
          <span class="wall-label">留言分类 <em>*</em></span>
          <div class="wall-cate-list">
            <button
              v-for="cate in cates"
              :key="cate.id"
              type="button"
              class="wall-cate-btn"
              :class="{ active: form.cateId === cate.id }"
              @click="form.cateId = cate.id"
            >
              {{ cate.name }}
            </button>
          </div>
        </div>

        <div class="wall-field">
          <span class="wall-label">便签颜色</span>
          <div class="wall-color-list">
            <button
              v-for="color in COLORS"
              :key="color.value"
              type="button"
              class="wall-color-btn"
              :class="{ active: form.color === color.value }"
              :style="{ background: color.preview }"
              :aria-label="color.label"
              @click="form.color = color.value"
            />
          </div>
        </div>

        <div v-if="captcha.captchaEnabled" class="wall-field">
          <span class="wall-label">验证码 <em>*</em></span>
          <div class="wall-captcha-row">
            <div class="wall-captcha-img" title="点击刷新验证码" v-html="captcha.img" @click="refreshCaptcha" />
            <input v-model="form.captcha" class="wall-input" placeholder="请输入图中结果" />
          </div>
        </div>

        <p v-if="errorMsg" class="wall-error">{{ errorMsg }}</p>

        <button type="submit" class="wall-submit" :disabled="submitting">
          {{ submitting ? '提交中…' : '提交留言' }}
        </button>

        <p class="wall-tip">留言需站长审核通过后才会出现在墙上</p>
      </form>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { addWall, type WallCate } from '~/api/wall'
import { getCaptcha, type CaptchaData } from '~/api/captcha'
import utilMsg from '~/composables/utilMsg'

const props = defineProps<{ show: boolean; cates: WallCate[] }>()
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'submitted'): void
}>()

/** 与后端 WALL_CONTENT_MAX 保持一致 */
const CONTENT_MAX = 500

/** 与后端 WALL_COLORS 白名单保持一致 */
const COLORS = [
  { value: '#ffe3944d', label: '暖黄', preview: 'linear-gradient(145deg,#FEF3C7,#FDE68A)' },
  { value: '#fcafa24d', label: '樱粉', preview: 'linear-gradient(145deg,#FFE4E6,#FECDD3)' },
  { value: '#a8ed8a4d', label: '薄荷', preview: 'linear-gradient(145deg,#D1FAE5,#A7F3D0)' },
  { value: '#caa7f74d', label: '藕紫', preview: 'linear-gradient(145deg,#EDE9FE,#DDD6FE)' },
  { value: '#92e6f54d', label: '天青', preview: 'linear-gradient(145deg,#DBEAFE,#BFDBFE)' }
]

/** 与评论区共用同一份访客信息，填过一次就不用再填 */
const GUEST_INFO_KEY = 'comment_guest_info'

const form = reactive({
  content: '',
  name: '',
  email: '',
  cateId: 0,
  color: COLORS[0].value,
  captcha: ''
})

const captcha = ref<CaptchaData>({ captchaEnabled: false, img: '', uuid: '' })
const submitting = ref(false)
const errorMsg = ref('')

const refreshCaptcha = async () => {
  try {
    const res = (await getCaptcha()) as any
    if (res?.code === 200) captcha.value = res.data
  } catch {
    // 验证码拉取失败时保持原图，用户可再次点击刷新
  }
}

const restoreGuestInfo = () => {
  try {
    const raw = localStorage.getItem(GUEST_INFO_KEY)
    if (!raw) return
    const info = JSON.parse(raw)
    form.name = info.name || ''
    form.email = info.email || ''
  } catch {
    // 本地数据损坏时忽略
  }
}

const close = () => emit('update:show', false)

// 打开时才拉验证码，避免页面加载就发无谓请求
watch(
  () => props.show,
  (visible) => {
    if (!visible) return
    errorMsg.value = ''
    restoreGuestInfo()
    if (!form.cateId) form.cateId = props.cates[0]?.id || 0
    refreshCaptcha()
  }
)

const submit = async () => {
  errorMsg.value = ''

  if (!form.content.trim()) {
    errorMsg.value = '请输入留言内容'
    return
  }
  if (!form.cateId) {
    errorMsg.value = '请选择留言分类'
    return
  }
  if (captcha.value.captchaEnabled && !form.captcha.trim()) {
    errorMsg.value = '请输入验证码'
    return
  }

  submitting.value = true
  try {
    const res = (await addWall({
      cateId: form.cateId,
      content: form.content.trim(),
      name: form.name.trim() || undefined,
      email: form.email.trim() || undefined,
      color: form.color,
      captcha: form.captcha.trim(),
      captchaUuid: captcha.value.uuid
    })) as any

    if (res?.code !== 200) {
      errorMsg.value = res?.msg || '提交失败，请稍后再试'
      await refreshCaptcha()
      return
    }

    utilMsg.$message?.success(res.msg || '提交成功，等待审核')
    form.content = ''
    form.captcha = ''
    emit('submitted')
    close()
  } catch (error: any) {
    errorMsg.value = error?.data?.msg || error?.data?.message || '提交失败，请稍后再试'
    await refreshCaptcha()
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.wall-form-card {
  width: min(560px, 92vw);
  max-height: 88vh;
  overflow-y: auto;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
}

.dark .wall-form-card {
  background: #26262a;
}

.wall-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 12px;
}

.wall-form-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #3a3a3a;
}

.dark .wall-form-header h3 {
  color: #eee;
}

.wall-form-close {
  border: none;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  color: #b0a698;
  cursor: pointer;
  transition: color 0.2s ease;
}

.wall-form-close:hover {
  color: #e88b8f;
}

.wall-form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 24px 24px;
}

.wall-field {
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
}

.wall-row {
  display: flex;
  gap: 14px;
}

.wall-label {
  font-size: 13px;
  color: #8a8175;
}

.wall-label em {
  font-style: normal;
  color: #e88b8f;
}

.wall-input,
.wall-textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #e6e0d8;
  border-radius: 10px;
  background: #fbfaf8;
  font-size: 14px;
  color: #3a3a3a;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.dark .wall-input,
.dark .wall-textarea {
  border-color: #3a3a40;
  background: #2e2e33;
  color: #ddd;
}

.wall-input:focus,
.wall-textarea:focus {
  border-color: #e88b8f;
  background: #fff;
}

.wall-textarea {
  resize: vertical;
  line-height: 1.7;
}

.wall-counter {
  position: absolute;
  right: 10px;
  bottom: 8px;
  font-size: 11px;
  color: #b8b0a6;
}

.wall-cate-list,
.wall-color-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wall-cate-btn {
  padding: 6px 14px;
  border: 1px solid #e6e0d8;
  border-radius: 999px;
  background: #fbfaf8;
  font-size: 13px;
  color: #6f6659;
  cursor: pointer;
  transition: all 0.25s ease;
}

.dark .wall-cate-btn {
  border-color: #3a3a40;
  background: #2e2e33;
  color: #bbb;
}

.wall-cate-btn:hover {
  border-color: #e88b8f;
  color: #e88b8f;
}

.wall-cate-btn.active {
  border-color: transparent;
  background: #e88b8f;
  color: #fff;
}

.wall-color-btn {
  width: 34px;
  height: 34px;
  border: 2px solid transparent;
  border-radius: 9px;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.wall-color-btn:hover {
  transform: translateY(-2px);
}

.wall-color-btn.active {
  border-color: #9c8878;
  transform: translateY(-2px);
}

.wall-captcha-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wall-captcha-img {
  flex-shrink: 0;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
}

.wall-captcha-img :deep(svg) {
  display: block;
  height: 40px;
}

.wall-error {
  margin: 0;
  font-size: 13px;
  color: #e05a5a;
}

.wall-submit {
  margin-top: 4px;
  padding: 11px;
  border: none;
  border-radius: 30px;
  background: #e88b8f;
  font-size: 15px;
  color: #fff;
  cursor: pointer;
  transition: background 0.25s ease, opacity 0.25s ease;
}

.wall-submit:hover:not(:disabled) {
  background: #dd7a7f;
}

.wall-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.wall-tip {
  margin: 0;
  text-align: center;
  font-size: 12px;
  color: #b0a698;
}

@media (max-width: 640px) {
  .wall-row {
    flex-direction: column;
  }
}
</style>

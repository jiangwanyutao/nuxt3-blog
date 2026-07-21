<template>
  <div class="copyright-block">
    <div class="copyright-head">
      <Icon name="material-symbols:copyright" size="18" />
      <span class="copyright-title">版权声明</span>
    </div>

    <dl class="copyright-list">
      <div class="copyright-row">
        <dt>本文链接</dt>
        <dd>
          <a :href="fullUrl" class="copyright-link">{{ fullUrl }}</a>
        </dd>
      </div>
      <div class="copyright-row">
        <dt>著作权归</dt>
        <dd>{{ author }} 所有，转载请注明出处</dd>
      </div>
      <div class="copyright-row">
        <dt>许可协议</dt>
        <dd>
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
            target="_blank"
            rel="noopener noreferrer"
            class="copyright-link"
          >
            CC BY-NC-SA 4.0（署名-非商业性使用-相同方式共享）
          </a>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  articleId: number | string
  author?: string
}>()

const author = computed(() => props.author || '江晚正愁余')

// SSR 阶段没有 window，用请求 URL 兜底
const requestUrl = useRequestURL()
const fullUrl = computed(() => `${requestUrl.origin}/article/${props.articleId}`)
</script>

<style scoped>
.copyright-block {
  margin: 32px 0 8px;
  padding: 20px 24px;
  border-radius: 14px;
  background: #f7f4f0;
  border-left: 4px solid #e88b8f;
}

.dark .copyright-block {
  background: rgba(255, 255, 255, 0.04);
}

.copyright-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  color: #9c8878;
}

.copyright-title {
  font-size: 15px;
  font-weight: 600;
}

.copyright-list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.copyright-row {
  display: flex;
  gap: 12px;
  font-size: 13px;
  line-height: 1.7;
}

.copyright-row dt {
  flex-shrink: 0;
  width: 64px;
  color: #a89f92;
}

.copyright-row dd {
  margin: 0;
  color: #666;
  word-break: break-all;
}

.dark .copyright-row dd {
  color: #bbb;
}

.copyright-link {
  color: #9c8878;
  text-decoration: none;
  border-bottom: 1px dashed rgba(156, 136, 120, 0.5);
  transition: color 0.2s ease;
}

.copyright-link:hover {
  color: #e88b8f;
}

@media (max-width: 640px) {
  .copyright-row {
    flex-direction: column;
    gap: 2px;
  }

  .copyright-row dt {
    width: auto;
  }
}
</style>

<template>
  <div class="wc-wrap">
    <!--
      便签高度要一致，内容超长时内部滚动而不是撑高卡片。
      滚轮事件在这里截停，否则在便签上滚动会连带整页一起滚。
    -->
    <div ref="boxEl" class="wc-body" :class="{ 'is-masked': showHint }" @wheel.stop>
      {{ content }}
    </div>

    <button v-if="showHint" type="button" class="wc-more" aria-label="查看更多内容" @click="scrollMore">
      <span class="wc-rule" />
      <span class="wc-arrow">⌄</span>
      <span class="wc-rule" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{ content: string }>()

/** 每次点击向下滚动的距离 */
const SCROLL_STEP = 72
/** 判定「已到底」的容差，避免亚像素误差导致提示一直不消失 */
const BOTTOM_EPS = 2

const boxEl = ref<HTMLElement | null>(null)
const canScroll = ref(false)
const atBottom = ref(true)

const showHint = computed(() => canScroll.value && !atBottom.value)

const update = () => {
  const el = boxEl.value
  if (!el) return
  canScroll.value = el.scrollHeight > el.clientHeight + BOTTOM_EPS
  atBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - BOTTOM_EPS
}

const scrollMore = () => {
  boxEl.value?.scrollBy({ top: SCROLL_STEP, behavior: 'smooth' })
}

let observer: ResizeObserver | null = null

onMounted(() => {
  update()
  boxEl.value?.addEventListener('scroll', update, { passive: true })
  // 字体加载完或容器宽度变化都会改变行数，光靠首次测量会误判
  if (boxEl.value && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(update)
    observer.observe(boxEl.value)
  }
})

watch(
  () => props.content,
  () => nextTick(update)
)

onBeforeUnmount(() => {
  boxEl.value?.removeEventListener('scroll', update)
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
.wc-wrap {
  position: relative;
  z-index: 10;
  margin-bottom: 16px;
}

.wc-body {
  max-height: 160px;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  font-size: 14px;
  line-height: 1.75;
  color: #292524;
  white-space: pre-wrap;
  word-break: break-word;
  scrollbar-width: none;
}

.wc-body::-webkit-scrollbar {
  display: none;
}

/* 底部渐隐，暗示下面还有内容 */
.wc-body.is-masked {
  -webkit-mask-image: linear-gradient(to bottom, black 78%, transparent);
  mask-image: linear-gradient(to bottom, black 78%, transparent);
}

.wc-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  margin-top: 8px;
  padding: 2px 0;
  border: 0;
  background: none;
  cursor: pointer;
  color: rgba(120, 113, 108, 0.9);
  transition: color 0.2s;
}

.wc-more:hover {
  color: #57534e;
}

.wc-rule {
  width: 32px;
  height: 1px;
  background: rgba(120, 113, 108, 0.25);
}

.wc-arrow {
  font-size: 14px;
  line-height: 1;
  animation: wc-bounce 1s infinite;
}

@keyframes wc-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wc-arrow {
    animation: none;
  }
}
</style>

<template>
  <teleport to="body">
    <div
      ref="ballRef"
      class="floating-tools"
      :class="{ expanded }"
      :style="{ right: `${pos.right}px`, bottom: `${pos.bottom}px` }"
      @pointerdown="onPointerDown"
    >
      <!-- 展开的功能按钮 -->
      <transition-group name="tool-pop" tag="div" class="tool-actions">
        <button v-if="expanded" key="search" class="tool-btn" title="搜索 (Ctrl+K)" @click.stop="openSearch">
          <Icon name="material-symbols:search" size="18" />
        </button>
        <button v-if="expanded" key="rss" class="tool-btn" title="RSS 订阅" @click.stop="openRss">
          <Icon name="material-symbols:rss-feed" size="18" />
        </button>
        <button v-if="expanded" key="theme" class="tool-btn" title="切换主题" @click.stop="toggleTheme">
          <Icon :name="isDark ? 'material-symbols:light-mode' : 'material-symbols:dark-mode'" size="18" />
        </button>
        <!-- 回到顶部：仅在滚动超过阈值时出现（替代原独立的 n-back-top 按钮） -->
        <button
          v-if="expanded && showBackTop"
          key="top"
          class="tool-btn"
          title="返回顶部"
          @click.stop="backToTop"
        >
          <Icon name="material-symbols:arrow-upward" size="18" />
        </button>
      </transition-group>

      <!-- 主球 -->
      <button class="tool-ball" :title="expanded ? '收起' : '工具'" @click="onBallClick">
        <Icon :name="expanded ? 'material-symbols:close' : 'material-symbols:widgets'" size="20" />
      </button>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useColorMode } from '#imports'
import { useSearchStore } from '~/stores/searchStore'

/** 拖动判定阈值（px），小于该值视为点击 */
const DRAG_THRESHOLD = 6
/** 滚动超过该距离才显示「返回顶部」（与原 n-back-top 的 visibility-height 保持一致） */
const BACK_TOP_VISIBILITY_HEIGHT = 300

const searchStore = useSearchStore()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const expanded = ref(false)
const ballRef = ref<HTMLElement | null>(null)
const pos = reactive({ right: 24, bottom: 24 })

// 页面是否已向下滚动足够距离（决定「返回顶部」是否出现）
const showBackTop = ref(false)
const onScroll = () => {
  showBackTop.value = window.scrollY > BACK_TOP_VISIBILITY_HEIGHT
}

let dragStart: { x: number; y: number; right: number; bottom: number } | null = null
let dragged = false

const onPointerDown = (e: PointerEvent) => {
  dragStart = { x: e.clientX, y: e.clientY, right: pos.right, bottom: pos.bottom }
  dragged = false
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

const onPointerMove = (e: PointerEvent) => {
  if (!dragStart) return
  const dx = e.clientX - dragStart.x
  const dy = e.clientY - dragStart.y
  if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) dragged = true
  if (!dragged) return
  const max = { right: window.innerWidth - 60, bottom: window.innerHeight - 60 }
  pos.right = Math.min(Math.max(8, dragStart.right - dx), max.right)
  pos.bottom = Math.min(Math.max(8, dragStart.bottom - dy), max.bottom)
}

const onPointerUp = () => {
  dragStart = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

const onBallClick = () => {
  // 拖动结束触发的 click 不切换展开状态
  if (dragged) {
    dragged = false
    return
  }
  expanded.value = !expanded.value
}

const openSearch = () => {
  expanded.value = false
  searchStore.setModal(true)
}

const openRss = () => {
  expanded.value = false
  window.open('/rss.xml', '_blank', 'noopener')
}

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const backToTop = () => {
  expanded.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})
</script>

<style scoped>
.floating-tools {
  position: fixed;
  z-index: 950;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  touch-action: none;
  user-select: none;
}

.tool-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tool-ball,
.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tool-ball {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #e89b8f, #9c8878);
  box-shadow: 0 6px 20px rgba(156, 136, 120, 0.45);
}

.tool-ball:hover {
  transform: scale(1.08);
}

.tool-btn {
  width: 40px;
  height: 40px;
  background: #fff;
  color: #9c8878;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.dark .tool-btn {
  background: #2f2f34;
  color: #d3c4b5;
}

.tool-btn:hover {
  transform: scale(1.1);
}

.tool-pop-enter-active,
.tool-pop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tool-pop-enter-from,
.tool-pop-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.8);
}
</style>

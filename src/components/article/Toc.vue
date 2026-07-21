<template>
  <!-- 桌面端：随内容滚动高亮的目录列表 -->
  <nav class="toc-desktop" v-if="headings.length">
    <h3 class="toc-title">目录</h3>
    <ul class="toc-list">
      <li
        v-for="h in headings"
        :key="h.id"
        :class="[`toc-level-${h.level}`, { active: activeId === h.id }]"
        @click="scrollTo(h.id)"
      >
        {{ h.text }}
      </li>
    </ul>
  </nav>

  <!-- 移动端：悬浮按钮 + 弹出目录 -->
  <teleport to="body">
    <div v-if="headings.length" class="toc-mobile">
      <button class="toc-fab" @click="mobileOpen = !mobileOpen" aria-label="目录">
        <Icon name="material-symbols:format-list-bulleted" size="22" />
      </button>
      <transition name="toc-pop">
        <div v-if="mobileOpen" class="toc-panel">
          <p class="toc-panel-title">目录</p>
          <ul class="toc-list">
            <li
              v-for="h in headings"
              :key="h.id"
              :class="[`toc-level-${h.level}`, { active: activeId === h.id }]"
              @click="scrollTo(h.id); mobileOpen = false"
            >
              {{ h.text }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { MarkdownHeading } from '~/composables/useMarkdown'

const props = defineProps<{ headings: MarkdownHeading[] }>()

/** 固定 header 的滚动偏移 */
const SCROLL_OFFSET = 90

const activeId = ref('')
const mobileOpen = ref(false)

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
  window.scrollTo({ top, behavior: 'smooth' })
  activeId.value = id
}

const onScroll = () => {
  if (!props.headings.length) return
  let current = props.headings[0].id
  for (const h of props.headings) {
    const el = document.getElementById(h.id)
    if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET + 30) {
      current = h.id
    } else {
      break
    }
  }
  activeId.value = current
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* ---- 共用列表样式 ---- */
.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-left: 2px solid transparent;
  transition: all 0.25s ease;
}

.dark .toc-list li {
  color: #aaa;
}

.toc-list li:hover {
  background: #f5f3f0;
  color: #9c8878;
}

.dark .toc-list li:hover {
  background: rgba(255, 255, 255, 0.06);
}

.toc-list li.active {
  background: #f5f3f0;
  color: #9c8878;
  font-weight: 600;
  border-left-color: #9c8878;
}

.dark .toc-list li.active {
  background: rgba(255, 255, 255, 0.08);
}

.toc-level-2 { padding-left: 24px; }
.toc-level-3 { padding-left: 38px; }
.toc-level-4 { padding-left: 52px; }

/* ---- 桌面端 ---- */
.toc-desktop {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  scrollbar-width: thin;
}

.toc-title {
  font-size: 16px;
  font-weight: 600;
  color: #9c8878;
  margin: 0 0 16px 0;
}

/* ---- 移动端 ---- */
.toc-mobile {
  display: none;
}

@media (max-width: 1024px) {
  .toc-desktop {
    display: none;
  }

  .toc-mobile {
    display: block;
    position: fixed;
    right: 20px;
    bottom: 88px;
    z-index: 900;
  }

  .toc-fab {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: #9c8878;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  .toc-panel {
    position: absolute;
    right: 0;
    bottom: 54px;
    width: min(280px, calc(100vw - 48px));
    max-height: 50vh;
    overflow-y: auto;
    background: #fff;
    border-radius: 14px;
    padding: 14px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  }

  .dark .toc-panel {
    background: #2a2a2e;
  }

  .toc-panel-title {
    margin: 0 0 10px;
    font-size: 14px;
    font-weight: 600;
    color: #9c8878;
  }
}

.toc-pop-enter-active,
.toc-pop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toc-pop-enter-from,
.toc-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}
</style>

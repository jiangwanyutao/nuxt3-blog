<template>
  <teleport to="body">
    <transition name="search-fade">
      <div v-if="searchStore.showModal" class="search-overlay" @click.self="close">
        <div class="search-panel" role="dialog" aria-label="搜索文章">
          <div class="search-input-wrap">
            <Icon name="material-symbols:search" size="20" class="search-icon" />
            <input
              ref="inputRef"
              v-model="keyword"
              type="text"
              class="search-input"
              placeholder="搜索文章…（Esc 关闭）"
              @input="onInput"
              @keydown.esc="close"
            />
            <span v-if="searching" class="search-spinner"></span>
          </div>

          <div class="search-results">
            <p v-if="!keyword.trim()" class="search-hint">输入关键词开始搜索，支持标题与内容匹配</p>
            <p v-else-if="!searching && results.length === 0" class="search-hint">
              没有找到与「{{ keyword }}」相关的文章
            </p>
            <ul v-else class="search-list">
              <li v-for="item in results" :key="item.id" @click="goArticle(item.id)">
                <p class="result-title">{{ item.title }}</p>
                <p class="result-summary">{{ item.summary || '暂无摘要' }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useSearchStore } from '~/stores/searchStore'
import { searchArticles } from '~/api/article'

/** 输入防抖间隔 */
const SEARCH_DEBOUNCE_MS = 300

const searchStore = useSearchStore()
const keyword = ref('')
const results = ref<Array<{ id: number; title: string; summary?: string }>>([])
const searching = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const doSearch = async () => {
  const kw = keyword.value.trim()
  if (!kw) {
    results.value = []
    return
  }
  searching.value = true
  try {
    const res: any = await searchArticles(kw)
    results.value = res?.code === 200 ? res.data?.items || [] : []
  } catch {
    results.value = []
  } finally {
    searching.value = false
  }
}

const onInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(doSearch, SEARCH_DEBOUNCE_MS)
}

const close = () => searchStore.setModal(false)

const goArticle = (id: number) => {
  close()
  navigateTo(`/article/${id}`)
}

// 打开时自动聚焦并清空上次结果
watch(
  () => searchStore.showModal,
  async (show) => {
    if (show) {
      const preset = searchStore.consumePreset()
      keyword.value = preset
      results.value = []
      await nextTick()
      inputRef.value?.focus()
      if (preset) doSearch()
    }
  }
)

// 全局快捷键 Ctrl/Cmd + K
const onKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchStore.setModal(!searchStore.showModal)
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  padding-top: 12vh;
}

.search-panel {
  width: min(560px, calc(100vw - 32px));
  height: fit-content;
  max-height: 60vh;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.dark .search-panel {
  background: #26262a;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.dark .search-input-wrap {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.search-icon {
  color: #9c8878;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: inherit;
}

.search-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(156, 136, 120, 0.3);
  border-top-color: #9c8878;
  border-radius: 50%;
  animation: search-spin 0.8s linear infinite;
}

@keyframes search-spin {
  to { transform: rotate(360deg); }
}

.search-results {
  overflow-y: auto;
  padding: 8px;
}

.search-hint {
  text-align: center;
  color: #999;
  font-size: 13px;
  padding: 28px 16px;
  margin: 0;
}

.search-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-list li {
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-list li:hover {
  background: #f5f3f0;
}

.dark .search-list li:hover {
  background: rgba(255, 255, 255, 0.06);
}

.result-title {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: inherit;
}

.result-summary {
  margin: 0;
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.2s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}
</style>

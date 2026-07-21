export const useSearchStore = defineStore('search', () => {
  const showModal = ref(false)
  /** 打开弹窗时预置的搜索词（如从标签墙点入） */
  const presetKeyword = ref('')

  function setModal(status: boolean) {
    showModal.value = status
  }

  /** 携带关键词打开搜索弹窗 */
  function openWith(keyword: string) {
    presetKeyword.value = keyword
    showModal.value = true
  }

  function consumePreset() {
    const kw = presetKeyword.value
    presetKeyword.value = ''
    return kw
  }

  return { showModal, presetKeyword, setModal, openWith, consumePreset }
})

// console.log(import.meta.hot)
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))

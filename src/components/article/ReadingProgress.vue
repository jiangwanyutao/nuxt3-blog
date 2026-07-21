<template>
  <div class="reading-progress" aria-hidden="true">
    <div class="reading-progress-bar" :style="{ width: `${progress}%` }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

const update = () => {
  const doc = document.documentElement
  const total = doc.scrollHeight - doc.clientHeight
  progress.value = total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 1000;
  background: transparent;
  pointer-events: none;
}

.reading-progress-bar {
  height: 100%;
  background: linear-gradient(to right, #e89b8f, #9c8878);
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
}
</style>

<script setup lang="ts">
interface Props {
  show: boolean
  image: {
    url: string
    title: string
    description?: string
  } | null
}
defineProps<Props>()
const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

// Close on ESC
onMounted(() => {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose()
  }
  window.addEventListener('keydown', onKeyDown)
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="show && image" 
        class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4 sm:p-8"
        @click="handleClose"
      >
        <!-- Close button -->
        <button 
          class="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[1001]"
          @click.stop="handleClose"
        >
          <Icon name="ph:x-bold" size="32" />
        </button>

        <!-- Content -->
        <div class="relative max-w-7xl w-full h-full flex flex-col items-center justify-center" @click.stop>
          <div class="relative max-h-[85vh] w-full flex items-center justify-center overflow-hidden rounded-lg">
            <img 
              :src="image.url" 
              :alt="image.title"
              class="max-w-full max-h-full object-contain shadow-2xl"
            />
          </div>
          
          <div class="mt-6 text-center text-white max-w-2xl">
            <h2 class="text-2xl font-bold mb-2">{{ image.title }}</h2>
            <p v-if="image.description" class="text-white/70">{{ image.description }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

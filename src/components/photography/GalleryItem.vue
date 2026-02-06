<script setup lang="ts">
interface Props {
  id: number
  url: string
  title: string
  description?: string
  date?: string
}
defineProps<Props>()
defineEmits(['click'])
</script>

<template>
  <div 
    class="relative group cursor-pointer overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-500"
    @click="$emit('click', id)"
  >
    <!-- Image -->
    <div class="aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
      <BaseImage 
        :src="url" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    </div>

    <!-- Overlay info -->
    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
      <div class="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 class="text-white text-xl font-bold mb-1">{{ title }}</h3>
        <p v-if="description" class="text-white/80 text-sm line-clamp-2">{{ description }}</p>
        <span v-if="date" class="text-white/60 text-xs mt-2 block">{{ date }}</span>
      </div>
    </div>
  </div>
</template>

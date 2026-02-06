<script setup lang="ts">
import { ref } from 'vue'

// Page meta
definePageMeta({
  layout: 'default'
})

useHead({
  title: '摄影展示 | 思境 Blog',
  meta: [
    { name: 'description', content: '光影留痕，记录生活中的美好瞬间' }
  ]
})

// Mock data
const photos = ref([
  {
    id: 1,
    url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Stunning%20landscape%20photography%20of%20snow-capped%20mountains%20during%20golden%20hour%20with%20a%20serene%20lake%20in%20the%20foreground%2C%20hyper-realistic%2C%208k&image_size=portrait_4_3',
    title: '金色的雪山',
    description: '在日落时分，阳光洒在雪山顶上，反射出金色的光芒。',
    date: '2024-01-15'
  },
  {
    id: 2,
    url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Street%20photography%20of%20a%20bustling%20Tokyo%20street%20at%20night%20with%20neon%20lights%20and%20rainy%20pavement%2C%20cinematic%20lighting%2C%20cyberpunk%20aesthetic&image_size=portrait_4_3',
    title: '东京夜色',
    description: '霓虹灯火映照在雨后的街道上，充满了赛博朋克的气息。',
    date: '2024-02-10'
  },
  {
    id: 3,
    url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Minimalist%20architectural%20photography%20of%20a%20modern%20white%20building%20against%20a%20deep%20blue%20sky%2C%20sharp%20lines%2C%20geometric%20patterns&image_size=portrait_4_3',
    title: '极简建筑',
    description: '纯净的白色建筑与深邃的蓝天交织，勾勒出简约的几何美。',
    date: '2024-03-05'
  },
  {
    id: 4,
    url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Close-up%20macro%20photography%20of%20a%20dewdrop%20on%20a%20vibrant%20green%20leaf%2C%20morning%20sunlight%20refraction%2C%20soft%20bokeh%20background&image_size=portrait_4_3',
    title: '晨露',
    description: '清晨的露珠在叶片上静静滑落，折射出微小的世界。',
    date: '2024-03-20'
  },
  {
    id: 5,
    url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Atmospheric%20forest%20photography%20with%20sunbeams%20breaking%20through%20tall%20pine%20trees%20and%20morning%20mist%2C%20ethereal%2C%20mystical&image_size=portrait_4_3',
    title: '林间晨曦',
    description: '阳光穿过茂密的松林，在薄雾中留下一道道光束。',
    date: '2024-04-12'
  },
  {
    id: 6,
    url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Portrait%20photography%20of%20an%20elderly%20craftsman%20working%20on%20pottery%20in%20a%20rustic%20workshop%2C%20dramatic%20side%20lighting%2C%20texture-rich&image_size=portrait_4_3',
    title: '匠心',
    description: '老手艺人专注地打磨着陶器，岁月的痕迹刻在他的指尖。',
    date: '2024-05-01'
  }
])

// Lightbox state
const showLightbox = ref(false)
const selectedImage = ref<any>(null)

const openLightbox = (id: number) => {
  const photo = photos.value.find(p => p.id === id)
  if (photo) {
    selectedImage.value = photo
    showLightbox.value = true
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-zinc-950 pt-24 pb-12 px-4 sm:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <header class="mb-16 text-center fade-in-up">
        <h1 class="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
          摄影作品
        </h1>
        <div class="h-1 w-20 bg-zinc-900 dark:bg-zinc-100 mx-auto mb-6"></div>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg">
          “摄影不仅仅是记录，更是一种观看世界的方式。”
        </p>
      </header>

      <!-- Gallery Grid -->
      <div class="gallery-grid">
        <PhotographyGalleryItem
          v-for="(photo, index) in photos"
          :key="photo.id"
          v-bind="photo"
          @click="openLightbox"
          class="fade-in-up"
          :style="{ animationDelay: `${index * 150}ms` }"
        />
      </div>

      <!-- Empty State -->
      <div v-if="photos.length === 0" class="py-24 text-center">
        <Icon name="ph:camera-slash" size="64" class="text-zinc-300 mx-auto mb-4" />
        <p class="text-zinc-500">暂无摄影作品</p>
      </div>
    </div>

    <!-- Lightbox -->
    <PhotographyLightbox
      :show="showLightbox"
      :image="selectedImage"
      @close="showLightbox = false"
    />
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isAuthPage = computed(() => route.path === '/login');
</script>

<template>
  <main>
    <CommonHeader  v-if="!isAuthPage"  />
    <slot />
    <CommonFooter v-if="!isAuthPage" />
    <!-- 全局：搜索弹窗 + 悬浮工具球（移植自 ThriveX） -->
    <ClientOnly>
      <SearchModal />
      <CommonFloatingTools v-if="!isAuthPage" />
    </ClientOnly>
  </main>
</template>

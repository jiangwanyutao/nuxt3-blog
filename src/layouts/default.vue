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
  </main>
</template>

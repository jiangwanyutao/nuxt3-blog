<script setup lang="ts">
const loadings = ref(false);
onMounted(() => {
  loadings.value = true;
  setTimeout(() => {
    loadings.value = false;
  }, 3000);
});
</script>

<template>
  <Loading v-if="loadings"></Loading>
  <main v-else>
    <CommonHeader />
    <slot />
    <CommonFooter />
  </main>
</template>

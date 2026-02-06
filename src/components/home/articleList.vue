<template>
  <div>
    <n-grid :y-gap="8" :cols="1">
      <n-gi>
        <div class="light-green" v-for="item in 7" />
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.light-green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}
.green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

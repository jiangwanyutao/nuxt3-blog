<template>
  <!--
    「相册 / 足迹」切换。两个页面共用，靠当前路由判断高亮，
    不接受 props —— 否则每个页面都要各传一次，容易传错。
  -->
  <nav class="sw" aria-label="回忆录导航">
    <span class="sw-icon" aria-hidden="true">📷</span>
    <span class="sw-divider" />
    <NuxtLink to="/album" class="sw-item" :class="{ 'is-active': isAlbum }">相册</NuxtLink>
    <NuxtLink to="/footprint" class="sw-item" :class="{ 'is-active': !isAlbum }">足迹</NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isAlbum = computed(() => route.path.startsWith('/album'))
</script>

<style scoped>
.sw {
  position: fixed;
  /* 站点页头 64px，往下让开一点，不跟导航挤在一起 */
  top: 84px;
  left: 50%;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  transform: translateX(-50%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(20, 26, 34, 0.72);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.sw-icon {
  padding: 0 8px;
  font-size: 15px;
  line-height: 1;
}

.sw-divider {
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.16);
}

.sw-item {
  padding: 6px 18px;
  border-radius: 999px;
  color: rgba(232, 228, 220, 0.68);
  font-size: 14px;
  text-decoration: none;
  transition: background 0.25s, color 0.25s;
}

.sw-item:hover {
  color: #fff;
}

.sw-item.is-active {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

@media (max-width: 640px) {
  .sw {
    top: 76px;
  }

  .sw-item {
    padding: 5px 14px;
    font-size: 13px;
  }
}
</style>

<template>
  <!--
    「相册 / 足迹」切换。两个页面共用，靠当前路由判断高亮，
    不接受 props —— 否则每个页面都要各传一次，容易传错。
  -->
  <nav class="sw" aria-label="回忆录导航">
    <!--
      用内联 SVG 而不是 📷 emoji：emoji 自带基线与字形留白，
      在胶囊里总是偏下且各系统渲染不一，对不齐。
    -->
    <span class="sw-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2a1 1 0 0 0 .83-.45l.94-1.4A1 1 0 0 1 9.3 4.7h5.4a1 1 0 0 1 .83.45l.94 1.4a1 1 0 0 0 .83.45h2.2A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
        <circle cx="12" cy="12.8" r="3.2" />
      </svg>
    </span>
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

/*
  做成正方形并用 flex 居中：图标的视觉重心由 SVG 的 viewBox 决定，
  不再受字体基线影响。左右留白与右端文字项的内边距对齐，两侧才均衡。
*/
.sw-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  /* 右端文字距边缘 26px（容器 8 + 文字项 18），这里补 margin 让左端视觉留白与之相当 */
  margin-left: 6px;
  width: 34px;
  height: 34px;
  color: rgba(232, 228, 220, 0.66);
}

.sw-icon svg {
  width: 17px;
  height: 17px;
  display: block;
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

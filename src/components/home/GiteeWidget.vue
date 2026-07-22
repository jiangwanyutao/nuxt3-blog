<template>
  <section class="gw-section">
    <div class="gw-inner">
      <h2 class="gw-title">开源仓库</h2>
      <p class="gw-sub">本站主题已开源，欢迎 Star</p>

      <!-- 挂件脚本会把内容渲染进这个固定 id 的容器，id 不能改 -->
      <div id="osc-gitee-widget-tag" class="gw-box" />

      <p v-if="failed" class="gw-fallback">
        挂件加载失败，可直接前往
        <a :href="REPO_URL" target="_blank" rel="noopener noreferrer">Gitee 仓库</a>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const REPO_URL = 'https://gitee.com/yutaocangku/nuxt3-blog'
const WIDGET_SRC = `${REPO_URL}/widget_preview`
/** 超过这个时间还没渲染出内容就认为挂了，给个兜底链接 */
const TIMEOUT = 6000

const failed = ref(false)
let script: HTMLScriptElement | null = null
let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  // 必须在挂载后注入：模板里写 <script> 不会被执行，
  // 而且脚本运行时需要 #osc-gitee-widget-tag 已经在 DOM 里
  script = document.createElement('script')
  script.src = WIDGET_SRC
  script.async = true
  script.defer = true
  script.onerror = () => {
    failed.value = true
  }
  document.body.appendChild(script)

  // Gitee 挂不上时脚本可能既不报错也不渲染，只能靠超时兜底
  timer = setTimeout(() => {
    const box = document.getElementById('osc-gitee-widget-tag')
    if (!box || !box.children.length) failed.value = true
  }, TIMEOUT)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  script?.remove()
  script = null
})
</script>

<style scoped>
/*
 * 这里替换的是首页右侧那一栏，宽度有限。
 * 挂件默认按较宽布局渲染，直接放进来会溢出、被右侧卡片压住，
 * 所以整体缩放到容器宽度内。
 */
.gw-section {
  padding: 8px 0;
  width: 100%;
  overflow: hidden;
}

.gw-inner {
  width: 100%;
  text-align: center;
}

.gw-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text, #3b352d);
}

.gw-sub {
  margin: 8px 0 22px;
  font-size: 14px;
  color: #9a9188;
}

.gw-box {
  min-height: 120px;
  width: 100%;
}

/* 挂件内部是定宽表格，强制它跟随容器宽度，否则会撑出去 */
.gw-box :deep(table),
.gw-box :deep(div) {
  max-width: 100% !important;
  box-sizing: border-box;
}

.gw-fallback {
  margin-top: 12px;
  font-size: 13px;
  color: #9a9188;
}

.gw-fallback a {
  color: #4183c4;
}
</style>

<!--
  挂件内容由第三方脚本动态插入，拿不到 scoped 编译出的 data 属性，
  样式必须写在非 scoped 块里，否则一律不生效。
  以下配色沿用官方挂件提供的自定义变量名。
-->
<style>
.osc_pro_color {
  color: #4183c4 !important;
}

.osc_panel_color {
  background-color: #ffffff !important;
}

.osc_background_color {
  background-color: #ffffff !important;
}

.osc_border_color {
  border-color: #e3e9ed !important;
}

.osc_desc_color {
  color: #666666 !important;
}

.osc_link_color * {
  color: #9b9b9b !important;
}
</style>

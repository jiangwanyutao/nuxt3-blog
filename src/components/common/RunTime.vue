<template>
  <div v-if="startTime" class="run-time">
    <Icon name="material-symbols:rocket-launch-outline" size="14" class="run-icon" />
    <span class="run-label">本站已稳定运行</span>
    <span class="run-unit"><b>{{ elapsed.days }}</b> 天</span>
    <span class="run-unit"><b>{{ pad(elapsed.hours) }}</b> 时</span>
    <span class="run-unit"><b>{{ pad(elapsed.minutes) }}</b> 分</span>
    <span class="run-unit run-seconds"><b>{{ pad(elapsed.seconds) }}</b> 秒</span>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { apiGetConfig } from '~/api/auth'

const MS_PER_SECOND = 1000
const MS_PER_MINUTE = 60 * MS_PER_SECOND
const MS_PER_HOUR = 60 * MS_PER_MINUTE
const MS_PER_DAY = 24 * MS_PER_HOUR

const startTime = ref<string>('')
const elapsed = reactive({ days: 0, hours: 0, minutes: 0, seconds: 0 })

const pad = (n: number) => String(n).padStart(2, '0')

const tick = () => {
  if (!startTime.value) return
  const diff = Date.now() - new Date(startTime.value).getTime()
  if (diff < 0 || Number.isNaN(diff)) return
  elapsed.days = Math.floor(diff / MS_PER_DAY)
  elapsed.hours = Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR)
  elapsed.minutes = Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE)
  elapsed.seconds = Math.floor((diff % MS_PER_MINUTE) / MS_PER_SECOND)
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  try {
    const res: any = await apiGetConfig()
    if (res?.code === 200 && res.data?.startTime) {
      startTime.value = res.data.startTime
      tick()
      timer = setInterval(tick, MS_PER_SECOND)
    }
  } catch {
    // 配置拉取失败时不显示该模块，不影响页脚其余内容
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.run-time {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 12px;
  color: #a89f92;
}

.run-icon {
  color: #e88b8f;
}

.run-label {
  margin-right: 2px;
}

.run-unit b {
  display: inline-block;
  min-width: 1.2em;
  text-align: center;
  font-weight: 600;
  color: #9c8878;
  font-variant-numeric: tabular-nums;
}

.dark .run-unit b {
  color: #d3c4b5;
}

/* 秒数每秒变化，单独给个轻微的呼吸感 */
.run-seconds b {
  color: #e88b8f;
}
</style>

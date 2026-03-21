<template>
  <div class="progress-container">
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: percent + '%' }"></div>
    </div>
    <span v-if="showLabel" class="progress-label">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true },
  showLabel: { type: Boolean, default: true }
})

const percent = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.current / props.total) * 100)
})

const label = computed(() => `${props.current}/${props.total}`)
</script>

<style scoped>
.progress-container { display: flex; align-items: center; gap: 8px; }
.progress-track { flex: 1; height: 6px; background: #f0f4f8; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--progress); border-radius: 3px; transition: width 0.3s ease; }
.progress-label { font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; }
</style>

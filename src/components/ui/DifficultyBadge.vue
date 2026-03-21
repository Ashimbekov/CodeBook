<template>
  <span class="badge" :class="difficulty">{{ text }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  difficulty: { type: String, required: true }
})

const text = computed(() => {
  const map = { easy: 'Лёгкая', medium: 'Средняя', hard: 'Сложная' }
  return map[props.difficulty] || props.difficulty
})
</script>

<style scoped>
.badge { font-size: 0.7rem; font-weight: 600; padding: 3px 10px; border-radius: 12px; }
.easy { background: #e8f5e9; color: var(--success); }
.medium { background: #fff3e0; color: var(--practice); }
.hard { background: #fde8e8; color: var(--danger); }
</style>

<template>
  <div class="note-block" :class="type">
    <div class="note-header">
      <span class="note-icon">{{ icon }}</span>
      <span class="note-label">{{ label }}</span>
    </div>
    <div class="note-content">{{ text }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, required: true },
  text: { type: String, required: true }
})

const icon = computed(() => ({ note: '📝', warning: '⚠️', tip: '💡' }[props.type] || '📝'))
const label = computed(() => ({ note: 'Запомни', warning: 'Частая ошибка', tip: 'Простая аналогия' }[props.type] || 'Заметка'))
</script>

<style scoped>
.note-block { border-left: 4px solid; padding: 14px 18px; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin: 12px 0; }
.note-block.note { background: #fff8e1; border-color: var(--warning); }
.note-block.warning { background: #fde8e8; border-color: var(--danger); }
.note-block.tip { background: #e8f4fd; border-color: var(--info); }
.note-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.note-icon { font-size: 0.8rem; }
.note-label { font-size: 0.75rem; font-weight: 600; }
.note-block.note .note-label { color: #f57f17; }
.note-block.warning .note-label { color: var(--danger); }
.note-block.tip .note-label { color: var(--info); }
.note-content { font-size: 0.85rem; color: var(--text-primary); line-height: 1.6; }
</style>

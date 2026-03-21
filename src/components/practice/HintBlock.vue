<template>
  <div class="hint-block" :class="{ open: isOpen }">
    <button class="hint-toggle" @click="isOpen = !isOpen">
      <span>💡 Подсказка</span>
      <span class="arrow">{{ isOpen ? '▲' : '▼' }}</span>
    </button>
    <div v-if="isOpen" class="hint-content">{{ hint }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ hint: { type: String, required: true } })
const isOpen = ref(false)
</script>

<style scoped>
.hint-block { background: #e8f4fd; border: 1px solid #bbdefb; border-radius: var(--radius-lg); overflow: hidden; margin: 16px 0; }
.hint-toggle { width: 100%; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: var(--info); }
.arrow { font-size: 0.75rem; }
.hint-content { padding: 0 20px 14px; font-size: 0.85rem; color: var(--text-primary); line-height: 1.6; border-top: 1px solid #bbdefb; padding-top: 12px; }
</style>

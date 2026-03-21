<template>
  <div class="solution-block" :class="{ open: isOpen }">
    <button class="solution-toggle" @click="isOpen = !isOpen">
      <span>✅ Показать решение</span>
      <span class="arrow">{{ isOpen ? '▲' : '▼' }}</span>
    </button>
    <div v-if="isOpen" class="solution-content">
      <CodeBlock :code="solution" language="java" />
      <div v-if="explanation" class="explanation"><strong>Разбор:</strong> {{ explanation }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodeBlock from '../course/CodeBlock.vue'

defineProps({
  solution: { type: String, required: true },
  explanation: { type: String, default: '' }
})
const isOpen = ref(false)
</script>

<style scoped>
.solution-block { border: 2px solid var(--progress); border-radius: var(--radius-lg); overflow: hidden; margin: 16px 0; }
.solution-toggle { width: 100%; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; background: #e8f5e9; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: var(--progress); }
.solution-content { padding: 0 0 16px; }
.explanation { padding: 14px 20px 0; font-size: 0.85rem; color: var(--text-primary); line-height: 1.7; background: #f8fdf8; }
</style>

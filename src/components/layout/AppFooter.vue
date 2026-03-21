<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <span class="footer-text">📚 CodeBook — изучай программирование</span>
      <button class="reset-btn" @click="handleReset">Сбросить прогресс</button>
    </div>
  </footer>
</template>

<script setup>
import { useProgressStore } from '../../stores/progress.js'

const progress = useProgressStore()

function handleReset() {
  if (confirm('Вы уверены? Весь прогресс будет удалён.')) {
    progress.resetAll()
  }
}
</script>

<style scoped>
.app-footer { background: var(--bg-card); border-top: 1px solid var(--border); margin-top: auto; padding: 16px 24px; }
.footer-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.footer-text { font-size: 0.8rem; color: var(--text-secondary); }
.reset-btn { font-size: 0.75rem; color: var(--danger); background: none; border: 1px solid var(--danger); padding: 4px 12px; border-radius: var(--radius-sm); cursor: pointer; }
.reset-btn:hover { background: #fde8e8; }
</style>

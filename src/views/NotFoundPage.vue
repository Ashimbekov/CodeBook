<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Страница не найдена</p>
    <router-link to="/" class="back-link">← Вернуться на главную</router-link>
  </div>
</template>

<style scoped>
.not-found { text-align: center; padding: 80px 24px; }
.not-found h1 { font-size: 4rem; font-weight: 700; color: var(--text-heading); }
.not-found p { font-size: 1.1rem; color: var(--text-secondary); margin: 12px 0 24px; }
.back-link { color: var(--accent); font-weight: 500; }
</style>

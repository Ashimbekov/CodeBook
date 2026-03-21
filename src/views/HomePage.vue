<template>
  <div class="home-page">
    <div class="hero">
      <h1>Выбери язык программирования</h1>
      <p class="hero-subtitle">От основ до продвинутого уровня. Теория + практика.</p>
    </div>
    <div class="courses-grid">
      <p>Курсы загружаются...</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-page { max-width: 1000px; margin: 0 auto; padding: 24px; }
.hero { text-align: center; padding: 32px 0 20px; }
.hero h1 { font-size: 1.75rem; font-weight: 700; color: var(--text-heading); }
.hero-subtitle { font-size: 0.9rem; color: var(--text-secondary); margin-top: 6px; }
.courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; padding-top: 8px; }
</style>

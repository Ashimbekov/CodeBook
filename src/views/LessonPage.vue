<template>
  <div class="lesson-page">
    <p>Урок {{ $route.params.lessonId }} модуля {{ $route.params.moduleId }}</p>
  </div>
</template>

<script setup>
</script>

<style scoped>
.lesson-page { display: flex; min-height: calc(100vh - 120px); }
</style>

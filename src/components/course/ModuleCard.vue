<template>
  <router-link :to="`/course/${courseId}/module/${module.id}`" class="module-card">
    <div class="module-header">
      <span class="module-icon">{{ module.icon }}</span>
      <div>
        <h3 class="module-title">{{ module.title }}</h3>
        <p class="module-meta">{{ lessonsCount }} уроков</p>
      </div>
    </div>
    <ProgressBar :current="completedCount" :total="lessonsCount" />
  </router-link>
</template>

<script setup>
import ProgressBar from '../ui/ProgressBar.vue'

defineProps({
  module: { type: Object, required: true },
  courseId: { type: String, required: true },
  lessonsCount: { type: Number, default: 0 },
  completedCount: { type: Number, default: 0 }
})
</script>

<style scoped>
.module-card { display: block; background: var(--bg-card); border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--shadow); border: 1px solid var(--border); text-decoration: none; transition: transform 0.15s, box-shadow 0.15s; }
.module-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
.module-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.module-icon { font-size: 1.5rem; }
.module-title { font-size: 0.95rem; font-weight: 600; color: var(--text-heading); }
.module-meta { font-size: 0.7rem; color: var(--text-secondary); }
</style>

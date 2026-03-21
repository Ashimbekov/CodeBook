<template>
  <router-link :to="to" class="course-card" :class="{ disabled: !available }">
    <div class="card-header">
      <div class="card-icon" :style="{ background: 'linear-gradient(135deg, ' + course.color + ', ' + course.color + 'cc)' }">{{ course.icon }}</div>
      <div>
        <h3 class="card-title">{{ course.title }}</h3>
        <p class="card-meta">{{ course.modules.length }} модулей</p>
      </div>
    </div>
    <p class="card-desc">{{ course.description }}</p>
    <template v-if="available">
      <ProgressBar :current="progressPercent" :total="100" :showLabel="false" />
      <span class="progress-text">Прогресс: {{ progressPercent }}%</span>
    </template>
    <div v-else class="coming-soon">🔒 Скоро</div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import ProgressBar from '../ui/ProgressBar.vue'

const props = defineProps({
  course: { type: Object, required: true },
  available: { type: Boolean, default: true },
  progressPercent: { type: Number, default: 0 }
})

const to = computed(() => props.available ? `/course/${props.course.id}` : '')
</script>

<style scoped>
.course-card { display: block; background: var(--bg-card); border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--shadow); border: 1px solid var(--border); text-decoration: none; transition: transform 0.15s, box-shadow 0.15s; }
.course-card:not(.disabled):hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
.course-card.disabled { opacity: 0.5; cursor: default; pointer-events: none; }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.card-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
.card-title { font-size: 1rem; font-weight: 600; color: var(--text-heading); }
.card-meta { font-size: 0.7rem; color: var(--text-secondary); }
.card-desc { font-size: 0.8rem; color: var(--text-primary); line-height: 1.5; margin-bottom: 12px; }
.progress-text { font-size: 0.7rem; color: var(--text-secondary); margin-top: 4px; display: block; }
.coming-soon { background: #f0f4f8; padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.75rem; color: var(--text-secondary); text-align: center; }
</style>

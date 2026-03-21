<template>
  <div class="task-card">
    <div class="task-badges">
      <span class="badge practice">ПРАКТИКА</span>
      <DifficultyBadge :difficulty="lesson.difficulty" />
    </div>
    <h2 class="task-title">{{ lesson.title }}</h2>
    <div class="task-section">
      <p class="task-desc">{{ lesson.description }}</p>
      <div v-if="lesson.expectedOutput" class="expected-output"><pre>{{ lesson.expectedOutput }}</pre></div>
    </div>
    <div class="task-section" v-if="lesson.requirements?.length">
      <h3 class="section-title">📋 Требования:</h3>
      <ul class="requirements"><li v-for="req in lesson.requirements" :key="req">{{ req }}</li></ul>
    </div>
    <HintBlock v-if="lesson.hint" :hint="lesson.hint" />
    <SolutionReveal :solution="lesson.solution" :explanation="lesson.explanation" />
  </div>
</template>

<script setup>
import DifficultyBadge from '../ui/DifficultyBadge.vue'
import HintBlock from './HintBlock.vue'
import SolutionReveal from './SolutionReveal.vue'

defineProps({ lesson: { type: Object, required: true } })
</script>

<style scoped>
.task-card { max-width: 720px; }
.task-badges { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.badge.practice { background: var(--practice); color: #fff; font-size: 0.7rem; font-weight: 600; padding: 3px 10px; border-radius: 12px; }
.task-title { font-size: 1.4rem; font-weight: 700; color: var(--text-heading); margin-bottom: 20px; }
.task-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 16px; }
.task-desc { font-size: 0.9rem; line-height: 1.8; margin-bottom: 12px; }
.expected-output { background: #f8f9fb; border-radius: var(--radius-md); padding: 14px 18px; border: 1px solid var(--border); }
.expected-output pre { font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.7; color: var(--text-primary); margin: 0; white-space: pre-wrap; }
.section-title { font-size: 0.9rem; font-weight: 600; color: var(--text-heading); margin-bottom: 10px; }
.requirements { list-style: none; padding: 0; }
.requirements li { font-size: 0.85rem; line-height: 2; padding-left: 16px; position: relative; }
.requirements li::before { content: '•'; position: absolute; left: 0; color: var(--accent); }
</style>

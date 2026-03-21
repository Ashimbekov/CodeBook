<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <div class="sidebar-header">
      <span class="sidebar-icon">{{ moduleData.icon || '📖' }}</span>
      <span class="sidebar-title">{{ moduleData.title }}</span>
    </div>
    <div class="sidebar-progress">
      <ProgressBar :current="completedCount" :total="moduleData.lessons.length" />
    </div>
    <nav class="sidebar-nav">
      <router-link
        v-for="lesson in moduleData.lessons"
        :key="lesson.id"
        :to="`/course/${courseId}/module/${moduleData.id}/lesson/${lesson.id}`"
        class="nav-item"
        :class="{
          active: lesson.id === Number(currentLessonId),
          completed: isLessonCompleted(lesson.id),
          practice: lesson.type === 'practice'
        }"
      >
        <span class="nav-icon">
          <template v-if="isLessonCompleted(lesson.id)">✅</template>
          <template v-else-if="lesson.type === 'practice'">⚡</template>
          <template v-else-if="lesson.id === Number(currentLessonId)">📖</template>
          <template v-else>○</template>
        </span>
        <span class="nav-text">{{ lesson.id }}. {{ lesson.title }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useProgressStore } from '../../stores/progress.js'
import ProgressBar from '../ui/ProgressBar.vue'

const props = defineProps({
  moduleData: { type: Object, required: true },
  courseId: { type: String, required: true },
  currentLessonId: { type: [String, Number], required: true },
  isOpen: { type: Boolean, default: false }
})

const progress = useProgressStore()

function isLessonCompleted(lessonId) {
  return progress.isCompleted(props.courseId, props.moduleData.id, lessonId)
}

const completedCount = computed(() =>
  progress.moduleProgress(props.courseId, props.moduleData.id, props.moduleData.lessons.length)
)
</script>

<style scoped>
.sidebar { width: 260px; background: var(--bg-card); border-right: 1px solid var(--border); padding: 16px 0; flex-shrink: 0; overflow-y: auto; height: calc(100vh - 57px); position: sticky; top: 57px; }
.sidebar-header { padding: 0 16px 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-heading); display: flex; align-items: center; gap: 6px; }
.sidebar-progress { padding: 0 16px 12px; }
.nav-item { display: flex; align-items: flex-start; gap: 6px; padding: 8px 16px; font-size: 0.78rem; color: var(--text-primary); text-decoration: none; transition: background 0.1s; }
.nav-item:hover { background: #f0f4f8; }
.nav-item.active { background: var(--accent-light); color: var(--accent); font-weight: 600; border-left: 3px solid var(--accent); }
.nav-item.completed { color: var(--progress); }
.nav-item.practice:not(.completed):not(.active) { color: var(--practice); }
.nav-icon { flex-shrink: 0; width: 18px; text-align: center; }
.nav-text { line-height: 1.4; }
</style>

<template>
  <div class="course-page" v-if="course">
    <div class="course-header">
      <span class="course-icon">{{ course.icon }}</span>
      <div>
        <h1>{{ course.title }}</h1>
        <p class="course-desc">{{ course.description }}</p>
      </div>
    </div>
    <div class="modules-grid">
      <ModuleCard
        v-for="mod in course.modules"
        :key="mod.id"
        :module="mod"
        :courseId="course.id"
        :lessonsCount="moduleLessonCounts[mod.id] || 0"
        :completedCount="moduleCompletedCounts[mod.id] || 0"
      />
    </div>
  </div>
  <div v-else-if="courseStore.loading" class="loading">Загрузка...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '../stores/course.js'
import { useProgressStore } from '../stores/progress.js'
import ModuleCard from '../components/course/ModuleCard.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const progressStore = useProgressStore()

const course = ref(null)
const moduleLessonCounts = ref({})
const moduleCompletedCounts = ref({})

onMounted(async () => {
  const lang = route.params.lang
  const loaded = await courseStore.loadCourse(lang)
  if (!loaded) {
    router.replace({ name: 'not-found' })
    return
  }
  course.value = loaded

  for (const mod of loaded.modules) {
    try {
      const moduleData = await courseStore.loadModule(lang, mod.id)
      if (moduleData) {
        moduleLessonCounts.value[mod.id] = moduleData.lessons.length
        moduleCompletedCounts.value[mod.id] = progressStore.moduleProgress(lang, mod.id, moduleData.lessons.length)
      }
    } catch {}
  }
})
</script>

<style scoped>
.course-page { max-width: 1000px; margin: 0 auto; padding: 24px; }
.course-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.course-icon { font-size: 2.5rem; }
.course-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-heading); }
.course-desc { font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px; }
.modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.loading { text-align: center; padding: 60px; color: var(--text-secondary); }
</style>

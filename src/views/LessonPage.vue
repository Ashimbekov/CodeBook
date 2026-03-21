<template>
  <div class="lesson-layout" v-if="moduleData && lesson">
    <button class="burger-btn" @click="sidebarOpen = !sidebarOpen" aria-label="Меню">☰</button>
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <AppSidebar
      :moduleData="moduleData"
      :courseId="lang"
      :currentLessonId="lessonId"
      :isOpen="sidebarOpen"
    />

    <div class="lesson-main">
      <LessonContent
        v-if="lesson.type === 'theory'"
        :lesson="lesson"
        :lessonIndex="Number(lessonId)"
        :totalLessons="moduleData.lessons.length"
      />
      <TaskCard
        v-else-if="lesson.type === 'practice'"
        :lesson="lesson"
      />
      <LessonNav
        :prevTo="prevRoute"
        :nextTo="nextRoute"
        :prevLabel="prevLesson?.title || 'Предыдущий урок'"
        :isCompleted="isCurrentCompleted"
        :isPractice="lesson.type === 'practice'"
        @complete="handleComplete"
      />
    </div>
  </div>
  <div v-else-if="loading" class="loading">Загрузка урока...</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '../stores/course.js'
import { useProgressStore } from '../stores/progress.js'
import AppSidebar from '../components/layout/AppSidebar.vue'
import LessonContent from '../components/course/LessonContent.vue'
import TaskCard from '../components/practice/TaskCard.vue'
import LessonNav from '../components/ui/LessonNav.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const progressStore = useProgressStore()

const moduleData = ref(null)
const loading = ref(true)
const sidebarOpen = ref(false)

const lang = computed(() => route.params.lang)
const moduleId = computed(() => route.params.moduleId)
const lessonId = computed(() => route.params.lessonId)

const lesson = computed(() => {
  if (!moduleData.value) return null
  return moduleData.value.lessons.find(l => l.id === Number(lessonId.value)) || null
})

const prevLesson = computed(() => {
  if (!moduleData.value) return null
  const idx = moduleData.value.lessons.findIndex(l => l.id === Number(lessonId.value))
  return idx > 0 ? moduleData.value.lessons[idx - 1] : null
})

const nextLesson = computed(() => {
  if (!moduleData.value) return null
  const idx = moduleData.value.lessons.findIndex(l => l.id === Number(lessonId.value))
  return idx < moduleData.value.lessons.length - 1 ? moduleData.value.lessons[idx + 1] : null
})

const prevRoute = computed(() => {
  if (!prevLesson.value) return null
  return `/course/${lang.value}/module/${moduleId.value}/lesson/${prevLesson.value.id}`
})

const nextRoute = computed(() => {
  if (!nextLesson.value) return null
  return `/course/${lang.value}/module/${moduleId.value}/lesson/${nextLesson.value.id}`
})

const isCurrentCompleted = computed(() =>
  progressStore.isCompleted(lang.value, moduleData.value?.id, Number(lessonId.value))
)

function handleComplete() {
  progressStore.markComplete(lang.value, moduleData.value.id, Number(lessonId.value))
  if (nextRoute.value) {
    router.push(nextRoute.value)
  }
}

async function loadData() {
  loading.value = true
  const mod = await courseStore.loadModule(lang.value, moduleId.value)
  if (!mod) {
    router.replace({ name: 'not-found' })
    return
  }
  moduleData.value = mod
  if (!lesson.value) {
    router.replace({ name: 'not-found' })
    return
  }
  loading.value = false
  sidebarOpen.value = false
}

onMounted(loadData)
watch(() => route.fullPath, loadData)
</script>

<style scoped>
.lesson-layout { display: flex; min-height: calc(100vh - 57px); }
.lesson-main { flex: 1; padding: 28px 36px; overflow-y: auto; }
.loading { text-align: center; padding: 60px; color: var(--text-secondary); }
.burger-btn { display: none; position: fixed; bottom: 20px; left: 20px; z-index: 101; background: var(--accent); color: #fff; border: none; width: 44px; height: 44px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); align-items: center; justify-content: center; }
@media (max-width: 768px) { .lesson-main { padding: 20px 16px; } }
</style>

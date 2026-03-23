<template>
  <div class="home-page">
    <div class="hero">
      <h1>Выбери курс</h1>
      <p class="hero-subtitle">Языки программирования, алгоритмы, фреймворки и подготовка к собеседованиям. Теория + практика.</p>
    </div>

    <StatsPanel :courses="courseStore.courses" />

    <div class="courses-grid">
      <CourseCard
        v-for="course in courseStore.courses"
        :key="course.id"
        :course="course"
        :available="true"
        :progressPercent="getProgress(course)"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCourseStore } from '../stores/course.js'
import { useProgressStore } from '../stores/progress.js'
import CourseCard from '../components/course/CourseCard.vue'
import StatsPanel from '../components/ui/StatsPanel.vue'

const courseStore = useCourseStore()
const progressStore = useProgressStore()

function getProgress(course) {
  return progressStore.courseProgress(course.id, course.modules)
}

onMounted(() => {
  courseStore.loadCourseList()
})
</script>

<style scoped>
.home-page { max-width: 1000px; margin: 0 auto; padding: 24px; }
.hero { text-align: center; padding: 32px 0 20px; }
.hero h1 { font-size: 1.75rem; font-weight: 700; color: var(--text-heading); }
.hero-subtitle { font-size: 0.9rem; color: var(--text-secondary); margin-top: 6px; }
.courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; padding-top: 8px; }
</style>

<template>
  <div class="home-page">
    <div class="hero">
      <h1>Выбери курс</h1>
      <p class="hero-subtitle">Языки программирования, алгоритмы и структуры данных. Теория + практика.</p>
    </div>
    <div class="courses-grid">
      <CourseCard
        v-for="course in courseStore.courses"
        :key="course.id"
        :course="course"
        :available="true"
        :progressPercent="getProgress(course)"
      />
      <CourseCard
        v-for="placeholder in placeholders"
        :key="placeholder.id"
        :course="placeholder"
        :available="false"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCourseStore } from '../stores/course.js'
import { useProgressStore } from '../stores/progress.js'
import CourseCard from '../components/course/CourseCard.vue'

const courseStore = useCourseStore()
const progressStore = useProgressStore()

const placeholders = ref([
  { id: 'python', title: 'Python', icon: '🐍', description: 'Курс в разработке...', color: '#3776ab', modules: [] },
  { id: 'javascript', title: 'JavaScript', icon: '🟨', description: 'Курс в разработке...', color: '#f7df1e', modules: [] }
])

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

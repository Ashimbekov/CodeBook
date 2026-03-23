<template>
  <div class="stats-panel" v-if="totalCompleted > 0">
    <h2 class="stats-title">📊 Ваша статистика</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ totalCompleted }}</div>
        <div class="stat-label">Уроков пройдено</div>
        <div class="stat-bar">
          <div class="stat-fill" :style="{ width: lessonsPercent + '%' }"></div>
        </div>
        <div class="stat-sub">из {{ totalLessons }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ completedCourses }}</div>
        <div class="stat-label">Курсов завершено</div>
        <div class="stat-bar">
          <div class="stat-fill courses" :style="{ width: coursesPercent + '%' }"></div>
        </div>
        <div class="stat-sub">из {{ totalCourses }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ streak }}</div>
        <div class="stat-label">{{ streakLabel }}</div>
        <div class="stat-icon">{{ streakEmoji }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ level }}</div>
        <div class="stat-label">Ваш уровень</div>
        <div class="stat-badge" :class="levelClass">{{ levelTitle }}</div>
      </div>
    </div>

    <div class="achievements" v-if="earnedAchievements.length > 0">
      <h3 class="achievements-title">🏆 Достижения</h3>
      <div class="achievements-grid">
        <div
          v-for="a in earnedAchievements"
          :key="a.id"
          class="achievement"
          :title="a.description"
        >
          <span class="achievement-icon">{{ a.icon }}</span>
          <span class="achievement-name">{{ a.name }}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="stats-panel welcome" v-else>
    <div class="welcome-content">
      <span class="welcome-icon">🚀</span>
      <div>
        <h2 class="stats-title">Начни обучение!</h2>
        <p class="welcome-text">Выбери курс и пройди первый урок. Здесь появится твоя статистика.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProgressStore } from '../../stores/progress.js'

const props = defineProps({
  courses: { type: Array, default: () => [] }
})

const progress = useProgressStore()

const totalCompleted = computed(() => Object.keys(progress.completed).length)

const totalLessons = computed(() => {
  let sum = 0
  for (const course of props.courses) {
    for (const mod of course.modules) {
      sum += mod.totalLessons || 0
    }
  }
  return sum
})

const lessonsPercent = computed(() => {
  if (totalLessons.value === 0) return 0
  return Math.min(100, Math.round((totalCompleted.value / totalLessons.value) * 100))
})

const totalCourses = computed(() => props.courses.length)

const completedCourses = computed(() => {
  let count = 0
  for (const course of props.courses) {
    const p = progress.courseProgress(course.id, course.modules)
    if (p === 100) count++
  }
  return count
})

const coursesPercent = computed(() => {
  if (totalCourses.value === 0) return 0
  return Math.round((completedCourses.value / totalCourses.value) * 100)
})

// Streak calculation
const STREAK_KEY = 'codebook-streak'

function getStreakData() {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    return raw ? JSON.parse(raw) : { lastDate: null, count: 0 }
  } catch {
    return { lastDate: null, count: 0 }
  }
}

const streakData = getStreakData()
const today = new Date().toISOString().split('T')[0]

// Update streak if completed something today
if (totalCompleted.value > 0) {
  if (streakData.lastDate === today) {
    // Already counted today
  } else {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (streakData.lastDate === yesterday) {
      streakData.count++
    } else if (streakData.lastDate !== today) {
      streakData.count = 1
    }
    streakData.lastDate = today
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData))
  }
}

const streak = computed(() => streakData.count)
const streakLabel = computed(() => {
  const d = streak.value
  if (d === 0) return 'дней подряд'
  if (d === 1) return 'день подряд'
  if (d >= 2 && d <= 4) return 'дня подряд'
  return 'дней подряд'
})
const streakEmoji = computed(() => {
  const s = streak.value
  if (s >= 30) return '🔥🔥🔥'
  if (s >= 14) return '🔥🔥'
  if (s >= 7) return '🔥'
  if (s >= 3) return '⚡'
  if (s >= 1) return '✨'
  return '💤'
})

// Level
const level = computed(() => {
  const c = totalCompleted.value
  if (c >= 500) return 6
  if (c >= 200) return 5
  if (c >= 100) return 4
  if (c >= 50) return 3
  if (c >= 20) return 2
  if (c >= 1) return 1
  return 0
})

const levelTitle = computed(() => {
  const titles = ['Новичок', 'Ученик', 'Практик', 'Знаток', 'Эксперт', 'Мастер', 'Легенда']
  return titles[level.value]
})

const levelClass = computed(() => 'level-' + level.value)

// Achievements
const allAchievements = [
  { id: 'first', icon: '🎯', name: 'Первый шаг', description: 'Пройти первый урок', check: () => totalCompleted.value >= 1 },
  { id: 'ten', icon: '🔟', name: 'Десятка', description: 'Пройти 10 уроков', check: () => totalCompleted.value >= 10 },
  { id: 'fifty', icon: '5️⃣', name: 'Полтинник', description: 'Пройти 50 уроков', check: () => totalCompleted.value >= 50 },
  { id: 'hundred', icon: '💯', name: 'Сотня', description: 'Пройти 100 уроков', check: () => totalCompleted.value >= 100 },
  { id: 'streak3', icon: '⚡', name: '3 дня подряд', description: 'Учиться 3 дня подряд', check: () => streak.value >= 3 },
  { id: 'streak7', icon: '🔥', name: 'Неделя!', description: 'Учиться 7 дней подряд', check: () => streak.value >= 7 },
  { id: 'streak30', icon: '🏆', name: 'Месяц!', description: 'Учиться 30 дней подряд', check: () => streak.value >= 30 },
  { id: 'course1', icon: '🎓', name: 'Выпускник', description: 'Завершить первый курс', check: () => completedCourses.value >= 1 },
  { id: 'course3', icon: '🌟', name: 'Мультиязычный', description: 'Завершить 3 курса', check: () => completedCourses.value >= 3 },
  { id: 'explorer', icon: '🗺️', name: 'Исследователь', description: 'Начать 5 разных курсов', check: () => {
    const started = new Set()
    for (const key of Object.keys(progress.completed)) {
      started.add(key.split(':')[0])
    }
    return started.size >= 5
  }},
]

const earnedAchievements = computed(() => allAchievements.filter(a => a.check()))
</script>

<style scoped>
.stats-panel {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}
.stats-panel.welcome {
  background: linear-gradient(135deg, #667eea11, #764ba211);
  border: 1px dashed var(--accent);
}
.welcome-content {
  display: flex;
  align-items: center;
  gap: 16px;
}
.welcome-icon {
  font-size: 2.5rem;
}
.welcome-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 4px;
}
.stats-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-heading);
  margin-bottom: 16px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.stat-card {
  background: var(--bg-page);
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: center;
}
.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-heading);
  line-height: 1.2;
}
.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 4px;
}
.stat-bar {
  height: 4px;
  background: #f0f4f8;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}
.stat-fill {
  height: 100%;
  background: var(--progress);
  border-radius: 2px;
  transition: width 0.5s ease;
}
.stat-fill.courses {
  background: var(--accent);
}
.stat-sub {
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-top: 4px;
}
.stat-icon {
  font-size: 1.5rem;
  margin-top: 8px;
}
.stat-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 8px;
}
.level-0 { background: #f0f4f8; color: #999; }
.level-1 { background: #e8f5e9; color: #4caf50; }
.level-2 { background: #e3f2fd; color: #2196f3; }
.level-3 { background: #fff3e0; color: #ff9800; }
.level-4 { background: #fce4ec; color: #e91e63; }
.level-5 { background: #f3e5f5; color: #9c27b0; }
.level-6 { background: linear-gradient(135deg, #ffd700, #ff8c00); color: #fff; }

.achievements {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.achievements-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-heading);
  margin-bottom: 12px;
}
.achievements-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.achievement {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-page);
  border-radius: 20px;
  font-size: 0.78rem;
  color: var(--text-primary);
  cursor: default;
  transition: transform 0.15s;
}
.achievement:hover {
  transform: scale(1.05);
}
.achievement-icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<template>
  <div class="roadmap-page">
    <div class="roadmap-hero">
      <h1>🗺️ Карта обучения</h1>
      <p class="roadmap-subtitle">Выбери своё направление и следуй по пути от новичка до профессионала</p>
    </div>

    <div class="paths">
      <div
        v-for="path in paths"
        :key="path.id"
        class="path-card"
        :class="{ expanded: expandedPath === path.id }"
        @click="togglePath(path.id)"
      >
        <div class="path-header">
          <div class="path-icon" :style="{ background: path.color }">{{ path.icon }}</div>
          <div class="path-info">
            <h2 class="path-title">{{ path.title }}</h2>
            <p class="path-desc">{{ path.description }}</p>
            <div class="path-meta">
              <span class="path-duration">⏱️ {{ path.duration }}</span>
              <span class="path-level">📊 {{ path.level }}</span>
              <span class="path-courses">📚 {{ path.steps.length }} курсов</span>
            </div>
          </div>
          <span class="path-arrow">{{ expandedPath === path.id ? '▲' : '▼' }}</span>
        </div>

        <div class="path-steps" v-if="expandedPath === path.id">
          <div
            v-for="(step, i) in path.steps"
            :key="i"
            class="step"
            :class="{ completed: isStepDone(step), current: isStepCurrent(step) }"
          >
            <div class="step-connector">
              <div class="step-dot" :class="{ done: isStepDone(step) }">
                <span v-if="isStepDone(step)">✓</span>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <div class="step-line" v-if="i < path.steps.length - 1"></div>
            </div>
            <div class="step-content">
              <router-link :to="`/course/${step.courseId}`" class="step-link">
                <h3 class="step-title">{{ step.icon }} {{ step.title }}</h3>
              </router-link>
              <p class="step-desc">{{ step.description }}</p>
              <div class="step-progress" v-if="getStepProgress(step) > 0">
                <div class="step-bar">
                  <div class="step-fill" :style="{ width: getStepProgress(step) + '%' }"></div>
                </div>
                <span class="step-percent">{{ getStepProgress(step) }}%</span>
              </div>
              <div class="step-tags">
                <span v-for="tag in step.tags" :key="tag" class="step-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tips-section">
      <h2 class="tips-title">💡 Советы по обучению</h2>
      <div class="tips-grid">
        <div class="tip-card">
          <span class="tip-icon">📅</span>
          <h3>Регулярность важнее скорости</h3>
          <p>30 минут каждый день лучше, чем 5 часов раз в неделю. Установи ежедневное напоминание.</p>
        </div>
        <div class="tip-card">
          <span class="tip-icon">💻</span>
          <h3>Пиши код руками</h3>
          <p>Не копируй — набирай код сам. Мышечная память помогает запоминать синтаксис.</p>
        </div>
        <div class="tip-card">
          <span class="tip-icon">🔄</span>
          <h3>Повторяй</h3>
          <p>Вернись к пройденному через неделю. Повторение — мать учения.</p>
        </div>
        <div class="tip-card">
          <span class="tip-icon">🏗️</span>
          <h3>Создавай проекты</h3>
          <p>После теории сразу применяй знания. Межкурсовые проекты — отличный способ.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCourseStore } from '../stores/course.js'
import { useProgressStore } from '../stores/progress.js'

const courseStore = useCourseStore()
const progressStore = useProgressStore()
const expandedPath = ref('backend-java')

onMounted(() => {
  courseStore.loadCourseList()
})

function togglePath(id) {
  expandedPath.value = expandedPath.value === id ? null : id
}

function getStepProgress(step) {
  const course = courseStore.courses.find(c => c.id === step.courseId)
  if (!course) return 0
  return progressStore.courseProgress(course.id, course.modules)
}

function isStepDone(step) {
  return getStepProgress(step) === 100
}

function isStepCurrent(step) {
  const p = getStepProgress(step)
  return p > 0 && p < 100
}

const paths = ref([
  {
    id: 'backend-java',
    icon: '☕',
    title: 'Backend-разработчик (Java)',
    description: 'Классический путь бэкенд-разработчика: Java → Spring Boot → SQL → Docker → CI/CD',
    color: 'linear-gradient(135deg, #f89820, #e76f00)',
    duration: '6-9 месяцев',
    level: 'С нуля',
    steps: [
      { courseId: 'java', icon: '☕', title: 'Java', description: 'Основы языка, ООП, коллекции, Stream API, многопоточность', tags: ['Язык', 'Основы'] },
      { courseId: 'algorithms', icon: '🧠', title: 'Алгоритмы и ДС', description: 'Структуры данных, сортировки, графы, ДП', tags: ['CS', 'Алгоритмы'] },
      { courseId: 'sql', icon: '🗃️', title: 'SQL', description: 'Запросы, JOIN, индексы, оптимизация', tags: ['БД', 'SQL'] },
      { courseId: 'springboot', icon: '🌱', title: 'Spring Boot', description: 'REST API, Security, JPA, тестирование', tags: ['Фреймворк', 'Backend'] },
      { courseId: 'docker', icon: '🐳', title: 'Docker', description: 'Контейнеры, Docker Compose, деплой', tags: ['DevOps'] },
      { courseId: 'cicd', icon: '🔄', title: 'CI/CD', description: 'GitHub Actions, автоматизация', tags: ['DevOps'] },
      { courseId: 'systemdesign', icon: '🏛️', title: 'System Design', description: 'Масштабирование, кеширование, микросервисы', tags: ['Архитектура'] },
      { courseId: 'interview', icon: '🎯', title: 'Собеседования', description: 'Behavioral, coding, system design', tags: ['Карьера'] },
    ]
  },
  {
    id: 'backend-python',
    icon: '🐍',
    title: 'Backend-разработчик (Python)',
    description: 'Python → FastAPI/Django → SQL → Docker → деплой',
    color: 'linear-gradient(135deg, #3776AB, #FFD43B)',
    duration: '5-8 месяцев',
    level: 'С нуля',
    steps: [
      { courseId: 'python', icon: '🐍', title: 'Python', description: 'Основы, ООП, декораторы, async, работа с данными', tags: ['Язык', 'Основы'] },
      { courseId: 'algorithms', icon: '🧠', title: 'Алгоритмы и ДС', description: 'Структуры данных, поиск, сортировки', tags: ['CS'] },
      { courseId: 'sql', icon: '🗃️', title: 'SQL', description: 'PostgreSQL, запросы, оптимизация', tags: ['БД'] },
      { courseId: 'fastapi', icon: '⚡', title: 'FastAPI', description: 'REST API, Pydantic, SQLAlchemy, JWT', tags: ['Фреймворк'] },
      { courseId: 'django', icon: '🎸', title: 'Django', description: 'MTV, ORM, DRF, Celery', tags: ['Фреймворк'] },
      { courseId: 'docker', icon: '🐳', title: 'Docker', description: 'Контейнеризация и деплой', tags: ['DevOps'] },
      { courseId: 'interview', icon: '🎯', title: 'Собеседования', description: 'Подготовка к техническим интервью', tags: ['Карьера'] },
    ]
  },
  {
    id: 'backend-go',
    icon: '🐹',
    title: 'Backend-разработчик (Go)',
    description: 'Go → HTTP/gRPC → Docker → Kubernetes → микросервисы',
    color: 'linear-gradient(135deg, #00ADD8, #007d9c)',
    duration: '5-8 месяцев',
    level: 'С нуля',
    steps: [
      { courseId: 'golang', icon: '🐹', title: 'Go', description: 'Основы, горутины, каналы, HTTP, REST API', tags: ['Язык', 'Основы'] },
      { courseId: 'algorithms', icon: '🧠', title: 'Алгоритмы', description: 'Структуры данных и алгоритмы', tags: ['CS'] },
      { courseId: 'sql', icon: '🗃️', title: 'SQL', description: 'Базы данных', tags: ['БД'] },
      { courseId: 'docker', icon: '🐳', title: 'Docker', description: 'Контейнеры', tags: ['DevOps'] },
      { courseId: 'kubernetes', icon: '☸️', title: 'Kubernetes', description: 'Оркестрация контейнеров', tags: ['DevOps'] },
      { courseId: 'cicd', icon: '🔄', title: 'CI/CD', description: 'Автоматизация', tags: ['DevOps'] },
      { courseId: 'systemdesign', icon: '🏛️', title: 'System Design', description: 'Проектирование систем', tags: ['Архитектура'] },
      { courseId: 'interview', icon: '🎯', title: 'Собеседования', description: 'Подготовка', tags: ['Карьера'] },
    ]
  },
  {
    id: 'frontend',
    icon: '⚛️',
    title: 'Frontend-разработчик',
    description: 'HTML/CSS/JS → TypeScript → React → тестирование',
    color: 'linear-gradient(135deg, #61DAFB, #3178C6)',
    duration: '5-7 месяцев',
    level: 'С нуля',
    steps: [
      { courseId: 'webdev', icon: '🌍', title: 'Веб-разработка', description: 'HTML, CSS, JavaScript с нуля', tags: ['Основы', 'Веб'] },
      { courseId: 'javascript', icon: '🟨', title: 'JavaScript', description: 'Углублённый JS, async, Node.js', tags: ['Язык'] },
      { courseId: 'typescript', icon: '🔷', title: 'TypeScript', description: 'Типизация, generics, утилиты', tags: ['Язык'] },
      { courseId: 'react', icon: '⚛️', title: 'React', description: 'Компоненты, хуки, Redux, Next.js', tags: ['Фреймворк'] },
      { courseId: 'docker', icon: '🐳', title: 'Docker', description: 'Контейнеризация фронтенда', tags: ['DevOps'] },
      { courseId: 'interview', icon: '🎯', title: 'Собеседования', description: 'Подготовка', tags: ['Карьера'] },
    ]
  },
  {
    id: 'fullstack',
    icon: '🏗️',
    title: 'Full-Stack разработчик',
    description: 'Фронтенд + бэкенд + DevOps: полный цикл разработки',
    color: 'linear-gradient(135deg, #FF6F00, #FF8F00)',
    duration: '8-12 месяцев',
    level: 'С нуля',
    steps: [
      { courseId: 'webdev', icon: '🌍', title: 'Веб-разработка', description: 'HTML, CSS, JavaScript', tags: ['Фронтенд'] },
      { courseId: 'javascript', icon: '🟨', title: 'JavaScript', description: 'Углублённый JS + Node.js', tags: ['Язык'] },
      { courseId: 'typescript', icon: '🔷', title: 'TypeScript', description: 'Типизация', tags: ['Язык'] },
      { courseId: 'react', icon: '⚛️', title: 'React', description: 'Фронтенд фреймворк', tags: ['Фронтенд'] },
      { courseId: 'python', icon: '🐍', title: 'Python', description: 'Бэкенд язык', tags: ['Бэкенд'] },
      { courseId: 'fastapi', icon: '⚡', title: 'FastAPI', description: 'REST API', tags: ['Бэкенд'] },
      { courseId: 'sql', icon: '🗃️', title: 'SQL', description: 'Базы данных', tags: ['БД'] },
      { courseId: 'docker', icon: '🐳', title: 'Docker', description: 'Контейнеры', tags: ['DevOps'] },
      { courseId: 'cicd', icon: '🔄', title: 'CI/CD', description: 'Автоматизация', tags: ['DevOps'] },
      { courseId: 'fullstack', icon: '🏗️', title: 'Проекты', description: 'Межкурсовые full-stack проекты', tags: ['Практика'] },
      { courseId: 'interview', icon: '🎯', title: 'Собеседования', description: 'Подготовка', tags: ['Карьера'] },
    ]
  },
  {
    id: 'devops',
    icon: '🔧',
    title: 'DevOps инженер',
    description: 'Docker → Kubernetes → CI/CD → мониторинг → System Design',
    color: 'linear-gradient(135deg, #2496ED, #326CE5)',
    duration: '4-6 месяцев',
    level: 'Нужны базовые знания программирования',
    steps: [
      { courseId: 'python', icon: '🐍', title: 'Python (основы)', description: 'Скриптинг и автоматизация', tags: ['Язык'] },
      { courseId: 'docker', icon: '🐳', title: 'Docker', description: 'Контейнеры, образы, Compose', tags: ['Основы'] },
      { courseId: 'kubernetes', icon: '☸️', title: 'Kubernetes', description: 'Pods, Deployments, Services, Helm', tags: ['Оркестрация'] },
      { courseId: 'cicd', icon: '🔄', title: 'CI/CD', description: 'GitHub Actions, GitLab CI', tags: ['Автоматизация'] },
      { courseId: 'golang', icon: '🐹', title: 'Go (утилиты)', description: 'CLI утилиты на Go', tags: ['Язык'] },
      { courseId: 'systemdesign', icon: '🏛️', title: 'System Design', description: 'Архитектура и масштабирование', tags: ['Архитектура'] },
    ]
  },
  {
    id: 'mobile-kotlin',
    icon: '📱',
    title: 'Android-разработчик (Kotlin)',
    description: 'Kotlin → Android → REST API → тестирование',
    color: 'linear-gradient(135deg, #7F52FF, #A855F7)',
    duration: '5-7 месяцев',
    level: 'С нуля',
    steps: [
      { courseId: 'kotlin', icon: '🟣', title: 'Kotlin', description: 'Основы языка, null safety, корутины', tags: ['Язык'] },
      { courseId: 'algorithms', icon: '🧠', title: 'Алгоритмы', description: 'Базовые структуры данных', tags: ['CS'] },
      { courseId: 'sql', icon: '🗃️', title: 'SQL', description: 'Для работы с Room DB', tags: ['БД'] },
      { courseId: 'interview', icon: '🎯', title: 'Собеседования', description: 'Подготовка к интервью', tags: ['Карьера'] },
    ]
  },
  {
    id: 'ai',
    icon: '🤖',
    title: 'AI-разработчик',
    description: 'Python → Claude API → Agent SDK → RAG → деплой',
    color: 'linear-gradient(135deg, #D97706, #F59E0B)',
    duration: '3-5 месяцев',
    level: 'Нужны базовые знания Python',
    steps: [
      { courseId: 'python', icon: '🐍', title: 'Python', description: 'Основы + async + работа с API', tags: ['Язык'] },
      { courseId: 'claude', icon: '🤖', title: 'Claude & Claude Code', description: 'Промптинг, API, Agent SDK, RAG', tags: ['AI'] },
      { courseId: 'fastapi', icon: '⚡', title: 'FastAPI', description: 'Для деплоя AI-приложений', tags: ['Бэкенд'] },
      { courseId: 'docker', icon: '🐳', title: 'Docker', description: 'Контейнеризация AI-сервисов', tags: ['DevOps'] },
    ]
  },
])
</script>

<style scoped>
.roadmap-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}
.roadmap-hero {
  text-align: center;
  padding: 24px 0 20px;
}
.roadmap-hero h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-heading);
}
.roadmap-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 6px;
}

.paths {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}
.path-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.path-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.path-card.expanded {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}
.path-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}
.path-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}
.path-info {
  flex: 1;
}
.path-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-heading);
}
.path-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 2px;
}
.path-meta {
  display: flex;
  gap: 12px;
  margin-top: 6px;
  font-size: 0.72rem;
  color: var(--text-secondary);
}
.path-arrow {
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.path-steps {
  padding: 0 20px 20px 20px;
  border-top: 1px solid var(--border);
}
.step {
  display: flex;
  gap: 16px;
  padding-top: 16px;
}
.step-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 32px;
  flex-shrink: 0;
}
.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-page);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  flex-shrink: 0;
}
.step-dot.done {
  background: var(--progress);
  border-color: var(--progress);
  color: white;
}
.step.current .step-dot {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-light);
}
.step-line {
  width: 2px;
  flex: 1;
  background: var(--border);
  min-height: 16px;
}
.step.completed .step-line {
  background: var(--progress);
}
.step-content {
  flex: 1;
  padding-bottom: 8px;
}
.step-link {
  text-decoration: none;
}
.step-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-heading);
}
.step-link:hover .step-title {
  color: var(--accent);
}
.step-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 2px;
}
.step-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.step-bar {
  flex: 1;
  max-width: 120px;
  height: 4px;
  background: #f0f4f8;
  border-radius: 2px;
  overflow: hidden;
}
.step-fill {
  height: 100%;
  background: var(--progress);
  border-radius: 2px;
  transition: width 0.3s;
}
.step-percent {
  font-size: 0.7rem;
  color: var(--progress);
  font-weight: 600;
}
.step-tags {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-wrap: wrap;
}
.step-tag {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 10px;
  background: #f0f4f8;
  color: var(--text-secondary);
}

.tips-section {
  margin-top: 16px;
}
.tips-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-heading);
  margin-bottom: 16px;
}
.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.tip-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 16px;
  border: 1px solid var(--border);
}
.tip-icon {
  font-size: 1.5rem;
  display: block;
  margin-bottom: 8px;
}
.tip-card h3 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-heading);
  margin-bottom: 4px;
}
.tip-card p {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .path-meta { flex-wrap: wrap; }
  .tips-grid { grid-template-columns: 1fr; }
}
</style>

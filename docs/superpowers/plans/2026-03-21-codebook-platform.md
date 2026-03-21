# CodeBook Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vue 3 SPA for learning programming, starting with a full Java course — theory lessons with rich content blocks, practice tasks with self-check, and localStorage-based progress tracking.

**Architecture:** Pure client-side SPA with Vue 3 + Vite. Course content lives in JS data files, lazy-loaded per module. Pinia store manages progress state synced to localStorage. No backend for MVP.

**Tech Stack:** Vue 3 (Composition API), Vite, Vue Router, Pinia, highlight.js

**Spec:** `docs/superpowers/specs/2026-03-21-codebook-platform-design.md`

---

## File Map

```
src/
├── App.vue                                  # Root layout: router-view
├── main.js                                  # App entry: create app, install router/pinia
├── assets/
│   └── styles/
│       ├── main.css                         # Global styles, variables, reset
│       └── responsive.css                   # Mobile breakpoints
├── router/
│   └── index.js                             # All routes, lazy loading, 404 catch-all
├── stores/
│   ├── progress.js                          # Pinia store: completed map, localStorage sync
│   └── course.js                            # Pinia store: course/module data loading
├── data/
│   └── java/
│       ├── index.js                         # Course metadata + module list
│       └── modules/
│           ├── module-1.js                  # Введение в Java (5 lessons)
│           └── module-2.js                  # Переменные и типы данных (8 lessons)
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue                    # Logo, breadcrumbs
│   │   ├── AppSidebar.vue                   # Module lesson tree with progress
│   │   └── AppFooter.vue                    # Footer with reset progress
│   ├── course/
│   │   ├── CourseCard.vue                   # Language card on homepage
│   │   ├── ModuleCard.vue                   # Module card on course page
│   │   ├── LessonContent.vue               # Renders content blocks by type
│   │   ├── CodeBlock.vue                    # Code with highlight.js + copy button
│   │   └── NoteBlock.vue                    # Note/warning/tip blocks
│   ├── practice/
│   │   ├── TaskCard.vue                     # Practice task with requirements
│   │   ├── SolutionReveal.vue               # Collapsible solution + explanation
│   │   └── HintBlock.vue                    # Collapsible hint
│   └── ui/
│       ├── ProgressBar.vue                  # Reusable progress bar
│       ├── DifficultyBadge.vue              # Easy/medium/hard badge
│       ├── Breadcrumbs.vue                  # Breadcrumb navigation
│       └── LessonNav.vue                    # Prev/Next + "Mark read" button
└── views/
    ├── HomePage.vue                         # Course cards grid
    ├── CoursePage.vue                       # Module cards for a course
    ├── LessonPage.vue                       # Theory or practice lesson
    └── NotFoundPage.vue                     # 404 page
```

Note: `ModulePage.vue` from the spec is merged into `LessonPage.vue` — when navigating to a module, the router redirects to its first lesson. The sidebar in `LessonPage` serves as the module navigation. This avoids a redundant page.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/App.vue`

- [ ] **Step 1: Scaffold Vue project with Vite**

```bash
cd /home/nurdaulet/other/review_book
npm create vite@latest . -- --template vue
```

Select: Vue, JavaScript when prompted. If the directory is non-empty, allow overwrite.

- [ ] **Step 2: Install dependencies**

```bash
npm install vue-router@4 pinia highlight.js
```

- [ ] **Step 3: Clean up scaffolded files**

Remove default Vite demo files:
```bash
rm -f src/components/HelloWorld.vue src/assets/vue.svg src/style.css
rm -rf src/components/icons
```

- [ ] **Step 4: Create base `src/main.js`**

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import './assets/styles/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

- [ ] **Step 5: Create base `src/App.vue`**

```vue
<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
</script>
```

- [ ] **Step 6: Create directory structure**

```bash
mkdir -p src/assets/styles
mkdir -p src/router
mkdir -p src/stores
mkdir -p src/data/java/modules
mkdir -p src/components/{layout,course,practice,ui}
mkdir -p src/views
```

- [ ] **Step 7: Create placeholder CSS files**

`src/assets/styles/main.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-page: #f8f9fb;
  --bg-card: #ffffff;
  --text-heading: #1a1a2e;
  --text-primary: #444444;
  --text-secondary: #999999;
  --accent: #667eea;
  --accent-light: #667eea11;
  --progress: #4caf50;
  --practice: #f5a623;
  --danger: #e53935;
  --info: #2196f3;
  --warning: #ffc107;
  --success: #4caf50;
  --border: #e9ecef;
  --code-bg: #1e1e2e;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  background: var(--bg-page);
  color: var(--text-primary);
  line-height: 1.6;
}

a {
  color: var(--accent);
  text-decoration: none;
}

code {
  font-family: var(--font-mono);
  background: #f0f4f8;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 0.9em;
  color: #e83e8c;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
```

`src/assets/styles/responsive.css`:
```css
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  .sidebar.open {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    z-index: 100;
    background: var(--bg-card);
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  }
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
  }
  .burger-btn {
    display: flex;
  }
}

@media (min-width: 769px) {
  .burger-btn {
    display: none;
  }
  .sidebar-overlay {
    display: none;
  }
}
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts on http://localhost:5173 (or similar port), no errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vue 3 project with Vite, router, pinia, highlight.js"
```

---

### Task 2: Router + Views Shell

**Files:**
- Create: `src/router/index.js`, `src/views/HomePage.vue`, `src/views/CoursePage.vue`, `src/views/LessonPage.vue`, `src/views/NotFoundPage.vue`

- [ ] **Step 1: Create router**

`src/router/index.js`:
```js
import { createRouter, createWebHistory } from 'vue-router'

const HomePage = () => import('../views/HomePage.vue')
const CoursePage = () => import('../views/CoursePage.vue')
const LessonPage = () => import('../views/LessonPage.vue')
const NotFoundPage = () => import('../views/NotFoundPage.vue')

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/course/:lang', name: 'course', component: CoursePage },
  {
    path: '/course/:lang/module/:moduleId/lesson/:lessonId',
    name: 'lesson',
    component: LessonPage
  },
  {
    path: '/course/:lang/module/:moduleId',
    redirect: to => ({
      name: 'lesson',
      params: { ...to.params, lessonId: '1' }
    })
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
```

- [ ] **Step 2: Create HomePage shell**

`src/views/HomePage.vue`:
```vue
<template>
  <div class="home-page">
    <div class="hero">
      <h1>Выбери язык программирования</h1>
      <p class="hero-subtitle">От основ до продвинутого уровня. Теория + практика.</p>
    </div>
    <div class="courses-grid">
      <!-- CourseCard components will go here -->
      <p>Курсы загружаются...</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}
.hero {
  text-align: center;
  padding: 32px 0 20px;
}
.hero h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-heading);
}
.hero-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 6px;
}
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding-top: 8px;
}
</style>
```

- [ ] **Step 3: Create CoursePage shell**

`src/views/CoursePage.vue`:
```vue
<template>
  <div class="course-page">
    <h1>{{ $route.params.lang }}</h1>
    <p>Модули курса загружаются...</p>
  </div>
</template>

<script setup>
</script>

<style scoped>
.course-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}
</style>
```

- [ ] **Step 4: Create LessonPage shell**

`src/views/LessonPage.vue`:
```vue
<template>
  <div class="lesson-page">
    <p>Урок {{ $route.params.lessonId }} модуля {{ $route.params.moduleId }}</p>
  </div>
</template>

<script setup>
</script>

<style scoped>
.lesson-page {
  display: flex;
  min-height: calc(100vh - 120px);
}
</style>
```

- [ ] **Step 5: Create NotFoundPage**

`src/views/NotFoundPage.vue`:
```vue
<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Страница не найдена</p>
    <router-link to="/" class="back-link">← Вернуться на главную</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 80px 24px;
}
.not-found h1 {
  font-size: 4rem;
  font-weight: 700;
  color: var(--text-heading);
}
.not-found p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 12px 0 24px;
}
.back-link {
  color: var(--accent);
  font-weight: 500;
}
</style>
```

- [ ] **Step 6: Verify all routes work**

Open browser:
- `http://localhost:5173/` — shows HomePage
- `http://localhost:5173/course/java` — shows CoursePage
- `http://localhost:5173/course/java/module/1/lesson/1` — shows LessonPage
- `http://localhost:5173/course/java/module/1` — redirects to lesson/1
- `http://localhost:5173/blah` — shows 404

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add router with lazy-loaded views and 404 page"
```

---

### Task 3: Pinia Stores (Progress + Course)

**Files:**
- Create: `src/stores/progress.js`, `src/stores/course.js`

- [ ] **Step 1: Create progress store**

`src/stores/progress.js`:
```js
import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'

const STORAGE_KEY = 'codebook-progress'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useProgressStore = defineStore('progress', () => {
  const completed = reactive(loadFromStorage())

  function markComplete(courseId, moduleId, lessonId) {
    const key = `${courseId}:${moduleId}:${lessonId}`
    completed[key] = true
    saveToStorage({ ...completed })
  }

  function isCompleted(courseId, moduleId, lessonId) {
    return !!completed[`${courseId}:${moduleId}:${lessonId}`]
  }

  function moduleProgress(courseId, moduleId, totalLessons) {
    let count = 0
    for (let i = 1; i <= totalLessons; i++) {
      if (completed[`${courseId}:${moduleId}:${i}`]) count++
    }
    return count
  }

  function isModuleComplete(courseId, moduleId, totalLessons) {
    return moduleProgress(courseId, moduleId, totalLessons) === totalLessons
  }

  function courseProgress(courseId, modules) {
    if (!modules.length) return 0
    let completedModules = 0
    for (const m of modules) {
      if (isModuleComplete(courseId, m.id, m.totalLessons)) completedModules++
    }
    return Math.round((completedModules / modules.length) * 100)
  }

  function resetAll() {
    Object.keys(completed).forEach(key => delete completed[key])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    completed,
    markComplete,
    isCompleted,
    moduleProgress,
    isModuleComplete,
    courseProgress,
    resetAll
  }
})
```

- [ ] **Step 2: Create course store**

`src/stores/course.js`:
```js
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

const courseImports = {
  java: () => import('../data/java/index.js')
}

const moduleImports = {
  java: (moduleId) => import(`../data/java/modules/module-${moduleId}.js`)
}

export const useCourseStore = defineStore('course', () => {
  const courses = ref([])
  const currentCourse = shallowRef(null)
  const currentModule = shallowRef(null)
  const loading = ref(false)

  async function loadCourseList() {
    const list = []
    for (const [key, importFn] of Object.entries(courseImports)) {
      const mod = await importFn()
      list.push(mod.default)
    }
    courses.value = list
  }

  async function loadCourse(lang) {
    if (currentCourse.value?.id === lang) return currentCourse.value
    loading.value = true
    try {
      const importFn = courseImports[lang]
      if (!importFn) return null
      const mod = await importFn()
      currentCourse.value = mod.default
      return mod.default
    } finally {
      loading.value = false
    }
  }

  async function loadModule(lang, moduleId) {
    if (currentModule.value?.id === Number(moduleId) && currentCourse.value?.id === lang) {
      return currentModule.value
    }
    loading.value = true
    try {
      const importFn = moduleImports[lang]
      if (!importFn) return null
      const mod = await importFn(moduleId)
      currentModule.value = mod.default
      return mod.default
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    currentCourse,
    currentModule,
    loading,
    loadCourseList,
    loadCourse,
    loadModule
  }
})
```

- [ ] **Step 3: Verify stores instantiate without errors**

Open browser console, check no errors from Pinia. The stores won't do anything visible yet — this verifies imports and reactivity work.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add progress and course Pinia stores with localStorage sync"
```

---

### Task 4: Layout Components (Header + Footer)

**Files:**
- Create: `src/components/layout/AppHeader.vue`, `src/components/layout/AppFooter.vue`, `src/components/ui/Breadcrumbs.vue`

- [ ] **Step 1: Create AppHeader**

`src/components/layout/AppHeader.vue`:
```vue
<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">📚</span>
        <span class="logo-text">CodeBook</span>
        <span class="logo-tagline">Изучай программирование</span>
      </router-link>
      <Breadcrumbs v-if="showBreadcrumbs" />
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumbs from '../ui/Breadcrumbs.vue'

const route = useRoute()
const showBreadcrumbs = computed(() => route.name !== 'home')
</script>

<style scoped>
.app-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-icon { font-size: 1.25rem; }
.logo-text { font-size: 1.1rem; font-weight: 700; color: var(--text-heading); }
.logo-tagline { font-size: 0.8rem; color: var(--text-secondary); border-left: 1px solid var(--border); padding-left: 12px; }
@media (max-width: 768px) { .logo-tagline { display: none; } }
</style>
```

- [ ] **Step 2: Create Breadcrumbs component**

`src/components/ui/Breadcrumbs.vue`:
```vue
<template>
  <nav class="breadcrumbs" v-if="crumbs.length">
    <template v-for="(crumb, i) in crumbs" :key="i">
      <span v-if="i > 0" class="separator">›</span>
      <router-link v-if="crumb.to" :to="crumb.to" class="crumb-link">{{ crumb.label }}</router-link>
      <span v-else class="crumb-current">{{ crumb.label }}</span>
    </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const crumbs = computed(() => {
  const result = []
  const { lang, moduleId, lessonId } = route.params
  if (lang) result.push({ label: lang.charAt(0).toUpperCase() + lang.slice(1), to: `/course/${lang}` })
  if (moduleId) result.push({ label: `Модуль ${moduleId}`, to: `/course/${lang}/module/${moduleId}` })
  if (lessonId) result.push({ label: `Урок ${lessonId}` })
  return result
})
</script>

<style scoped>
.breadcrumbs { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; }
.separator { color: var(--text-secondary); }
.crumb-link { color: var(--accent); }
.crumb-current { color: var(--text-primary); }
</style>
```

- [ ] **Step 3: Create AppFooter**

`src/components/layout/AppFooter.vue`:
```vue
<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <span class="footer-text">📚 CodeBook — изучай программирование</span>
      <button class="reset-btn" @click="handleReset">Сбросить прогресс</button>
    </div>
  </footer>
</template>

<script setup>
import { useProgressStore } from '../../stores/progress.js'

const progress = useProgressStore()

function handleReset() {
  if (confirm('Вы уверены? Весь прогресс будет удалён.')) {
    progress.resetAll()
  }
}
</script>

<style scoped>
.app-footer { background: var(--bg-card); border-top: 1px solid var(--border); margin-top: auto; padding: 16px 24px; }
.footer-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.footer-text { font-size: 0.8rem; color: var(--text-secondary); }
.reset-btn { font-size: 0.75rem; color: var(--danger); background: none; border: 1px solid var(--danger); padding: 4px 12px; border-radius: var(--radius-sm); cursor: pointer; }
.reset-btn:hover { background: #fde8e8; }
</style>
```

- [ ] **Step 4: Verify header and footer render on all pages**

Open browser, navigate between pages. Header with logo should be sticky. Footer should appear at bottom. Breadcrumbs should update per route.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add AppHeader with breadcrumbs and AppFooter with reset progress"
```

---

### Task 5: Course Data (Java — 2 Modules)

**Files:**
- Create: `src/data/java/index.js`, `src/data/java/modules/module-1.js`, `src/data/java/modules/module-2.js`

- [ ] **Step 1: Create Java course index**

`src/data/java/index.js`:
```js
export default {
  id: 'java',
  title: 'Java',
  icon: '☕',
  description: 'Полный курс Java от основ до продвинутого уровня. ООП, коллекции, многопоточность и многое другое.',
  color: '#f89820',
  modules: [
    { id: 1, title: 'Введение в Java', icon: '🚀', totalLessons: 5 },
    { id: 2, title: 'Переменные и типы данных', icon: '📦', totalLessons: 8 }
  ]
}
```

- [ ] **Step 2: Create module-1.js (Введение в Java)**

`src/data/java/modules/module-1.js` — full content with 5 lessons (3 theory + 2 practice). This file will be large (~200 lines) because it contains all lesson content. See separate content writing step.

```js
export default {
  id: 1,
  title: 'Введение в Java',
  description: 'Что такое Java, зачем она нужна, как установить и написать первую программу',
  lessons: [
    {
      id: 1,
      title: 'Что такое Java?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Java — это один из самых популярных языков программирования в мире. Его используют для создания мобильных приложений (Android), веб-серверов, игр и даже программ для космических аппаратов!' },
        { type: 'tip', value: 'Представь, что язык программирования — это иностранный язык. Как русский или английский помогают общаться с людьми, так Java помогает "общаться" с компьютером и говорить ему, что делать.' },
        { type: 'heading', value: 'Почему именно Java?' },
        { type: 'list', items: [
          'Работает везде — написал один раз, запускай на любом компьютере (Windows, Mac, Linux)',
          'Огромное сообщество — миллионы разработчиков, легко найти помощь',
          'Много работы — Java-разработчики очень востребованы',
          'Строгий язык — помогает писать надёжный код и учит дисциплине'
        ]},
        { type: 'heading', value: 'Как Java работает?' },
        { type: 'text', value: 'Когда ты пишешь код на Java, компьютер не понимает его напрямую. Сначала специальная программа (компилятор) переводит твой код в особый формат — байт-код. Потом другая программа (JVM — Java Virtual Machine) запускает этот байт-код.' },
        { type: 'note', value: 'JVM (Java Virtual Machine) — это "переводчик" между твоим кодом и компьютером. Именно благодаря JVM Java работает на любой операционной системе.' },
        { type: 'text', value: 'Это как если бы ты написал письмо на русском, переводчик перевёл его на универсальный язык, и теперь его может прочитать любой человек в мире.' }
      ]
    },
    {
      id: 2,
      title: 'Установка JDK и IDE',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чтобы писать программы на Java, тебе нужно установить два инструмента: JDK и IDE.' },
        { type: 'heading', value: 'Что такое JDK?' },
        { type: 'text', value: 'JDK (Java Development Kit) — это набор инструментов для разработки на Java. Он включает компилятор, JVM и стандартные библиотеки.' },
        { type: 'tip', value: 'Представь JDK как набор инструментов плотника: молоток, пила, рубанок. Без них ты не сможешь построить стол, а без JDK — не сможешь написать программу.' },
        { type: 'heading', value: 'Как установить JDK' },
        { type: 'list', items: [
          'Перейди на сайт Oracle или Adoptium (adoptium.net)',
          'Скачай JDK последней LTS версии (например, JDK 21)',
          'Запусти установщик и следуй инструкциям',
          'Проверь установку командой в терминале: java --version'
        ]},
        { type: 'code', language: 'bash', value: '$ java --version\njava 21.0.2 2024-01-16 LTS' },
        { type: 'heading', value: 'Что такое IDE?' },
        { type: 'text', value: 'IDE (Integrated Development Environment) — это программа, в которой ты пишешь код. Она подсвечивает синтаксис, находит ошибки и помогает запускать программы.' },
        { type: 'text', value: 'Для Java рекомендуем IntelliJ IDEA Community Edition — она бесплатная и очень удобная. Скачай её с сайта jetbrains.com.' },
        { type: 'warning', value: 'Не путай JDK и JRE! JRE (Java Runtime Environment) — только для запуска программ. Для разработки нужен именно JDK.' }
      ]
    },
    {
      id: 3,
      title: 'Первая программа: Hello World',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пришло время написать первую программу! По традиции, первая программа на любом языке выводит на экран "Hello, World!".' },
        { type: 'heading', value: 'Создаём программу' },
        { type: 'text', value: 'Создай новый файл с именем Main.java и напиши в нём:' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
        { type: 'text', value: 'Давай разберём каждую строчку:' },
        { type: 'list', items: [
          'public class Main — мы создаём класс (контейнер для кода) с именем Main',
          'public static void main(String[] args) — это главный метод, точка входа в программу. Java всегда начинает работу отсюда',
          'System.out.println("Hello, World!") — эта команда выводит текст на экран',
          'Фигурные скобки {} — обозначают начало и конец блока кода',
          'Точка с запятой ; — ставится в конце каждой команды'
        ]},
        { type: 'tip', value: 'Думай о main() как о входной двери в дом. Когда ты запускаешь программу, Java "входит" через эту дверь и начинает выполнять команды внутри.' },
        { type: 'heading', value: 'Запускаем программу' },
        { type: 'code', language: 'bash', value: '$ javac Main.java\n$ java Main\nHello, World!' },
        { type: 'text', value: 'javac — это компилятор, он переводит твой код в байт-код. java — запускает скомпилированную программу.' },
        { type: 'warning', value: 'Имя файла должно совпадать с именем класса! Если класс называется Main, файл должен быть Main.java (с большой буквы).' },
        { type: 'note', value: 'System.out.println() — запомни эту команду, она выводит текст на экран и переходит на новую строку. Есть ещё System.out.print() — без перехода на новую строку.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: Hello World',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая выводит на экран приветствие с твоим именем.',
      requirements: [
        'Создай класс Main с методом main',
        'Выведи текст "Привет! Меня зовут [твоё имя]"',
        'Используй System.out.println()'
      ],
      expectedOutput: 'Привет! Меня зовут Нурдаулет',
      hint: 'Вспомни структуру из урока Hello World. Замени текст в кавычках на своё приветствие.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Привет! Меня зовут Нурдаулет");\n    }\n}',
      explanation: 'Мы использовали точно такую же структуру как в Hello World — класс Main, метод main, и команду System.out.println() для вывода текста. Просто заменили текст в кавычках.'
    },
    {
      id: 5,
      title: 'Практика: Несколько строк',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая выводит информацию о себе в 3 строки.',
      requirements: [
        'Выведи своё имя на первой строке',
        'Выведи свой город на второй строке',
        'Выведи свой любимый язык программирования на третьей строке',
        'Используй три отдельных System.out.println()'
      ],
      expectedOutput: 'Имя: Нурдаулет\nГород: Астана\nЛюбимый язык: Java',
      hint: 'Используй три команды System.out.println() подряд — каждая выведет текст на новой строке.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Имя: Нурдаулет");\n        System.out.println("Город: Астана");\n        System.out.println("Любимый язык: Java");\n    }\n}',
      explanation: 'Каждый вызов System.out.println() выводит текст и переходит на новую строку. Поэтому три вызова — три строки в выводе. Команды выполняются сверху вниз, по порядку.'
    }
  ]
}
```

- [ ] **Step 3: Create module-2.js (Переменные и типы данных)**

`src/data/java/modules/module-2.js` — 8 lessons (5 theory + 3 practice). Write full content.

```js
export default {
  id: 2,
  title: 'Переменные и типы данных',
  description: 'Научимся хранить данные в переменных и узнаем какие типы данных есть в Java',
  lessons: [
    {
      id: 1,
      title: 'Что такое переменные?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Переменная — это именованное место в памяти компьютера, где хранится какое-то значение. Ты даёшь ей имя и кладёшь туда данные.' },
        { type: 'tip', value: 'Представь переменную как коробку с наклейкой. На наклейке написано название (имя переменной), а внутри лежит что-то (значение). Ты можешь положить что-то в коробку, достать или заменить содержимое.' },
        { type: 'heading', value: 'Как создать переменную' },
        { type: 'text', value: 'В Java, чтобы создать переменную, нужно указать её тип, дать имя и (необязательно) присвоить значение:' },
        { type: 'code', language: 'java', value: '// Создаём переменную и сразу даём значение\nint age = 25;\n\n// Или сначала создаём, потом даём значение\nint height;\nheight = 180;' },
        { type: 'heading', value: 'Правила именования' },
        { type: 'list', items: [
          'Имя начинается с буквы, _ или $ (но не с цифры)',
          'Может содержать буквы, цифры, _ и $',
          'Нельзя использовать пробелы',
          'Нельзя использовать зарезервированные слова (int, class, public и т.д.)',
          'Java различает регистр: age и Age — разные переменные',
          'Принято использовать camelCase: myFirstName, totalPrice'
        ]},
        { type: 'code', language: 'java', value: '// Правильно:\nint myAge = 25;\nString firstName = "Нурдаулет";\ndouble totalPrice = 99.99;\n\n// Неправильно:\n// int 1stPlace = 1;     // начинается с цифры\n// int my age = 25;      // пробел в имени\n// int class = 5;        // зарезервированное слово' },
        { type: 'warning', value: 'Java строго типизированный язык — тип переменной нельзя изменить после создания. Если ты создал int age, туда нельзя положить текст.' }
      ]
    },
    {
      id: 2,
      title: 'Целые числа: int и long',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для хранения целых чисел (без дробной части) в Java есть несколько типов. Два самых важных: int и long.' },
        { type: 'heading', value: 'int — основной тип для целых чисел' },
        { type: 'text', value: 'int хранит числа от -2 147 483 648 до 2 147 483 647 (примерно ±2 миллиарда). Этого хватает для большинства задач.' },
        { type: 'code', language: 'java', value: 'int age = 25;\nint year = 2024;\nint temperature = -15;\nint population = 2000000000; // 2 миллиарда — ок\n\nSystem.out.println("Возраст: " + age);\nSystem.out.println("Год: " + year);' },
        { type: 'heading', value: 'long — для очень больших чисел' },
        { type: 'text', value: 'Если числа больше 2 миллиардов — используй long. Например, население Земли или расстояние до звёзд.' },
        { type: 'code', language: 'java', value: 'long worldPopulation = 8000000000L; // обрати внимание на L в конце\nlong distanceToSun = 149600000000L;\n\nSystem.out.println("Население Земли: " + worldPopulation);' },
        { type: 'warning', value: 'Число типа long нужно писать с буквой L на конце! Без неё Java подумает, что это int, и выдаст ошибку если число слишком большое.' },
        { type: 'heading', value: 'Арифметические операции' },
        { type: 'code', language: 'java', value: 'int a = 10;\nint b = 3;\n\nSystem.out.println(a + b);  // 13 (сложение)\nSystem.out.println(a - b);  // 7  (вычитание)\nSystem.out.println(a * b);  // 30 (умножение)\nSystem.out.println(a / b);  // 3  (деление — целая часть!)\nSystem.out.println(a % b);  // 1  (остаток от деления)' },
        { type: 'note', value: 'При делении int на int результат тоже int — дробная часть отбрасывается! 10 / 3 = 3, а не 3.33. Если нужна дробная часть — используй double.' }
      ]
    },
    {
      id: 3,
      title: 'Дробные числа: double',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для чисел с дробной частью (десятичных) используется тип double.' },
        { type: 'code', language: 'java', value: 'double price = 99.99;\ndouble pi = 3.14159;\ndouble temperature = -12.5;\n\nSystem.out.println("Цена: " + price);\nSystem.out.println("Пи: " + pi);' },
        { type: 'tip', value: 'double — это как калькулятор: он умеет работать с десятичными дробями. int — как счёт на пальцах: только целые числа.' },
        { type: 'heading', value: 'Арифметика с double' },
        { type: 'code', language: 'java', value: 'double a = 10.0;\ndouble b = 3.0;\n\nSystem.out.println(a / b);  // 3.3333333333333335\nSystem.out.println(a + 0.5); // 10.5' },
        { type: 'heading', value: 'Смешанные вычисления' },
        { type: 'text', value: 'Если в выражении есть хотя бы один double, результат будет double:' },
        { type: 'code', language: 'java', value: 'int x = 10;\ndouble y = 3.0;\n\nSystem.out.println(x / y); // 3.3333... — double!\nSystem.out.println(x / 3); // 3 — оба int, результат int' },
        { type: 'warning', value: 'Будь осторожен с точностью! double хранит приближённые значения. Например: 0.1 + 0.2 = 0.30000000000000004. Для финансовых расчётов используют BigDecimal (узнаешь позже).' }
      ]
    },
    {
      id: 4,
      title: 'Текст: String и char',
      type: 'theory',
      content: [
        { type: 'text', value: 'Программы работают не только с числами — им нужно работать с текстом! Для этого в Java есть String и char.' },
        { type: 'tip', value: 'Представь что String — это целое предложение на бумаге, а char — одна единственная буква. В коробку String помещается сколько угодно букв, а в коробку char — только одна.' },
        { type: 'heading', value: 'String — текстовые строки' },
        { type: 'text', value: 'String хранит текст. Текст всегда оборачивается в двойные кавычки:' },
        { type: 'code', language: 'java', value: 'String name = "Нурдаулет";\nString greeting = "Привет, мир!";\nString empty = ""; // пустая строка тоже String\n\nSystem.out.println(name);\nSystem.out.println(greeting);' },
        { type: 'note', value: 'String пишется с большой буквы — это не примитивный тип, а класс. Об этом подробнее узнаем в модуле про ООП.' },
        { type: 'heading', value: 'Склейка строк (конкатенация)' },
        { type: 'code', language: 'java', value: 'String first = "Привет";\nString second = "мир";\nString result = first + ", " + second + "!";\n\nSystem.out.println(result); // Привет, мир!\n\n// Можно склеивать строки с числами:\nint age = 25;\nSystem.out.println("Мне " + age + " лет"); // Мне 25 лет' },
        { type: 'heading', value: 'char — один символ' },
        { type: 'code', language: 'java', value: 'char letter = \'A\';\nchar digit = \'5\';\nchar symbol = \'@\';\n\nSystem.out.println(letter); // A' },
        { type: 'warning', value: 'Не путай двойные и одинарные кавычки! "Текст" — это String, а \'A\' — это char. Одинарные кавычки только для одного символа.' }
      ]
    },
    {
      id: 5,
      title: 'Логический тип: boolean',
      type: 'theory',
      content: [
        { type: 'text', value: 'boolean — это самый простой тип данных. Он хранит только два возможных значения: true (правда) или false (ложь).' },
        { type: 'tip', value: 'boolean — как выключатель: вкл (true) или выкл (false). Или как ответ на вопрос "да или нет?".' },
        { type: 'code', language: 'java', value: 'boolean isStudent = true;\nboolean isRaining = false;\nboolean hasLicense = true;\n\nSystem.out.println("Студент: " + isStudent);  // Студент: true\nSystem.out.println("Дождь: " + isRaining);     // Дождь: false' },
        { type: 'heading', value: 'Операции сравнения' },
        { type: 'text', value: 'boolean часто получается в результате сравнений:' },
        { type: 'code', language: 'java', value: 'int age = 25;\n\nboolean isAdult = age >= 18;        // true\nboolean isTeenager = age < 18;      // false\nboolean isExactly25 = age == 25;    // true\nboolean isNot25 = age != 25;        // false\n\nSystem.out.println("Взрослый: " + isAdult);' },
        { type: 'warning', value: 'Для сравнения используй == (два знака равно), а не = (один). Один знак = — это присваивание (положить значение в переменную), два == — это сравнение (проверить равны ли значения).' },
        { type: 'note', value: 'boolean будет очень важен когда мы дойдём до условий (if/else) и циклов. Именно он решает, какой код выполнять.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Переменные',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай программу "Визитная карточка", которая выводит информацию о человеке используя переменные разных типов.',
      requirements: [
        'Создай переменную String для имени',
        'Создай переменную int для возраста',
        'Создай переменную String для города',
        'Создай переменную boolean для статуса студента',
        'Выведи всё в формате из примера'
      ],
      expectedOutput: '=== Визитная карточка ===\nИмя: Нурдаулет\nВозраст: 25\nГород: Астана\nСтудент: true\n========================',
      hint: 'Объяви каждую переменную на отдельной строке, а потом используй System.out.println() для каждой строки вывода. Склеивай текст и переменные через +',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String name = "Нурдаулет";\n        int age = 25;\n        String city = "Астана";\n        boolean isStudent = true;\n\n        System.out.println("=== Визитная карточка ===");\n        System.out.println("Имя: " + name);\n        System.out.println("Возраст: " + age);\n        System.out.println("Город: " + city);\n        System.out.println("Студент: " + isStudent);\n        System.out.println("========================");\n    }\n}',
      explanation: 'Мы создали 4 переменные разных типов и вывели их, склеивая текст с переменными через +. Java автоматически превращает числа и boolean в текст при склейке со String.'
    },
    {
      id: 7,
      title: 'Практика: Калькулятор',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу-калькулятор, которая берёт два числа и показывает результат всех арифметических операций.',
      requirements: [
        'Создай две переменные int с любыми значениями',
        'Выведи результат сложения, вычитания, умножения, деления и остатка от деления',
        'Каждый результат на отдельной строке с подписью'
      ],
      expectedOutput: 'a = 17, b = 5\nСложение: 22\nВычитание: 12\nУмножение: 85\nДеление: 3\nОстаток: 2',
      hint: 'Используй операторы +, -, *, /, %. Не забудь, что деление int на int даёт целый результат.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int a = 17;\n        int b = 5;\n\n        System.out.println("a = " + a + ", b = " + b);\n        System.out.println("Сложение: " + (a + b));\n        System.out.println("Вычитание: " + (a - b));\n        System.out.println("Умножение: " + (a * b));\n        System.out.println("Деление: " + (a / b));\n        System.out.println("Остаток: " + (a % b));\n    }\n}',
      explanation: 'Обрати внимание на скобки вокруг арифметических выражений: (a + b). Без скобок Java сначала склеит "Сложение: " с a (получится строка), а потом приклеит b — результат будет неправильным. Скобки заставляют Java сначала посчитать, а потом склеить.'
    },
    {
      id: 8,
      title: 'Практика: Обмен значений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая меняет значения двух переменных местами.',
      requirements: [
        'Создай две переменные int: a = 10, b = 20',
        'Выведи их значения до обмена',
        'Поменяй значения местами (a должна стать 20, b должна стать 10)',
        'Выведи значения после обмена',
        'Подсказка: понадобится третья переменная'
      ],
      expectedOutput: 'До обмена: a = 10, b = 20\nПосле обмена: a = 20, b = 10',
      hint: 'Создай временную переменную temp. Положи туда значение a, потом в a положи значение b, потом в b положи значение из temp.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int a = 10;\n        int b = 20;\n\n        System.out.println("До обмена: a = " + a + ", b = " + b);\n\n        int temp = a;\n        a = b;\n        b = temp;\n\n        System.out.println("После обмена: a = " + a + ", b = " + b);\n    }\n}',
      explanation: 'Мы использовали временную переменную temp как "третью руку". Без неё при a = b мы потеряли бы старое значение a. Это классическая задача, которую часто спрашивают на собеседованиях!'
    }
  ]
}
```

- [ ] **Step 4: Verify data imports work**

Open browser console, check that lazy import of modules doesn't produce errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Java course data — 2 modules with full lesson content"
```

---

### Task 6: UI Components (ProgressBar, DifficultyBadge, LessonNav)

**Files:**
- Create: `src/components/ui/ProgressBar.vue`, `src/components/ui/DifficultyBadge.vue`, `src/components/ui/LessonNav.vue`

- [ ] **Step 1: Create ProgressBar**

`src/components/ui/ProgressBar.vue`:
```vue
<template>
  <div class="progress-container">
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: percent + '%' }"></div>
    </div>
    <span v-if="showLabel" class="progress-label">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true },
  showLabel: { type: Boolean, default: true }
})

const percent = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.current / props.total) * 100)
})

const label = computed(() => `${props.current}/${props.total}`)
</script>

<style scoped>
.progress-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.progress-track {
  flex: 1;
  height: 6px;
  background: #f0f4f8;
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--progress);
  border-radius: 3px;
  transition: width 0.3s ease;
}
.progress-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
}
</style>
```

- [ ] **Step 2: Create DifficultyBadge**

`src/components/ui/DifficultyBadge.vue`:
```vue
<template>
  <span class="badge" :class="difficulty">{{ text }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  difficulty: { type: String, required: true } // easy | medium | hard
})

const text = computed(() => {
  const map = { easy: 'Лёгкая', medium: 'Средняя', hard: 'Сложная' }
  return map[props.difficulty] || props.difficulty
})
</script>

<style scoped>
.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
}
.easy {
  background: #e8f5e9;
  color: var(--success);
}
.medium {
  background: #fff3e0;
  color: var(--practice);
}
.hard {
  background: #fde8e8;
  color: var(--danger);
}
</style>
```

- [ ] **Step 3: Create LessonNav**

`src/components/ui/LessonNav.vue`:
```vue
<template>
  <div class="lesson-nav">
    <router-link v-if="prevTo" :to="prevTo" class="nav-link prev">
      ← {{ prevLabel }}
    </router-link>
    <span v-else></span>

    <button
      class="nav-btn-next"
      :class="{ completed: isCompleted }"
      @click="$emit('complete')"
    >
      <template v-if="isCompleted">
        ✓ {{ isPractice ? 'Решено' : 'Прочитано' }}
        <span v-if="nextTo"> — Далее →</span>
      </template>
      <template v-else>
        {{ isPractice ? '✅ Решил!' : '✓ Прочитано' }}
        <span v-if="nextTo"> — Далее →</span>
      </template>
    </button>
  </div>
</template>

<script setup>
defineProps({
  prevTo: { type: [String, Object], default: null },
  nextTo: { type: [String, Object], default: null },
  prevLabel: { type: String, default: 'Предыдущий урок' },
  isCompleted: { type: Boolean, default: false },
  isPractice: { type: Boolean, default: false }
})

defineEmits(['complete'])
</script>

<style scoped>
.lesson-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border);
  padding-top: 20px;
  margin-top: 32px;
}
.nav-link {
  font-size: 0.85rem;
  color: var(--accent);
}
.nav-btn-next {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--progress);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}
.nav-btn-next.completed {
  background: #c8e6c9;
  color: #2e7d32;
}
</style>
```

- [ ] **Step 4: Verify components render without errors**

Import one of them in a view temporarily and check browser.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add UI components — ProgressBar, DifficultyBadge, LessonNav"
```

---

### Task 7: Course Components (CourseCard, ModuleCard, NoteBlock, CodeBlock)

**Files:**
- Create: `src/components/course/CourseCard.vue`, `src/components/course/ModuleCard.vue`, `src/components/course/NoteBlock.vue`, `src/components/course/CodeBlock.vue`

- [ ] **Step 1: Create CourseCard**

`src/components/course/CourseCard.vue`:
```vue
<template>
  <router-link :to="to" class="course-card" :class="{ disabled: !available }">
    <div class="card-header">
      <div class="card-icon" :style="{ background: `linear-gradient(135deg, ${course.color}, ${course.color}cc)` }">
        {{ course.icon }}
      </div>
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
.course-card {
  display: block;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}
.course-card:not(.disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.course-card.disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-heading);
}
.card-meta {
  font-size: 0.7rem;
  color: var(--text-secondary);
}
.card-desc {
  font-size: 0.8rem;
  color: var(--text-primary);
  line-height: 1.5;
  margin-bottom: 12px;
}
.progress-text {
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-top: 4px;
  display: block;
}
.coming-soon {
  background: #f0f4f8;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
}
</style>
```

- [ ] **Step 2: Create ModuleCard**

`src/components/course/ModuleCard.vue`:
```vue
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
.module-card {
  display: block;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}
.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.module-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.module-icon {
  font-size: 1.5rem;
}
.module-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-heading);
}
.module-meta {
  font-size: 0.7rem;
  color: var(--text-secondary);
}
</style>
```

- [ ] **Step 3: Create CodeBlock**

`src/components/course/CodeBlock.vue`:
```vue
<template>
  <div class="code-block">
    <div class="code-header">
      <span class="code-lang">{{ language }}</span>
      <button class="copy-btn" @click="copyCode">{{ copied ? '✓ Скопировано' : '📋 Копировать' }}</button>
    </div>
    <pre class="code-body"><code v-html="highlightedCode"></code></pre>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import bash from 'highlight.js/lib/languages/bash'
import 'highlight.js/styles/dracula.css'

hljs.registerLanguage('java', java)
hljs.registerLanguage('bash', bash)

const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, default: 'java' }
})

const copied = ref(false)

const highlightedCode = computed(() => {
  try {
    return hljs.highlight(props.code, { language: props.language }).value
  } catch {
    return props.code
  }
})

async function copyCode() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.code-block {
  background: var(--code-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin: 12px 0;
}
.code-header {
  background: #2d2b55;
  padding: 8px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.code-lang {
  font-size: 0.7rem;
  color: #aaa;
  text-transform: capitalize;
}
.copy-btn {
  font-size: 0.7rem;
  color: var(--accent);
  background: none;
  border: none;
  cursor: pointer;
}
.code-body {
  padding: 14px 18px;
  margin: 0;
  overflow-x: auto;
}
.code-body code {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.7;
  background: none;
  padding: 0;
  color: #f8f8f2;
}
</style>
```

- [ ] **Step 4: Create NoteBlock**

`src/components/course/NoteBlock.vue`:
```vue
<template>
  <div class="note-block" :class="type">
    <div class="note-header">
      <span class="note-icon">{{ icon }}</span>
      <span class="note-label">{{ label }}</span>
    </div>
    <div class="note-content">{{ text }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, required: true }, // note | warning | tip
  text: { type: String, required: true }
})

const icon = computed(() => {
  const map = { note: '📝', warning: '⚠️', tip: '💡' }
  return map[props.type] || '📝'
})

const label = computed(() => {
  const map = { note: 'Запомни', warning: 'Частая ошибка', tip: 'Простая аналогия' }
  return map[props.type] || 'Заметка'
})
</script>

<style scoped>
.note-block {
  border-left: 4px solid;
  padding: 14px 18px;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  margin: 12px 0;
}
.note-block.note {
  background: #fff8e1;
  border-color: var(--warning);
}
.note-block.warning {
  background: #fde8e8;
  border-color: var(--danger);
}
.note-block.tip {
  background: #e8f4fd;
  border-color: var(--info);
}
.note-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.note-icon {
  font-size: 0.8rem;
}
.note-label {
  font-size: 0.75rem;
  font-weight: 600;
}
.note-block.note .note-label { color: #f57f17; }
.note-block.warning .note-label { color: var(--danger); }
.note-block.tip .note-label { color: var(--info); }
.note-content {
  font-size: 0.85rem;
  color: var(--text-primary);
  line-height: 1.6;
}
</style>
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add course components — CourseCard, ModuleCard, CodeBlock, NoteBlock"
```

---

### Task 8: Practice Components (TaskCard, SolutionReveal, HintBlock)

**Files:**
- Create: `src/components/practice/TaskCard.vue`, `src/components/practice/SolutionReveal.vue`, `src/components/practice/HintBlock.vue`

- [ ] **Step 1: Create HintBlock**

`src/components/practice/HintBlock.vue`:
```vue
<template>
  <div class="hint-block" :class="{ open: isOpen }">
    <button class="hint-toggle" @click="isOpen = !isOpen">
      <span>💡 Подсказка</span>
      <span class="arrow">{{ isOpen ? '▲' : '▼' }}</span>
    </button>
    <div v-if="isOpen" class="hint-content">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  hint: { type: String, required: true }
})

const isOpen = ref(false)
</script>

<style scoped>
.hint-block {
  background: #e8f4fd;
  border: 1px solid #bbdefb;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin: 16px 0;
}
.hint-toggle {
  width: 100%;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--info);
}
.arrow {
  font-size: 0.75rem;
}
.hint-content {
  padding: 0 20px 14px;
  font-size: 0.85rem;
  color: var(--text-primary);
  line-height: 1.6;
  border-top: 1px solid #bbdefb;
  padding-top: 12px;
}
</style>
```

- [ ] **Step 2: Create SolutionReveal**

`src/components/practice/SolutionReveal.vue`:
```vue
<template>
  <div class="solution-block" :class="{ open: isOpen }">
    <button class="solution-toggle" @click="isOpen = !isOpen">
      <span>✅ Показать решение</span>
      <span class="arrow">{{ isOpen ? '▲' : '▼' }}</span>
    </button>
    <div v-if="isOpen" class="solution-content">
      <CodeBlock :code="solution" language="java" />
      <div v-if="explanation" class="explanation">
        <strong>Разбор:</strong> {{ explanation }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodeBlock from '../course/CodeBlock.vue'

defineProps({
  solution: { type: String, required: true },
  explanation: { type: String, default: '' }
})

const isOpen = ref(false)
</script>

<style scoped>
.solution-block {
  border: 2px solid var(--progress);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin: 16px 0;
}
.solution-toggle {
  width: 100%;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e8f5e9;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--progress);
}
.solution-content {
  padding: 0 0 16px;
}
.explanation {
  padding: 14px 20px 0;
  font-size: 0.85rem;
  color: var(--text-primary);
  line-height: 1.7;
  background: #f8fdf8;
}
</style>
```

- [ ] **Step 3: Create TaskCard**

`src/components/practice/TaskCard.vue`:
```vue
<template>
  <div class="task-card">
    <div class="task-badges">
      <span class="badge practice">ПРАКТИКА</span>
      <DifficultyBadge :difficulty="lesson.difficulty" />
    </div>
    <h2 class="task-title">{{ lesson.title }}</h2>

    <div class="task-section">
      <p class="task-desc">{{ lesson.description }}</p>
      <div v-if="lesson.expectedOutput" class="expected-output">
        <pre>{{ lesson.expectedOutput }}</pre>
      </div>
    </div>

    <div class="task-section" v-if="lesson.requirements?.length">
      <h3 class="section-title">📋 Требования:</h3>
      <ul class="requirements">
        <li v-for="req in lesson.requirements" :key="req">{{ req }}</li>
      </ul>
    </div>

    <HintBlock v-if="lesson.hint" :hint="lesson.hint" />
    <SolutionReveal :solution="lesson.solution" :explanation="lesson.explanation" />
  </div>
</template>

<script setup>
import DifficultyBadge from '../ui/DifficultyBadge.vue'
import HintBlock from './HintBlock.vue'
import SolutionReveal from './SolutionReveal.vue'

defineProps({
  lesson: { type: Object, required: true }
})
</script>

<style scoped>
.task-card {
  max-width: 720px;
}
.task-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.badge.practice {
  background: var(--practice);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
}
.task-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-heading);
  margin-bottom: 20px;
}
.task-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 16px;
}
.task-desc {
  font-size: 0.9rem;
  line-height: 1.8;
  margin-bottom: 12px;
}
.expected-output {
  background: #f8f9fb;
  border-radius: var(--radius-md);
  padding: 14px 18px;
  border: 1px solid var(--border);
}
.expected-output pre {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--text-primary);
  margin: 0;
  white-space: pre-wrap;
}
.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-heading);
  margin-bottom: 10px;
}
.requirements {
  list-style: none;
  padding: 0;
}
.requirements li {
  font-size: 0.85rem;
  line-height: 2;
  padding-left: 16px;
  position: relative;
}
.requirements li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--accent);
}
</style>
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add practice components — TaskCard, SolutionReveal, HintBlock"
```

---

### Task 9: LessonContent Component

**Files:**
- Create: `src/components/course/LessonContent.vue`

- [ ] **Step 1: Create LessonContent**

This component renders a theory lesson by mapping content blocks to sub-components.

`src/components/course/LessonContent.vue`:
```vue
<template>
  <div class="lesson-content">
    <div class="lesson-meta">Урок {{ lessonIndex }} из {{ totalLessons }}</div>
    <h2 class="lesson-title">{{ lesson.title }}</h2>

    <template v-for="(block, i) in lesson.content" :key="i">
      <p v-if="block.type === 'text'" class="text-block">{{ block.value }}</p>
      <h3 v-else-if="block.type === 'heading'" class="heading-block">{{ block.value }}</h3>
      <CodeBlock v-else-if="block.type === 'code'" :code="block.value" :language="block.language || 'java'" />
      <NoteBlock v-else-if="['note', 'warning', 'tip'].includes(block.type)" :type="block.type" :text="block.value" />
      <img v-else-if="block.type === 'image'" :src="block.src" :alt="block.alt" class="image-block" />
      <ul v-else-if="block.type === 'list'" class="list-block">
        <li v-for="item in block.items" :key="item">{{ item }}</li>
      </ul>
    </template>
  </div>
</template>

<script setup>
import CodeBlock from './CodeBlock.vue'
import NoteBlock from './NoteBlock.vue'

defineProps({
  lesson: { type: Object, required: true },
  lessonIndex: { type: Number, required: true },
  totalLessons: { type: Number, required: true }
})
</script>

<style scoped>
.lesson-content {
  max-width: 720px;
}
.lesson-meta {
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 4px;
}
.lesson-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-heading);
  margin-bottom: 20px;
}
.text-block {
  font-size: 0.9rem;
  line-height: 1.8;
  margin-bottom: 12px;
}
.heading-block {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-heading);
  margin: 24px 0 12px;
}
.image-block {
  max-width: 100%;
  border-radius: var(--radius-md);
  margin: 12px 0;
}
.list-block {
  margin: 12px 0;
  padding-left: 20px;
}
.list-block li {
  font-size: 0.9rem;
  line-height: 2;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add LessonContent component — renders theory content blocks"
```

---

### Task 10: Sidebar Component

**Files:**
- Create: `src/components/layout/AppSidebar.vue`

- [ ] **Step 1: Create AppSidebar**

`src/components/layout/AppSidebar.vue`:
```vue
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
.sidebar {
  width: 260px;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  padding: 16px 0;
  flex-shrink: 0;
  overflow-y: auto;
  height: calc(100vh - 57px);
  position: sticky;
  top: 57px;
}
.sidebar-header {
  padding: 0 16px 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-heading);
  display: flex;
  align-items: center;
  gap: 6px;
}
.sidebar-progress {
  padding: 0 16px 12px;
}
.nav-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 16px;
  font-size: 0.78rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: background 0.1s;
}
.nav-item:hover {
  background: #f0f4f8;
}
.nav-item.active {
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 600;
  border-left: 3px solid var(--accent);
}
.nav-item.completed {
  color: var(--progress);
}
.nav-item.practice:not(.completed):not(.active) {
  color: var(--practice);
}
.nav-icon {
  flex-shrink: 0;
  width: 18px;
  text-align: center;
}
.nav-text {
  line-height: 1.4;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add AppSidebar with lesson navigation and progress indicators"
```

---

### Task 11: Wire Up Views — HomePage + CoursePage

**Files:**
- Modify: `src/views/HomePage.vue`
- Modify: `src/views/CoursePage.vue`

- [ ] **Step 1: Complete HomePage**

Replace `src/views/HomePage.vue` contents:
```vue
<template>
  <div class="home-page">
    <div class="hero">
      <h1>Выбери язык программирования</h1>
      <p class="hero-subtitle">От основ до продвинутого уровня. Теория + практика.</p>
    </div>
    <div class="courses-grid">
      <CourseCard
        v-for="course in courseStore.courses"
        :key="course.id"
        :course="course"
        :available="true"
        :progressPercent="getProgress(course)"
      />
      <!-- Placeholder courses (coming soon) -->
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
.home-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}
.hero {
  text-align: center;
  padding: 32px 0 20px;
}
.hero h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-heading);
}
.hero-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 6px;
}
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding-top: 8px;
}
</style>
```

- [ ] **Step 2: Complete CoursePage**

Replace `src/views/CoursePage.vue` contents:
```vue
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
import { ref, onMounted, computed } from 'vue'
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

  // Load each module to get lesson counts
  for (const mod of loaded.modules) {
    try {
      const moduleData = await courseStore.loadModule(lang, mod.id)
      if (moduleData) {
        moduleLessonCounts.value[mod.id] = moduleData.lessons.length
        moduleCompletedCounts.value[mod.id] = progressStore.moduleProgress(lang, mod.id, moduleData.lessons.length)
      }
    } catch {
      // Module not found, skip
    }
  }
})
</script>

<style scoped>
.course-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}
.course-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.course-icon {
  font-size: 2.5rem;
}
.course-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-heading);
}
.course-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 4px;
}
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.loading {
  text-align: center;
  padding: 60px;
  color: var(--text-secondary);
}
</style>
```

- [ ] **Step 3: Verify HomePage and CoursePage work**

- Open `http://localhost:5173/` — should see Java card + 2 grayed-out placeholders
- Click Java card — should navigate to `/course/java` with module cards

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire up HomePage and CoursePage with real data and progress"
```

---

### Task 12: Wire Up LessonPage

**Files:**
- Modify: `src/views/LessonPage.vue`

- [ ] **Step 1: Complete LessonPage**

Replace `src/views/LessonPage.vue` contents:
```vue
<template>
  <div class="lesson-layout" v-if="moduleData && lesson">
    <!-- Mobile burger -->
    <button class="burger-btn" @click="sidebarOpen = !sidebarOpen" aria-label="Меню">
      ☰
    </button>
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <AppSidebar
      :moduleData="moduleData"
      :courseId="lang"
      :currentLessonId="lessonId"
      :isOpen="sidebarOpen"
    />

    <div class="lesson-main">
      <!-- Theory lesson -->
      <LessonContent
        v-if="lesson.type === 'theory'"
        :lesson="lesson"
        :lessonIndex="Number(lessonId)"
        :totalLessons="moduleData.lessons.length"
      />

      <!-- Practice lesson -->
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
.lesson-layout {
  display: flex;
  min-height: calc(100vh - 57px);
}
.lesson-main {
  flex: 1;
  padding: 28px 36px;
  overflow-y: auto;
}
.loading {
  text-align: center;
  padding: 60px;
  color: var(--text-secondary);
}
.burger-btn {
  display: none;
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 101;
  background: var(--accent);
  color: #fff;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .lesson-main {
    padding: 20px 16px;
  }
}
</style>
```

- [ ] **Step 2: Import responsive.css**

Add to `src/assets/styles/main.css` at the end:
```css
@import './responsive.css';
```

- [ ] **Step 3: Full end-to-end test**

Navigate through the entire app:
1. Home → click Java → see modules
2. Click "Введение в Java" → see lesson 1 with sidebar
3. Read content, click "Прочитано — Далее" → advances to lesson 2
4. Navigate to practice lessons → see TaskCard with hints and solutions
5. Click "Решил!" → progress updates in sidebar
6. Go back to course page → see progress on module cards
7. Test 404: navigate to `/course/java/module/99/lesson/1`
8. Test mobile: resize browser to < 768px, check burger menu

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire up LessonPage with sidebar, theory/practice rendering, and navigation"
```

---

### Task 13: Polish and Final Fixes

**Files:**
- Modify: various — fix any visual/functional issues found in Task 12 testing

- [ ] **Step 1: Add .gitignore**

```
node_modules/
dist/
.superpowers/
.DS_Store
```

- [ ] **Step 2: Update Breadcrumbs with real module/lesson titles**

Modify `src/components/ui/Breadcrumbs.vue` to accept and display actual titles from route meta or props passed via App.vue. For simplicity in MVP, the current numeric display is acceptable — enhance if time permits.

- [ ] **Step 3: Final visual check**

Review all pages for:
- Consistent spacing and typography
- Code blocks render with Dracula theme
- Progress persists after page refresh (localStorage)
- All note types (tip, warning, note) render correctly
- No console errors

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add .gitignore and polish visual details"
```

---

## Summary

| Task | Description | Estimated Steps |
|------|-------------|-----------------|
| 1 | Project scaffolding | 9 |
| 2 | Router + views shell | 7 |
| 3 | Pinia stores | 4 |
| 4 | Layout (Header + Footer) | 5 |
| 5 | Java course data (2 modules) | 5 |
| 6 | UI components | 5 |
| 7 | Course components | 5 |
| 8 | Practice components | 4 |
| 9 | LessonContent | 2 |
| 10 | Sidebar | 2 |
| 11 | HomePage + CoursePage wiring | 4 |
| 12 | LessonPage wiring | 4 |
| 13 | Polish + gitignore | 4 |
| **Total** | | **60 steps** |

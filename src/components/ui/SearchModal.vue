<template>
  <Teleport to="body">
    <div class="search-overlay" v-if="isOpen" @click.self="close">
      <div class="search-modal">
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            class="search-input"
            placeholder="Поиск по курсам, модулям и урокам..."
            @keydown.escape="close"
            @keydown.down.prevent="moveDown"
            @keydown.up.prevent="moveUp"
            @keydown.enter.prevent="selectCurrent"
          />
          <kbd class="search-kbd" @click="close">Esc</kbd>
        </div>

        <div class="search-results" v-if="query.length >= 2">
          <div class="results-header" v-if="results.length > 0">
            {{ results.length }} {{ resultsLabel }}
          </div>
          <div class="results-header" v-else>
            Ничего не найдено по "{{ query }}"
          </div>

          <div class="results-list" ref="listRef">
            <router-link
              v-for="(result, i) in results.slice(0, 50)"
              :key="result.id"
              :to="result.link"
              class="result-item"
              :class="{ active: i === activeIndex }"
              @click="close"
              @mouseenter="activeIndex = i"
            >
              <div class="result-type" :class="result.type">
                {{ result.typeIcon }}
              </div>
              <div class="result-content">
                <div class="result-title" v-html="highlight(result.title)"></div>
                <div class="result-path">{{ result.path }}</div>
              </div>
              <div class="result-badge" :class="result.lessonType" v-if="result.lessonType">
                {{ result.lessonType === 'theory' ? 'Теория' : 'Практика' }}
              </div>
            </router-link>
          </div>

          <div class="results-footer" v-if="results.length > 50">
            Показано 50 из {{ results.length }} результатов. Уточните запрос.
          </div>
        </div>

        <div class="search-hints" v-else>
          <p class="hint-text">Начните вводить для поиска</p>
          <div class="hint-examples">
            <span class="hint-tag" @click="query = 'массивы'">массивы</span>
            <span class="hint-tag" @click="query = 'React hooks'">React hooks</span>
            <span class="hint-tag" @click="query = 'Docker'">Docker</span>
            <span class="hint-tag" @click="query = 'SQL JOIN'">SQL JOIN</span>
            <span class="hint-tag" @click="query = 'async'">async</span>
            <span class="hint-tag" @click="query = 'ООП'">ООП</span>
            <span class="hint-tag" @click="query = 'REST API'">REST API</span>
            <span class="hint-tag" @click="query = 'собеседование'">собеседование</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useCourseStore } from '../../stores/course.js'

const props = defineProps({
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const courseStore = useCourseStore()
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref(null)
const listRef = ref(null)

// Build search index from all courses
const searchIndex = computed(() => {
  const index = []
  for (const course of courseStore.courses) {
    // Course level
    index.push({
      id: `course-${course.id}`,
      title: course.title,
      path: course.description,
      link: `/course/${course.id}`,
      type: 'course',
      typeIcon: course.icon,
      searchText: `${course.title} ${course.description}`.toLowerCase()
    })

    // Module level
    for (const mod of course.modules) {
      index.push({
        id: `mod-${course.id}-${mod.id}`,
        title: mod.title,
        path: `${course.title} → Модуль ${mod.id}`,
        link: `/course/${course.id}/module/${mod.id}`,
        type: 'module',
        typeIcon: mod.icon || '📖',
        searchText: `${mod.title} ${course.title}`.toLowerCase()
      })
    }
  }
  return index
})

const results = computed(() => {
  if (query.value.length < 2) return []
  const q = query.value.toLowerCase().trim()
  const words = q.split(/\s+/)

  return searchIndex.value
    .filter(item => words.every(w => item.searchText.includes(w)))
    .sort((a, b) => {
      // Exact match first
      const aExact = a.title.toLowerCase().includes(q) ? 1 : 0
      const bExact = b.title.toLowerCase().includes(q) ? 1 : 0
      if (aExact !== bExact) return bExact - aExact
      // Courses before modules
      if (a.type !== b.type) return a.type === 'course' ? -1 : 1
      return 0
    })
})

const resultsLabel = computed(() => {
  const n = results.value.length
  if (n === 1) return 'результат'
  if (n >= 2 && n <= 4) return 'результата'
  return 'результатов'
})

function highlight(text) {
  if (!query.value || query.value.length < 2) return text
  const words = query.value.trim().split(/\s+/)
  let result = text
  for (const word of words) {
    const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    result = result.replace(regex, '<mark>$1</mark>')
  }
  return result
}

function close() {
  query.value = ''
  activeIndex.value = 0
  emit('close')
}

function moveDown() {
  const max = Math.min(results.value.length, 50) - 1
  activeIndex.value = Math.min(activeIndex.value + 1, max)
  scrollToActive()
}

function moveUp() {
  activeIndex.value = Math.max(activeIndex.value - 1, 0)
  scrollToActive()
}

function scrollToActive() {
  nextTick(() => {
    const list = listRef.value
    if (!list) return
    const active = list.children[activeIndex.value]
    if (active) active.scrollIntoView({ block: 'nearest' })
  })
}

function selectCurrent() {
  const item = results.value[activeIndex.value]
  if (item) {
    window.location.href = item.link
    close()
  }
}

watch(() => props.isOpen, (val) => {
  if (val) {
    nextTick(() => inputRef.value?.focus())
  }
})

watch(query, () => {
  activeIndex.value = 0
})

// Global keyboard shortcut
function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    if (props.isOpen) {
      close()
    } else {
      emit('close') // toggle
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: flex;
  justify-content: center;
  padding-top: 10vh;
}
.search-modal {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 640px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}
.search-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  font-family: var(--font-sans);
  color: var(--text-heading);
  background: transparent;
}
.search-input::placeholder {
  color: var(--text-secondary);
}
.search-kbd {
  font-size: 0.7rem;
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-secondary);
  background: var(--bg-page);
  cursor: pointer;
  flex-shrink: 0;
}

.search-results {
  flex: 1;
  overflow-y: auto;
}
.results-header {
  padding: 8px 20px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
}
.results-list {
  padding: 4px;
}
.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.1s;
}
.result-item:hover,
.result-item.active {
  background: var(--bg-page);
}
.result-type {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  background: var(--bg-page);
}
.result-content {
  flex: 1;
  min-width: 0;
}
.result-title {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.result-title :deep(mark) {
  background: #fef08a;
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
}
.result-path {
  font-size: 0.72rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.result-badge {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 10px;
  flex-shrink: 0;
}
.result-badge.theory {
  background: #e3f2fd;
  color: #1976d2;
}
.result-badge.practice {
  background: #fff3e0;
  color: #f57c00;
}
.results-footer {
  padding: 8px 20px;
  font-size: 0.72rem;
  color: var(--text-secondary);
  text-align: center;
  border-top: 1px solid var(--border);
}

.search-hints {
  padding: 24px 20px;
  text-align: center;
}
.hint-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}
.hint-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.hint-tag {
  font-size: 0.78rem;
  padding: 6px 14px;
  border-radius: 20px;
  background: var(--bg-page);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s;
}
.hint-tag:hover {
  background: var(--accent-light);
  color: var(--accent);
}

@media (max-width: 768px) {
  .search-overlay { padding-top: 0; }
  .search-modal { max-height: 100vh; border-radius: 0; max-width: 100%; }
}
</style>

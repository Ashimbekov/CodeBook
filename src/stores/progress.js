import { defineStore } from 'pinia'
import { reactive } from 'vue'

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

  return { completed, markComplete, isCompleted, moduleProgress, isModuleComplete, courseProgress, resetAll }
})

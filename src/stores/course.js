import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

const courseImports = {
  java: () => import('../data/java/index.js'),
  algorithms: () => import('../data/algorithms/index.js')
}

const moduleImports = {
  java: (moduleId) => import(`../data/java/modules/module-${moduleId}.js`),
  algorithms: (moduleId) => import(`../data/algorithms/modules/module-${moduleId}.js`)
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

  return { courses, currentCourse, currentModule, loading, loadCourseList, loadCourse, loadModule }
})

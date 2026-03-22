import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

const courseImports = {
  java: () => import('../data/java/index.js'),
  algorithms: () => import('../data/algorithms/index.js'),
  golang: () => import('../data/golang/index.js'),
  claude: () => import('../data/claude/index.js'),
  kotlin: () => import('../data/kotlin/index.js'),
  springboot: () => import('../data/springboot/index.js'),
  fastapi: () => import('../data/fastapi/index.js'),
  django: () => import('../data/django/index.js'),
  docker: () => import('../data/docker/index.js'),
  cicd: () => import('../data/cicd/index.js'),
  webdev: () => import('../data/webdev/index.js'),
  sql: () => import('../data/sql/index.js'),
  systemdesign: () => import('../data/systemdesign/index.js'),
  kubernetes: () => import('../data/kubernetes/index.js'),
  typescript: () => import('../data/typescript/index.js'),
  react: () => import('../data/react/index.js'),
  python: () => import('../data/python/index.js'),
  javascript: () => import('../data/javascript/index.js'),
  interview: () => import('../data/interview/index.js'),
  fullstack: () => import('../data/fullstack/index.js'),
  cheatsheets: () => import('../data/cheatsheets/index.js')
}

const moduleImports = {
  java: (moduleId) => import(`../data/java/modules/module-${moduleId}.js`),
  algorithms: (moduleId) => import(`../data/algorithms/modules/module-${moduleId}.js`),
  golang: (moduleId) => import(`../data/golang/modules/module-${moduleId}.js`),
  claude: (moduleId) => import(`../data/claude/modules/module-${moduleId}.js`),
  kotlin: (moduleId) => import(`../data/kotlin/modules/module-${moduleId}.js`),
  springboot: (moduleId) => import(`../data/springboot/modules/module-${moduleId}.js`),
  fastapi: (moduleId) => import(`../data/fastapi/modules/module-${moduleId}.js`),
  django: (moduleId) => import(`../data/django/modules/module-${moduleId}.js`),
  docker: (moduleId) => import(`../data/docker/modules/module-${moduleId}.js`),
  cicd: (moduleId) => import(`../data/cicd/modules/module-${moduleId}.js`),
  webdev: (moduleId) => import(`../data/webdev/modules/module-${moduleId}.js`),
  sql: (moduleId) => import(`../data/sql/modules/module-${moduleId}.js`),
  systemdesign: (moduleId) => import(`../data/systemdesign/modules/module-${moduleId}.js`),
  kubernetes: (moduleId) => import(`../data/kubernetes/modules/module-${moduleId}.js`),
  typescript: (moduleId) => import(`../data/typescript/modules/module-${moduleId}.js`),
  react: (moduleId) => import(`../data/react/modules/module-${moduleId}.js`),
  python: (moduleId) => import(`../data/python/modules/module-${moduleId}.js`),
  javascript: (moduleId) => import(`../data/javascript/modules/module-${moduleId}.js`),
  interview: (moduleId) => import(`../data/interview/modules/module-${moduleId}.js`),
  fullstack: (moduleId) => import(`../data/fullstack/modules/module-${moduleId}.js`),
  cheatsheets: (moduleId) => import(`../data/cheatsheets/modules/module-${moduleId}.js`)
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

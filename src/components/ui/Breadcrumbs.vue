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

<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">📚</span>
        <span class="logo-text">CodeBook</span>
        <span class="logo-tagline">Изучай программирование</span>
      </router-link>
      <Breadcrumbs v-if="showBreadcrumbs" />
      <div class="header-spacer"></div>
      <nav class="header-nav">
        <router-link to="/" class="nav-link" :class="{ active: route.name === 'home' }">Курсы</router-link>
        <router-link to="/roadmap" class="nav-link" :class="{ active: route.name === 'roadmap' }">🗺️ Roadmap</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumbs from '../ui/Breadcrumbs.vue'

const route = useRoute()
const showBreadcrumbs = computed(() => route.name !== 'home' && route.name !== 'roadmap')
</script>

<style scoped>
.app-header { background: var(--bg-card); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; }
.header-inner { max-width: 1200px; margin: 0 auto; padding: 12px 24px; display: flex; align-items: center; gap: 16px; }
.logo { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
.logo-icon { font-size: 1.25rem; }
.logo-text { font-size: 1.1rem; font-weight: 700; color: var(--text-heading); }
.logo-tagline { font-size: 0.8rem; color: var(--text-secondary); border-left: 1px solid var(--border); padding-left: 12px; }
.header-spacer { flex: 1; }
.header-nav { display: flex; gap: 4px; flex-shrink: 0; }
.nav-link { font-size: 0.8rem; color: var(--text-secondary); text-decoration: none; padding: 6px 12px; border-radius: var(--radius-md); transition: all 0.15s; }
.nav-link:hover { background: var(--bg-page); color: var(--text-heading); }
.nav-link.active { background: var(--accent-light); color: var(--accent); font-weight: 600; }
@media (max-width: 768px) { .logo-tagline { display: none; } }
</style>

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
      <button class="search-trigger" @click="searchOpen = true">
        <span class="search-trigger-icon">🔍</span>
        <span class="search-trigger-text">Поиск...</span>
        <kbd class="search-trigger-kbd">Ctrl+K</kbd>
      </button>
      <nav class="header-nav">
        <router-link to="/" class="nav-link" :class="{ active: route.name === 'home' }">Курсы</router-link>
        <router-link to="/roadmap" class="nav-link" :class="{ active: route.name === 'roadmap' }">🗺️ Roadmap</router-link>
      </nav>
    </div>
  </header>

  <SearchModal :isOpen="searchOpen" @close="searchOpen = !searchOpen" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumbs from '../ui/Breadcrumbs.vue'
import SearchModal from '../ui/SearchModal.vue'

const route = useRoute()
const showBreadcrumbs = computed(() => route.name !== 'home' && route.name !== 'roadmap')
const searchOpen = ref(false)

function handleGlobalKey(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    searchOpen.value = !searchOpen.value
  }
}

onMounted(() => document.addEventListener('keydown', handleGlobalKey))
onUnmounted(() => document.removeEventListener('keydown', handleGlobalKey))
</script>

<style scoped>
.app-header { background: var(--bg-card); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; }
.header-inner { max-width: 1200px; margin: 0 auto; padding: 12px 24px; display: flex; align-items: center; gap: 12px; }
.logo { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
.logo-icon { font-size: 1.25rem; }
.logo-text { font-size: 1.1rem; font-weight: 700; color: var(--text-heading); }
.logo-tagline { font-size: 0.8rem; color: var(--text-secondary); border-left: 1px solid var(--border); padding-left: 12px; }
.header-spacer { flex: 1; }

.search-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-page);
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}
.search-trigger:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-light);
}
.search-trigger-icon { font-size: 0.85rem; }
.search-trigger-text { font-size: 0.8rem; color: var(--text-secondary); }
.search-trigger-kbd {
  font-size: 0.65rem;
  padding: 1px 6px;
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text-secondary);
  background: var(--bg-card);
}

.header-nav { display: flex; gap: 4px; flex-shrink: 0; }
.nav-link { font-size: 0.8rem; color: var(--text-secondary); text-decoration: none; padding: 6px 12px; border-radius: var(--radius-md); transition: all 0.15s; }
.nav-link:hover { background: var(--bg-page); color: var(--text-heading); }
.nav-link.active { background: var(--accent-light); color: var(--accent); font-weight: 600; }

@media (max-width: 768px) {
  .logo-tagline { display: none; }
  .search-trigger-text { display: none; }
  .search-trigger-kbd { display: none; }
}
</style>

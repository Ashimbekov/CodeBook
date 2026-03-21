<template>
  <div class="lesson-nav">
    <router-link v-if="prevTo" :to="prevTo" class="nav-link prev">← {{ prevLabel }}</router-link>
    <span v-else></span>
    <button class="nav-btn-next" :class="{ completed: isCompleted }" @click="$emit('complete')">
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
.lesson-nav { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 20px; margin-top: 32px; }
.nav-link { font-size: 0.85rem; color: var(--accent); }
.nav-btn-next { display: flex; align-items: center; gap: 4px; background: var(--progress); color: #fff; border: none; padding: 10px 20px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600; cursor: pointer; }
.nav-btn-next.completed { background: #c8e6c9; color: #2e7d32; }
</style>

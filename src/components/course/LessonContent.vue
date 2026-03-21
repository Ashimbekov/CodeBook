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
.lesson-content { max-width: 720px; }
.lesson-meta { font-size: 0.75rem; color: var(--accent); font-weight: 600; margin-bottom: 4px; }
.lesson-title { font-size: 1.4rem; font-weight: 700; color: var(--text-heading); margin-bottom: 20px; }
.text-block { font-size: 0.9rem; line-height: 1.8; margin-bottom: 12px; }
.heading-block { font-size: 1.1rem; font-weight: 600; color: var(--text-heading); margin: 24px 0 12px; }
.image-block { max-width: 100%; border-radius: var(--radius-md); margin: 12px 0; }
.list-block { margin: 12px 0; padding-left: 20px; }
.list-block li { font-size: 0.9rem; line-height: 2; }
</style>

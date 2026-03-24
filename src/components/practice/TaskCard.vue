<template>
  <div class="task-card">
    <div class="task-badges">
      <span class="badge practice">ПРАКТИКА</span>
      <DifficultyBadge v-if="lesson.difficulty" :difficulty="lesson.difficulty" />
    </div>
    <h2 class="task-title">{{ lesson.title }}</h2>

    <!-- Description -->
    <div class="task-section" v-if="lesson.description">
      <p class="task-desc">{{ lesson.description }}</p>
      <div v-if="lesson.expectedOutput" class="expected-output"><pre>{{ lesson.expectedOutput }}</pre></div>
    </div>

    <!-- Requirements -->
    <div class="task-section" v-if="lesson.requirements?.length">
      <h3 class="section-title">📋 Требования:</h3>
      <ul class="requirements"><li v-for="req in lesson.requirements" :key="req">{{ req }}</li></ul>
    </div>

    <!-- Content blocks (for English courses and other content-rich practice) -->
    <template v-if="lesson.content?.length">
      <template v-for="(block, i) in lesson.content" :key="i">
        <p v-if="block.type === 'text'" class="content-text">{{ block.value || block.text }}</p>
        <h3 v-else-if="block.type === 'heading'" class="content-heading">{{ block.value || block.text }}</h3>
        <CodeBlock v-else-if="block.type === 'code'" :code="block.value || block.code" :language="block.language || 'text'" />
        <NoteBlock v-else-if="['note', 'warning', 'tip'].includes(block.type)" :type="block.type" :text="block.value || block.text" />
        <ul v-else-if="block.type === 'list'" class="content-list">
          <li v-for="item in block.items" :key="item">{{ item }}</li>
        </ul>

        <!-- Exercise blocks (fill_blank, translate, match, multiple_choice) -->
        <div v-else-if="block.type === 'exercise'" class="exercise-block">
          <div class="exercise-header">
            <span class="exercise-icon">✍️</span>
            <span class="exercise-type">{{ exerciseLabel(block.subtype) }}</span>
          </div>

          <!-- Fill in the blank -->
          <div v-if="block.subtype === 'fill_blank'" class="exercise-items">
            <div v-for="item in block.items" :key="item.id" class="exercise-item">
              <span class="item-num">{{ item.id }}.</span>
              <span class="item-question">{{ item.question }}</span>
              <span v-if="showAnswers" class="item-answer">→ {{ item.answer }}</span>
            </div>
          </div>

          <!-- Translate -->
          <div v-else-if="block.subtype === 'translate'" class="exercise-items">
            <div v-for="item in block.items" :key="item.id" class="exercise-item">
              <span class="item-num">{{ item.id }}.</span>
              <span class="item-question">{{ item.ru || item.question }}</span>
              <span v-if="showAnswers" class="item-answer">→ {{ item.en || item.answer }}</span>
            </div>
          </div>

          <!-- Match -->
          <div v-else-if="block.subtype === 'match'" class="exercise-items match">
            <div v-for="item in block.items" :key="item.id || item.term" class="exercise-item">
              <span class="item-term">{{ item.term || item.en }}</span>
              <span class="item-sep">—</span>
              <span v-if="showAnswers" class="item-answer">{{ item.definition || item.ru }}</span>
              <span v-else class="item-placeholder">???</span>
            </div>
          </div>

          <!-- Multiple choice -->
          <div v-else-if="block.subtype === 'multiple_choice'" class="exercise-items">
            <div v-for="item in block.items" :key="item.id" class="exercise-item mc">
              <span class="item-num">{{ item.id }}.</span>
              <span class="item-question">{{ item.question }}</span>
              <div class="mc-options" v-if="item.options">
                <span v-for="(opt, oi) in item.options" :key="oi" class="mc-option" :class="{ correct: showAnswers && opt === item.answer }">
                  {{ String.fromCharCode(65 + oi) }}) {{ opt }}
                </span>
              </div>
              <span v-if="showAnswers && item.answer" class="item-answer">→ {{ item.answer }}</span>
            </div>
          </div>

          <!-- Read and answer / other -->
          <div v-else class="exercise-items">
            <div v-for="item in block.items" :key="item.id || item.question" class="exercise-item">
              <span class="item-num" v-if="item.id">{{ item.id }}.</span>
              <span class="item-question">{{ item.question || item.sentence || item.text || item.term }}</span>
              <span v-if="showAnswers" class="item-answer">→ {{ item.answer || item.en || item.definition }}</span>
            </div>
          </div>

          <button class="show-answers-btn" @click="showAnswers = !showAnswers">
            {{ showAnswers ? '🙈 Скрыть ответы' : '👁️ Показать ответы' }}
          </button>
        </div>
      </template>
    </template>

    <HintBlock v-if="lesson.hint" :hint="lesson.hint" />
    <SolutionReveal v-if="lesson.solution" :solution="typeof lesson.solution === 'object' ? lesson.solution.code || '' : lesson.solution" :explanation="lesson.explanation || ''" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DifficultyBadge from '../ui/DifficultyBadge.vue'
import HintBlock from './HintBlock.vue'
import SolutionReveal from './SolutionReveal.vue'
import CodeBlock from '../course/CodeBlock.vue'
import NoteBlock from '../course/NoteBlock.vue'

defineProps({ lesson: { type: Object, required: true } })

const showAnswers = ref(false)

function exerciseLabel(subtype) {
  const map = {
    fill_blank: 'Заполните пропуски',
    translate: 'Переведите',
    match: 'Соедините пары',
    multiple_choice: 'Выберите правильный ответ',
    read_and_answer: 'Прочитайте и ответьте',
    error_correction: 'Найдите ошибку',
    reorder: 'Расставьте в правильном порядке'
  }
  return map[subtype] || 'Упражнение'
}
</script>

<style scoped>
.task-card { max-width: 720px; }
.task-badges { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.badge.practice { background: var(--practice); color: #fff; font-size: 0.7rem; font-weight: 600; padding: 3px 10px; border-radius: 12px; }
.task-title { font-size: 1.4rem; font-weight: 700; color: var(--text-heading); margin-bottom: 20px; }
.task-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 16px; }
.task-desc { font-size: 0.9rem; line-height: 1.8; margin-bottom: 12px; }
.expected-output { background: #f8f9fb; border-radius: var(--radius-md); padding: 14px 18px; border: 1px solid var(--border); }
.expected-output pre { font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.7; color: var(--text-primary); margin: 0; white-space: pre-wrap; }
.section-title { font-size: 0.9rem; font-weight: 600; color: var(--text-heading); margin-bottom: 10px; }
.requirements { list-style: none; padding: 0; }
.requirements li { font-size: 0.85rem; line-height: 2; padding-left: 16px; position: relative; }
.requirements li::before { content: '•'; position: absolute; left: 0; color: var(--accent); }

/* Content blocks in practice */
.content-text { font-size: 0.9rem; line-height: 1.8; margin-bottom: 12px; }
.content-heading { font-size: 1.1rem; font-weight: 600; color: var(--text-heading); margin: 20px 0 12px; }
.content-list { margin: 12px 0; padding-left: 20px; }
.content-list li { font-size: 0.9rem; line-height: 2; }

/* Exercise blocks */
.exercise-block {
  background: var(--bg-card);
  border: 2px solid var(--accent);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin: 16px 0;
}
.exercise-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.exercise-icon { font-size: 1.2rem; }
.exercise-type { font-size: 0.9rem; font-weight: 600; color: var(--accent); }

.exercise-items { display: flex; flex-direction: column; gap: 10px; }
.exercise-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-page);
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  line-height: 1.6;
}
.exercise-item.mc { flex-direction: column; }
.item-num { font-weight: 600; color: var(--accent); min-width: 24px; flex-shrink: 0; }
.item-question { flex: 1; color: var(--text-primary); }
.item-answer { color: var(--progress); font-weight: 500; white-space: nowrap; }
.item-term { font-weight: 500; color: var(--text-heading); min-width: 120px; }
.item-sep { color: var(--text-secondary); }
.item-placeholder { color: var(--text-secondary); font-style: italic; }

.mc-options { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.mc-option {
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  border: 1px solid var(--border);
  font-size: 0.82rem;
}
.mc-option.correct { background: #e8f5e9; border-color: var(--progress); color: var(--progress); font-weight: 600; }

.show-answers-btn {
  margin-top: 16px;
  padding: 10px 20px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.show-answers-btn:hover { opacity: 0.9; }

.match .exercise-item { display: grid; grid-template-columns: 1fr auto 1fr; }
</style>

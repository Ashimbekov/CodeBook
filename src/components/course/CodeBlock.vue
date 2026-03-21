<template>
  <div class="code-block">
    <div class="code-header">
      <span class="code-lang">{{ language }}</span>
      <button class="copy-btn" @click="copyCode">{{ copied ? '✓ Скопировано' : '📋 Копировать' }}</button>
    </div>
    <pre class="code-body"><code v-html="highlightedCode"></code></pre>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import bash from 'highlight.js/lib/languages/bash'
import 'highlight.js/styles/atom-one-dark.css'

hljs.registerLanguage('java', java)
hljs.registerLanguage('bash', bash)

const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, default: 'java' }
})

const copied = ref(false)

const highlightedCode = computed(() => {
  try {
    return hljs.highlight(props.code, { language: props.language }).value
  } catch {
    return props.code
  }
})

async function copyCode() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.code-block { background: var(--code-bg); border-radius: var(--radius-md); overflow: hidden; margin: 12px 0; }
.code-header { background: #2d2b55; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; }
.code-lang { font-size: 0.7rem; color: #aaa; text-transform: capitalize; }
.copy-btn { font-size: 0.7rem; color: var(--accent); background: none; border: none; cursor: pointer; }
.code-body { padding: 14px 18px; margin: 0; overflow-x: auto; }
.code-body code { font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.7; background: none; padding: 0; color: #f8f8f2; }
</style>

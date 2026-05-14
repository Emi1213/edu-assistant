<script setup lang="ts">
import { computed } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import { useLearningObjectContentViewer } from '@/features/learning-objects/composables/content/use-learning-object-content-viewer'
import { marked } from 'marked'

interface Props {
  content: string
}

const props = defineProps<Props>()

// Convertimos el Markdown de la IA a HTML para que Tiptap lo entienda
// No necesitamos highlight.js acá porque Tiptap usa lowlight (la lógica de los LOs)
const htmlContent = computed(() => {
  return marked.parse(props.content, {
    breaks: true,
    gfm: true
  })
})

const { editor } = useLearningObjectContentViewer(htmlContent)
</script>

<template>
  <div class="chat-message-content">
    <EditorContent v-if="editor" :editor="editor" />
  </div>
</template>

<style scoped>
.chat-message-content :deep(.ProseMirror) {
  outline: none;
}

/* Ajustamos el tamaño de la tipografía para el chat */
.chat-message-content :deep(.prose) {
  font-size: 0.9375rem;
  line-height: 1.6;
}

/* Estilos de encabezados consistentes */
.chat-message-content :deep(h1),
.chat-message-content :deep(h2),
.chat-message-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
  line-height: 1.3;
}

.chat-message-content :deep(h1) { font-size: 1.5rem; }
.chat-message-content :deep(h2) { font-size: 1.25rem; }
.chat-message-content :deep(h3) { font-size: 1.125rem; }

.chat-message-content :deep(p) {
  margin-bottom: 0.75rem;
}

/* Reutilizamos los estilos de bloques de código de los LOs */
.chat-message-content :deep(.code-block-wrapper) {
  position: relative;
  background-color: #f6f8fa;
  padding: 3rem 1.25rem 1.25rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1.25rem 0;
  border: 1px solid var(--border);
}

.dark .chat-message-content :deep(.code-block-wrapper) {
  background-color: #161b22;
}

.chat-message-content :deep(.code-block-wrapper::before) {
  content: attr(data-language);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--muted-foreground);
  background-color: var(--muted);
  border-bottom: 1px solid var(--border);
  border-radius: 0.75rem 0.75rem 0 0;
}

.chat-message-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  border: none;
  font-size: 0.875rem;
  line-height: 1.6;
}

.chat-message-content :deep(code:not(pre code)) {
  background-color: var(--muted);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
}
</style>

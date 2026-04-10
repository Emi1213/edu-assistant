<script setup lang="ts">
import { computed } from 'vue'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

const CODE_BLOCK_LANGUAGES = [
  { value: 'plaintext', label: 'Texto' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'markdown', label: 'Markdown' },
] as const

const props = defineProps<{
  node: { attrs: { language?: string } }
  updateAttributes: (attrs: { language: string }) => void
}>()

const currentLanguage = computed(() => props.node.attrs.language || 'plaintext')

const codeClass = computed(
  () => `language-${props.node.attrs.language || 'plaintext'}`
)

function onLanguageChange(event: Event) {
  const target = event.target as HTMLSelectElement
  if (target?.value) props.updateAttributes({ language: target.value })
}
</script>

<template>
  <NodeViewWrapper class="code-block-wrapper">
    <div class="code-block-header">
      <select
        :value="currentLanguage"
        class="code-block-lang-select"
        title="Lenguaje"
        @change="onLanguageChange"
      >
        <option
          v-for="opt in CODE_BLOCK_LANGUAGES"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
    </div>
    <pre class="code-block-pre">
      <NodeViewContent as="code" :class="codeClass" />
    </pre>
  </NodeViewWrapper>
</template>

<style scoped>
.code-block-wrapper {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  margin: 1rem 0;
  border: 1px solid var(--border);
}

.code-block-header {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted-foreground);
  background-color: var(--muted);
  border-bottom: 1px solid var(--border);
}

.code-block-lang-select {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--border);
  background-color: var(--background);
  color: var(--foreground);
  font-size: 0.75rem;
  cursor: pointer;
  text-transform: uppercase;
}

.code-block-pre {
  margin: 0;
  padding: 1rem 1.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.6;
  background-color: #f6f8fa;
}

.dark .code-block-pre {
  background-color: #161b22;
}

.code-block-pre :deep(code) {
  padding: 0;
  background: transparent;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
}
</style>

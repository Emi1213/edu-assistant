<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  node: { attrs: { prompt: string; reason: string } }
  editor: Editor
  getPos: () => number | undefined
}>()

function updateAttrs(attrs: Partial<{ prompt: string; reason: string }>) {
  const pos = props.getPos()
  if (typeof pos !== 'number') return
  const { state } = props.editor
  const node = state.doc.nodeAt(pos)
  if (!node) return
  props.editor.view.dispatch(
    state.tr.setNodeMarkup(pos, null, { ...node.attrs, ...attrs })
  )
}

function updatePrompt(value: string) {
  updateAttrs({ prompt: value })
}

function updateReason(value: string) {
  updateAttrs({ reason: value })
}
</script>

<template>
  <NodeViewWrapper
    as="div"
    class="image-suggestion-block"
    data-type="image-suggestion"
    :data-pos="getPos()"
  >
    <div class="image-suggestion-content">
      <p class="image-suggestion-title">💡 Sugerencia de Imagen:</p>
      <textarea
        class="image-suggestion-prompt image-suggestion-prompt-input"
        :value="node.attrs.prompt"
        placeholder="Describe la imagen a generar..."
        rows="2"
        @input="(e) => updatePrompt((e.target as HTMLTextAreaElement).value)"
      />
      <label class="block text-sm text-muted-foreground mt-1 mb-0.5">Motivo de la sugerencia</label>
      <textarea
        class="image-suggestion-reason-input"
        :value="node.attrs.reason"
        placeholder="Por qué se sugiere esta imagen..."
        rows="1"
        @input="(e) => updateReason((e.target as HTMLTextAreaElement).value)"
      />
      <div class="image-suggestion-actions">
        <button
          type="button"
          class="generate-image-btn"
          :data-prompt="node.attrs.prompt"
        >
          🎨 Generar Imagen
        </button>
        <button type="button" class="remove-image-suggestion-btn">
          ✕ Quitar sugerencia
        </button>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
.image-suggestion-prompt-input {
  display: block;
  width: 100%;
  font-size: 0.9375rem;
  color: var(--foreground);
  margin-bottom: 0.5rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--background);
  resize: vertical;
  min-height: 2.5rem;
}
.image-suggestion-prompt-input::placeholder {
  color: var(--muted-foreground);
}
.image-suggestion-prompt-input:focus {
  outline: none;
  ring: 2px;
  ring-color: var(--ring);
}
.image-suggestion-reason-input {
  display: block;
  width: 100%;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--muted/50);
  resize: vertical;
  min-height: 1.75rem;
}
.image-suggestion-reason-input::placeholder {
  color: var(--muted-foreground);
  opacity: 0.8;
}
.image-suggestion-reason-input:focus {
  outline: none;
  border-color: var(--ring);
}
</style>

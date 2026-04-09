<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/vue-3'
import { Image, Sparkles, Trash2 } from 'lucide-vue-next'

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
  props.editor.view.dispatch(state.tr.setNodeMarkup(pos, null, { ...node.attrs, ...attrs }))
}

function updatePrompt(value: string) {
  updateAttrs({ prompt: value })
}

function updateReason(value: string) {
  updateAttrs({ reason: value })
}

const fieldIdSuffix = `-${props.getPos() ?? 'x'}`
</script>

<template>
  <NodeViewWrapper
    as="div"
    class="image-suggestion-block"
    data-type="image-suggestion"
    :data-prompt="node.attrs.prompt"
    :data-pos="getPos()"
  >
    <div class="image-suggestion-card">
      <div class="image-suggestion-card-inner">
        <div class="image-suggestion-icon-wrap" aria-hidden="true">
          <Image class="image-suggestion-icon" />
        </div>
        <div class="image-suggestion-body">
          <p class="image-suggestion-eyebrow">Sugerencia de imagen</p>
          <p class="image-suggestion-hint">
            La IA puede generar una ilustración a partir del prompt. Ajusta el texto y pulsa generar.
          </p>

          <div class="image-suggestion-field">
            <label class="image-suggestion-label" :for="`img-suggestion-prompt${fieldIdSuffix}`">Prompt</label>
            <textarea
              :id="`img-suggestion-prompt${fieldIdSuffix}`"
              class="image-suggestion-textarea image-suggestion-textarea-prompt"
              :value="node.attrs.prompt"
              placeholder="Describe la imagen que quieres (estilo, sujetos, ambiente…)"
              rows="3"
              @input="(e) => updatePrompt((e.target as HTMLTextAreaElement).value)"
            />
          </div>

          <div class="image-suggestion-field">
            <label class="image-suggestion-label" :for="`img-suggestion-reason${fieldIdSuffix}`">Motivo (opcional)</label>
            <textarea
              :id="`img-suggestion-reason${fieldIdSuffix}`"
              class="image-suggestion-textarea image-suggestion-textarea-reason"
              :value="node.attrs.reason"
              placeholder="Por qué encaja esta imagen en el contenido"
              rows="2"
              @input="(e) => updateReason((e.target as HTMLTextAreaElement).value)"
            />
          </div>

          <div class="image-suggestion-actions">
            <button
              type="button"
              class="generate-image-btn image-suggestion-btn-primary"
              :data-prompt="node.attrs.prompt"
              data-default-label="Generar imagen"
            >
              <Sparkles class="size-4 shrink-0" aria-hidden="true" />
              <span class="generate-image-btn-label">Generar imagen</span>
            </button>
            <button type="button" class="remove-image-suggestion-btn image-suggestion-btn-ghost">
              <Trash2 class="size-4 shrink-0" aria-hidden="true" />
              <span>Quitar sugerencia</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
.image-suggestion-card {
  margin: 1.25rem 0;
  border-radius: 0.75rem;
  border: 1px solid color-mix(in oklab, var(--primary) 28%, var(--border));
  background: linear-gradient(
    135deg,
    color-mix(in oklab, var(--primary) 8%, var(--card)) 0%,
    var(--card) 48%,
    color-mix(in oklab, var(--muted) 65%, var(--card)) 100%
  );
  box-shadow: 0 1px 2px color-mix(in oklab, var(--foreground) 6%, transparent);
}

.image-suggestion-card-inner {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 1.25rem 1.125rem;
  align-items: flex-start;
}

.image-suggestion-icon-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.625rem;
  background: color-mix(in oklab, var(--primary) 14%, transparent);
  color: var(--primary);
}

.image-suggestion-icon {
  width: 1.35rem;
  height: 1.35rem;
}

.image-suggestion-body {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.image-suggestion-eyebrow {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
}

.image-suggestion-hint {
  margin: -0.25rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--muted-foreground);
}

.image-suggestion-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.image-suggestion-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--foreground);
}

.image-suggestion-textarea {
  display: block;
  width: 100%;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--foreground);
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--background);
  resize: vertical;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.image-suggestion-textarea::placeholder {
  color: var(--muted-foreground);
  opacity: 0.85;
}

.image-suggestion-textarea:focus {
  outline: none;
  border-color: color-mix(in oklab, var(--primary) 55%, var(--border));
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent);
}

.image-suggestion-textarea-reason {
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  background: color-mix(in oklab, var(--muted) 35%, var(--background));
}

.image-suggestion-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.25rem;
  margin-top: 0.125rem;
  border-top: 1px solid color-mix(in oklab, var(--border) 80%, transparent);
}

.image-suggestion-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  background: var(--primary);
  color: var(--primary-foreground);
  transition:
    background-color 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.image-suggestion-btn-primary:hover:not(:disabled) {
  filter: brightness(1.05);
  box-shadow: 0 4px 14px color-mix(in oklab, var(--primary) 35%, transparent);
}

.image-suggestion-btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.image-suggestion-btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--muted-foreground);
  background: var(--background);
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}

.image-suggestion-btn-ghost:hover {
  background: var(--muted);
  color: var(--foreground);
  border-color: color-mix(in oklab, var(--destructive) 35%, var(--border));
  color: var(--destructive);
}

@media (min-width: 640px) {
  .image-suggestion-actions {
    flex-wrap: nowrap;
    justify-content: flex-start;
  }

  .image-suggestion-btn-primary {
    min-width: 10rem;
  }
}
</style>

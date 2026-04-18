<template>
  <div class="video-section-enter max-w-2xl mx-auto w-full space-y-4">
    <article
      v-for="(card, idx) in draft.items"
      :key="idx"
      class="relative rounded-xl border border-border bg-[color:var(--paper)] p-5 shadow-sm space-y-3"
    >
      <header class="flex items-center justify-between">
        <div class="flex items-baseline gap-3">
          <span class="video-display-serif italic text-[color:var(--accent-ink)] text-2xl leading-none tabular-nums">
            {{ String(idx + 1).padStart(2, '0') }}
          </span>
          <span class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">flashcard</span>
        </div>
        <button
          type="button"
          class="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center"
          aria-label="Quitar flashcard"
          @click="removeCard(idx)"
        >
          <X class="w-4 h-4" />
        </button>
      </header>

      <div class="space-y-2">
        <label class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
          Pregunta
        </label>
        <textarea
          v-model="card.front"
          rows="2"
          class="w-full rounded-lg border border-border bg-card p-3 text-[14.5px] leading-relaxed focus:border-[color:var(--accent-ink)] focus:outline-none transition-colors"
        />
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
          Respuesta
        </label>
        <textarea
          v-model="card.back"
          rows="3"
          class="w-full rounded-lg border border-[color:var(--accent-ink)]/30 bg-[color:var(--accent-ink-wash)] p-3 text-[14.5px] leading-relaxed italic video-display-serif text-primary focus:border-[color:var(--accent-ink)] focus:outline-none transition-colors"
        />
      </div>
    </article>

    <button
      type="button"
      class="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-[color:var(--accent-ink)] hover:text-[color:var(--accent-ink)] transition-colors"
      @click="addCard"
    >
      <Plus class="w-4 h-4" />
      <span class="text-sm font-semibold">Agregar flashcard</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { deepClone } from '../../../utils/clone'
import { flashcardsContentSchema } from '../../../validation/update-video-content.schema'
import type { FlashcardsBlockContent } from '../../../types/video-block.types'

const props = defineProps<{ content: FlashcardsBlockContent }>()

const original = JSON.stringify(props.content)
const draft = ref<FlashcardsBlockContent>(deepClone(props.content))

const isDirty = computed(() => JSON.stringify(draft.value) !== original)

function addCard() {
  draft.value.items.push({ front: '', back: '' })
}

function removeCard(idx: number) {
  draft.value.items.splice(idx, 1)
}

function validate(): string | null {
  const r = flashcardsContentSchema.safeParse(draft.value)
  return r.success ? null : 'Revisá las flashcards'
}

defineExpose({
  getDraft: () => draft.value,
  isDirty,
  validate,
})
</script>

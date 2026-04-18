<template>
  <div class="video-section-enter max-w-4xl w-full space-y-3">
    <article
      v-for="(term, idx) in draft.terms"
      :key="idx"
      class="grid grid-cols-[auto_1fr_2fr_auto] gap-3 items-start bg-[color:var(--paper)] rounded-lg border border-border p-3 shadow-sm"
    >
      <span class="video-display-serif italic text-[color:var(--accent-ink)] text-lg tabular-nums pt-2">
        {{ String(idx + 1).padStart(2, '0') }}
      </span>
      <input
        v-model="term.term"
        type="text"
        class="w-full p-2 rounded-lg border border-border bg-card video-display-serif font-semibold text-primary focus:border-[color:var(--accent-ink)] focus:outline-none transition-colors"
        placeholder="Término"
      />
      <textarea
        v-model="term.definition"
        rows="2"
        class="w-full p-2 rounded-lg border border-border bg-card text-[14px] leading-relaxed focus:border-[color:var(--accent-ink)] focus:outline-none transition-colors"
        placeholder="Definición"
      />
      <button
        type="button"
        class="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center self-start mt-1"
        aria-label="Quitar término"
        @click="removeTerm(idx)"
      >
        <X class="w-4 h-4" />
      </button>
    </article>

    <button
      type="button"
      class="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-[color:var(--accent-ink)] hover:text-[color:var(--accent-ink)] transition-colors"
      @click="addTerm"
    >
      <Plus class="w-4 h-4" />
      <span class="text-sm font-semibold">Agregar término</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { deepClone } from '../../../utils/clone'
import { glossaryContentSchema } from '../../../validation/update-video-content.schema'
import type { GlossaryBlockContent } from '../../../types/video-block.types'

const props = defineProps<{ content: GlossaryBlockContent }>()

const original = JSON.stringify(props.content)
const draft = ref<GlossaryBlockContent>(deepClone(props.content))

const isDirty = computed(() => JSON.stringify(draft.value) !== original)

function addTerm() {
  draft.value.terms.push({ term: '', definition: '' })
}

function removeTerm(idx: number) {
  draft.value.terms.splice(idx, 1)
}

function validate(): string | null {
  const r = glossaryContentSchema.safeParse(draft.value)
  return r.success ? null : 'Revisá el glosario'
}

defineExpose({
  getDraft: () => draft.value,
  isDirty,
  validate,
})
</script>

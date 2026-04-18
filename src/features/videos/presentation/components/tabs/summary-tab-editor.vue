<template>
  <div class="video-section-enter space-y-8 max-w-4xl">
    <section class="space-y-2">
      <label class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
        Título
      </label>
      <input
        v-model="draft.title"
        type="text"
        class="w-full video-display-serif text-2xl font-bold text-primary bg-transparent border-b-2 border-border focus:border-[color:var(--accent-ink)] focus:outline-none py-2 transition-colors"
        placeholder="Título del resumen"
      />
    </section>

    <section class="space-y-2">
      <label class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
        Resumen
      </label>
      <textarea
        v-model="draft.summary"
        rows="6"
        class="w-full rounded-lg border border-border bg-[color:var(--paper)] p-4 text-[15px] leading-relaxed focus:border-[color:var(--accent-ink)] focus:outline-none transition-colors"
        placeholder="Describe el video..."
      />
    </section>

    <EditableStringList
      label="Qué vas a aprender"
      :items="draft.whatYouLearn"
      @add="draft.whatYouLearn.push('')"
      @remove="(idx: number) => draft.whatYouLearn.splice(idx, 1)"
    />

    <EditableStringList
      label="Conceptos clave"
      :items="draft.keyConcepts"
      @add="draft.keyConcepts.push('')"
      @remove="(idx: number) => draft.keyConcepts.splice(idx, 1)"
    />

    <EditableStringList
      label="Ejemplos"
      :items="draft.examples"
      @add="draft.examples.push('')"
      @remove="(idx: number) => draft.examples.splice(idx, 1)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import EditableStringList from './shared/editable-string-list.vue'
import { deepClone } from '../../../utils/clone'
import { summaryContentSchema } from '../../../validation/update-video-content.schema'
import type { SummaryBlockContent } from '../../../types/video-block.types'

const props = defineProps<{ content: SummaryBlockContent }>()

const original = JSON.stringify(props.content)
const draft = ref<SummaryBlockContent>(deepClone(props.content))

const isDirty = computed(() => JSON.stringify(draft.value) !== original)

function validate(): string | null {
  const r = summaryContentSchema.safeParse(draft.value)
  if (r.success) return null
  return Object.values(r.error.flatten().fieldErrors)[0]?.[0] ?? 'Revisá los campos'
}

defineExpose({
  getDraft: () => draft.value,
  isDirty,
  validate,
})
</script>

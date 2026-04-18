<template>
  <div class="video-section-enter max-w-3xl w-full space-y-4">
    <article
      v-for="(q, qIdx) in draft.questions"
      :key="qIdx"
      class="relative rounded-xl border border-border bg-[color:var(--paper)] p-5 shadow-sm space-y-4"
    >
      <header class="flex items-center justify-between">
        <div class="flex items-baseline gap-3">
          <span class="video-display-serif italic text-[color:var(--accent-ink)] text-2xl leading-none tabular-nums">
            {{ String(qIdx + 1).padStart(2, '0') }}
          </span>
          <span class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">pregunta</span>
        </div>
        <button
          type="button"
          class="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center"
          aria-label="Quitar pregunta"
          @click="removeQuestion(qIdx)"
        >
          <X class="w-4 h-4" />
        </button>
      </header>

      <div class="space-y-2">
        <label class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
          Pregunta
        </label>
        <textarea
          v-model="q.question"
          rows="2"
          class="w-full rounded-lg border border-border bg-card p-3 text-[14.5px] leading-relaxed focus:border-[color:var(--accent-ink)] focus:outline-none transition-colors"
        />
      </div>

      <fieldset class="space-y-2">
        <legend class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)] mb-2">
          Opciones — marcá la correcta
        </legend>
        <div
          v-for="(_, oIdx) in q.options"
          :key="oIdx"
          class="flex items-center gap-3"
        >
          <label
            class="flex items-center gap-2 cursor-pointer"
            :class="q.correctAnswer === oIdx ? 'text-[color:var(--accent-ink)]' : 'text-muted-foreground'"
          >
            <input
              type="radio"
              :name="`quiz-correct-${qIdx}`"
              :value="oIdx"
              :checked="q.correctAnswer === oIdx"
              class="sr-only"
              @change="q.correctAnswer = oIdx"
            />
            <span
              class="w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-semibold transition-colors video-display-serif"
              :class="q.correctAnswer === oIdx
                ? 'border-[color:var(--accent-ink)] bg-[color:var(--accent-ink)] text-white'
                : 'border-border bg-card'"
            >
              {{ letter(oIdx) }}
            </span>
          </label>
          <input
            :value="q.options[oIdx]"
            type="text"
            class="flex-1 rounded-lg border border-border bg-card p-2 text-[14px] focus:border-[color:var(--accent-ink)] focus:outline-none transition-colors"
            @input="q.options[oIdx] = ($event.target as HTMLInputElement).value"
          />
        </div>
      </fieldset>

      <div class="space-y-2">
        <label class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
          Explicación
        </label>
        <textarea
          v-model="q.explanation"
          rows="2"
          class="w-full rounded-lg border border-border bg-card p-3 text-[14px] leading-relaxed focus:border-[color:var(--accent-ink)] focus:outline-none transition-colors"
        />
      </div>
    </article>

    <button
      type="button"
      class="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-[color:var(--accent-ink)] hover:text-[color:var(--accent-ink)] transition-colors"
      @click="addQuestion"
    >
      <Plus class="w-4 h-4" />
      <span class="text-sm font-semibold">Agregar pregunta</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { deepClone } from '../../../utils/clone'
import { quizContentSchema } from '../../../validation/update-video-content.schema'
import type { QuizBlockContent } from '../../../types/video-block.types'

const props = defineProps<{ content: QuizBlockContent }>()

const original = JSON.stringify(props.content)
const draft = ref<QuizBlockContent>(deepClone(props.content))

const isDirty = computed(() => JSON.stringify(draft.value) !== original)

function addQuestion() {
  draft.value.questions.push({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
  })
}

function removeQuestion(idx: number) {
  draft.value.questions.splice(idx, 1)
}

function letter(idx: number): string {
  return 'ABCD'[idx] ?? String(idx + 1)
}

function validate(): string | null {
  const r = quizContentSchema.safeParse(draft.value)
  return r.success ? null : 'Revisá las preguntas'
}

defineExpose({
  getDraft: () => draft.value,
  isDirty,
  validate,
})
</script>

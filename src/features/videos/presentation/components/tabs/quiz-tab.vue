<template>
  <div class="video-section-enter max-w-4xl w-full min-w-0">
    <div v-if="!currentQuestion" class="p-6 text-center text-muted-foreground">
      Sin preguntas
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 sm:gap-6 items-start min-w-0">
      <article class="relative rounded-2xl border border-border bg-[color:var(--paper)] p-4 sm:p-7 shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_32px_-18px_rgba(23,26,58,0.2)] space-y-5 sm:space-y-6 min-w-0">
        <header class="flex items-start gap-3 sm:gap-5">
          <div class="flex flex-col items-center shrink-0">
            <span
              class="video-display-serif italic font-bold text-[color:var(--accent-ink)] text-4xl sm:text-5xl leading-none tabular-nums"
            >
              {{ String(currentIndex + 1).padStart(2, '0') }}
            </span>
            <span class="mt-1 text-[9px] uppercase tracking-[0.18em] text-[color:var(--accent-ink)]/70">
              pregunta
            </span>
          </div>
          <h3 class="video-display-serif font-semibold text-foreground text-lg sm:text-xl leading-snug pt-1 flex-1 break-words min-w-0">
            {{ currentQuestion.question }}
          </h3>
        </header>

        <fieldset class="space-y-2.5">
          <legend class="sr-only">Opciones</legend>
          <label
            v-for="(opt, oIdx) in currentQuestion.options"
            :key="oIdx"
            class="flex items-start gap-3 rounded-xl border px-3 sm:px-4 py-3 cursor-pointer transition-all text-[14px] sm:text-[14.5px] min-w-0"
            :class="optionClass(oIdx)"
          >
            <span
              class="shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold mt-0.5 video-display-serif"
              :class="indicatorClass(oIdx)"
            >
              <Check v-if="isAnswered && oIdx === currentQuestion.correctAnswer" class="w-3.5 h-3.5" />
              <X v-else-if="isAnswered && oIdx === picked && oIdx !== currentQuestion.correctAnswer" class="w-3.5 h-3.5" />
              <template v-else>{{ letter(oIdx) }}</template>
            </span>
            <span class="leading-snug break-words min-w-0">{{ opt }}</span>
            <input
              type="radio"
              class="sr-only"
              :name="`quiz-option-${currentIndex}`"
              :value="oIdx"
              :checked="picked === oIdx"
              :disabled="isAnswered"
              @change="picked = oIdx"
            />
          </label>
        </fieldset>

        <div
          v-if="isAnswered"
          class="rounded-xl p-4 text-sm leading-relaxed border flex items-start gap-3 video-section-enter"
          :class="feedbackClass"
        >
          <CheckCircle2 v-if="isCorrect" class="w-4 h-4 shrink-0 mt-0.5" />
          <XCircle v-else class="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p class="font-semibold text-[13px] uppercase tracking-wide">
              {{ isCorrect ? 'Correcto' : 'No es correcta' }}
            </p>
            <p class="mt-1 text-[13.5px]">{{ currentQuestion.explanation }}</p>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-1">
          <button
            v-if="!isAnswered"
            type="button"
            class="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ink)] focus-visible:ring-offset-2"
            :disabled="picked === null"
            @click="confirmAnswer"
          >
            Comprobar
          </button>
          <button
            v-else-if="currentIndex < content.questions.length - 1"
            type="button"
            class="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            @click="nextQuestion"
          >
            Siguiente
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
          <button
            v-else
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            @click="finish"
          >
            <Trophy class="w-4 h-4" />
            Ver resultados
          </button>
        </div>
      </article>

      <aside class="flex md:flex-col items-center gap-3 md:sticky md:top-4 md:pt-2 flex-wrap">
        <p class="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold shrink-0">
          Progreso
        </p>
        <div class="flex md:flex-col gap-1.5 flex-wrap">
          <span
            v-for="(_, qIdx) in content.questions"
            :key="qIdx"
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[11px] font-semibold border tabular-nums video-display-serif"
            :class="progressCircleClass(qIdx)"
          >
            {{ qIdx + 1 }}
          </span>
        </div>
      </aside>
    </div>

    <div
      v-if="showResults"
      class="video-section-enter mt-8 sm:mt-10 rounded-2xl border border-border bg-[color:var(--paper)] p-6 sm:p-8 shadow-sm flex flex-col items-center gap-4"
    >
      <div class="relative">
        <Trophy class="w-16 h-16 text-[color:var(--accent-ink)]" />
        <span
          class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center"
        >
          ✓
        </span>
      </div>
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
        Resultado final
      </p>
      <p class="video-display-serif font-bold text-primary text-5xl sm:text-6xl tabular-nums leading-none">
        {{ score }}<span class="text-border mx-1">/</span>{{ content.questions.length }}
      </p>
      <p class="text-muted-foreground text-sm">
        {{ percent }}% de respuestas correctas
      </p>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        @click="reset"
      >
        <RotateCcw class="w-4 h-4" />
        Intentar de nuevo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Check,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Trophy,
  X,
  XCircle,
} from 'lucide-vue-next'
import type { QuizBlockContent } from '../../../types/video-block.types'

const props = defineProps<{ content: QuizBlockContent }>()

const currentIndex = ref(0)
const picked = ref<number | null>(null)
const answered = ref<(number | null)[]>([])
const showResults = ref(false)

const currentQuestion = computed(() => props.content.questions[currentIndex.value])
const isAnswered = computed(() => answered.value[currentIndex.value] !== undefined)
const isCorrect = computed(
  () =>
    currentQuestion.value != null &&
    answered.value[currentIndex.value] === currentQuestion.value.correctAnswer,
)

const score = computed(() =>
  props.content.questions.reduce((acc, q, i) => {
    const a = answered.value[i]
    return a === q.correctAnswer ? acc + 1 : acc
  }, 0),
)

const percent = computed(() =>
  props.content.questions.length === 0
    ? 0
    : Math.round((score.value / props.content.questions.length) * 100),
)

const feedbackClass = computed(() =>
  isCorrect.value
    ? 'bg-green-50 border-green-200 text-green-800'
    : 'bg-red-50 border-red-200 text-red-700',
)

function letter(idx: number): string {
  return 'ABCD'[idx] ?? String(idx + 1)
}

function optionClass(oIdx: number): string {
  const q = currentQuestion.value
  if (!isAnswered.value || !q) {
    return picked.value === oIdx
      ? 'border-primary bg-[color:var(--accent-ink-wash)]'
      : 'border-border bg-card hover:border-primary/40'
  }
  if (oIdx === q.correctAnswer) return 'border-green-500 bg-green-50'
  if (oIdx === picked.value) return 'border-red-500 bg-red-50'
  return 'border-border bg-card opacity-50'
}

function indicatorClass(oIdx: number): string {
  const q = currentQuestion.value
  if (!isAnswered.value || !q) {
    return picked.value === oIdx
      ? 'border-primary bg-primary text-primary-foreground'
      : 'border-muted-foreground/40 text-muted-foreground'
  }
  if (oIdx === q.correctAnswer) return 'border-green-500 bg-green-500 text-white'
  if (oIdx === picked.value) return 'border-red-500 bg-red-500 text-white'
  return 'border-muted-foreground/40 text-muted-foreground'
}

function progressCircleClass(qIdx: number): string {
  const a = answered.value[qIdx]
  const question = props.content.questions[qIdx]
  if (a !== undefined && question) {
    return a === question.correctAnswer
      ? 'border-green-500 bg-green-100 text-green-700'
      : 'border-red-500 bg-red-50 text-red-600'
  }
  if (qIdx === currentIndex.value) return 'border-primary bg-primary text-primary-foreground'
  return 'border-border bg-card text-muted-foreground'
}

function confirmAnswer() {
  if (picked.value === null) return
  const next = [...answered.value]
  next[currentIndex.value] = picked.value
  answered.value = next
}

function nextQuestion() {
  currentIndex.value += 1
  picked.value = answered.value[currentIndex.value] ?? null
}

function finish() {
  showResults.value = true
}

function reset() {
  currentIndex.value = 0
  picked.value = null
  answered.value = []
  showResults.value = false
}
</script>

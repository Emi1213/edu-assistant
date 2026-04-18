<template>
  <div class="space-y-6">
    <article v-for="(q, qIdx) in content.questions" :key="qIdx" class="rounded-lg border bg-card p-4 space-y-3">
      <h3 class="font-semibold">{{ qIdx + 1 }}. {{ q.question }}</h3>

      <ol class="space-y-2">
        <li v-for="(opt, oIdx) in q.options" :key="oIdx">
          <button
            type="button"
            class="w-full text-left rounded border px-3 py-2 transition-colors"
            :class="buttonClass(qIdx, oIdx, q.correctAnswer)"
            @click="pick(qIdx, oIdx)"
          >
            <span class="font-semibold mr-2">{{ letter(oIdx) }}.</span>{{ opt }}
          </button>
        </li>
      </ol>

      <p v-if="answered[qIdx] !== undefined" class="text-sm bg-muted/30 rounded p-2">
        <span class="font-semibold">Explicación: </span>{{ q.explanation }}
      </p>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { QuizBlockContent } from '../../../types/video-block.types'

defineProps<{ content: QuizBlockContent }>()

const answered = ref<Record<number, number>>({})

function pick(qIdx: number, oIdx: number) {
  if (answered.value[qIdx] !== undefined) return
  answered.value = { ...answered.value, [qIdx]: oIdx }
}

function letter(idx: number): string {
  return 'ABCD'[idx] ?? String(idx + 1)
}

function buttonClass(qIdx: number, oIdx: number, correct: number): string {
  const picked = answered.value[qIdx]
  if (picked === undefined) return 'hover:border-primary'
  if (oIdx === correct) return 'border-green-500 bg-green-50'
  if (oIdx === picked) return 'border-red-500 bg-red-50'
  return 'opacity-60'
}
</script>

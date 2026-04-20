<template>
  <div class="rounded-lg border bg-card p-8 text-center space-y-4">
    <div class="flex justify-center">
      <Loader2 class="w-12 h-12 text-primary animate-spin" />
    </div>
    <h2 class="text-lg font-semibold">Procesando tu video...</h2>
    <p class="text-sm text-muted-foreground">{{ PROCESSING_ESTIMATE_LABEL }} estimados</p>

    <ol class="max-w-md mx-auto text-left space-y-1 text-sm" aria-live="polite">
      <li
        v-for="(step, idx) in PROCESSING_STEPS"
        :key="step"
        class="flex items-center gap-2"
        :class="stepClass(idx)"
      >
        <span class="inline-block w-2 h-2 rounded-full shrink-0" :class="dotClass(idx)" />
        {{ step }}
      </li>
    </ol>

    <div class="max-w-md mx-auto h-2 rounded bg-muted overflow-hidden">
      <div class="h-full bg-primary transition-all" :style="{ width: `${progressPercent}%` }" />
    </div>

    <div v-if="timedOut" role="status" class="text-xs text-yellow-700 bg-yellow-50 rounded p-2">
      El procesamiento tarda más de lo esperado. Podés cerrar esta pestaña y volver luego.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import {
  PROCESSING_ESTIMATE_LABEL,
  PROCESSING_STEPS,
} from '../../constants/video-processing.constants'
import type { IngestionStatus } from '../../types/video.types'

const props = defineProps<{ status: IngestionStatus; timedOut: boolean }>()

const currentStepIndex = computed(() => {
  switch (props.status) {
    case 'PENDING':
      return 0
    case 'EXTRACTING':
      return 2
    case 'GENERATING':
      return 3
    case 'COMPLETED':
      return PROCESSING_STEPS.length - 1
    default:
      return 0
  }
})

const progressPercent = computed(() =>
  Math.round(((currentStepIndex.value + 1) / PROCESSING_STEPS.length) * 100),
)

function stepClass(idx: number) {
  if (idx < currentStepIndex.value) return 'text-foreground'
  if (idx === currentStepIndex.value) return 'text-primary font-medium'
  return 'text-muted-foreground'
}

function dotClass(idx: number) {
  if (idx < currentStepIndex.value) return 'bg-primary'
  if (idx === currentStepIndex.value) return 'bg-primary animate-pulse'
  return 'bg-muted-foreground/30'
}
</script>

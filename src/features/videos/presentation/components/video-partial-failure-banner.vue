<template>
  <div
    role="alert"
    class="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 flex flex-wrap items-start gap-3 justify-between"
  >
    <div class="flex items-start gap-3 min-w-0">
      <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div class="min-w-0">
        <p class="text-sm font-semibold text-amber-900">
          La generación terminó con errores
        </p>
        <p class="text-xs text-amber-800 mt-0.5">
          No se pudo generar: <span class="font-medium">{{ failedLabels }}</span
          >. Podés reintentar solo los faltantes.
        </p>
      </div>
    </div>

    <button
      v-if="canRetry"
      type="button"
      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-amber-400 bg-white text-amber-900 hover:bg-amber-100 transition-colors shrink-0"
      :disabled="isSubmitting"
      @click="emit('retry')"
    >
      <RefreshCw class="w-3.5 h-3.5" />
      Reintentar faltantes
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, RefreshCw } from 'lucide-vue-next'
import { BLOCK_TAB_LABELS } from '../../constants/video-labels.constants'
import type { VideoBlockType } from '../../types/video-block.types'

const props = defineProps<{
  failedTypes: VideoBlockType[]
  canRetry: boolean
  isSubmitting: boolean
}>()

const emit = defineEmits<{ retry: [] }>()

const failedLabels = computed(() =>
  props.failedTypes.map((t) => BLOCK_TAB_LABELS[t]).join(', '),
)
</script>

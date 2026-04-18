<template>
  <div
    role="alert"
    class="rounded-xl border border-dashed border-red-300 bg-red-50/50 p-8 text-center space-y-3"
  >
    <AlertTriangle class="w-10 h-10 mx-auto text-red-500" />
    <h3 class="text-base font-semibold text-red-800">
      No se pudo generar: {{ label }}
    </h3>
    <p class="text-sm text-red-700 max-w-md mx-auto">
      El modelo no pudo producir contenido válido para este bloque.
    </p>
    <div v-if="canRetry" class="pt-1">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        @click="emit('retry', type)"
      >
        <RefreshCw class="w-3.5 h-3.5" />
        Reintentar solo esto
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, RefreshCw } from 'lucide-vue-next'
import { BLOCK_TAB_LABELS } from '../../../constants/video-labels.constants'
import type { VideoBlockType } from '../../../types/video-block.types'

const props = defineProps<{ type: VideoBlockType; canRetry: boolean }>()

const emit = defineEmits<{ retry: [type: VideoBlockType] }>()

const label = computed(() => BLOCK_TAB_LABELS[props.type])
</script>

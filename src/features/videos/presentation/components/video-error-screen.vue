<template>
  <div role="alert" class="rounded-lg border border-red-200 bg-red-50 p-8 text-center space-y-4">
    <AlertTriangle class="w-12 h-12 mx-auto text-red-500" />
    <h2 class="text-lg font-semibold text-red-700">No pudimos procesar el video</h2>
    <p v-if="errorMessage" class="text-sm text-red-600 max-w-md mx-auto">{{ errorMessage }}</p>

    <div class="flex justify-center gap-2">
      <button
        type="button"
        class="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
        @click="emit('retry')"
      >
        Reintentar
      </button>
      <button
        type="button"
        class="px-4 py-2 rounded border bg-background text-destructive hover:bg-destructive/10"
        @click="emit('delete')"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'

defineProps<{ errorMessage: string | null }>()
const emit = defineEmits<{ retry: []; delete: [] }>()
</script>

<template>
  <div
    role="status"
    class="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 flex items-center gap-2 text-xs text-yellow-900"
  >
    <AlertCircle class="w-4 h-4 shrink-0" />
    <span>
      Generado con baja confianza — revisá el contenido antes de publicar.
    </span>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
</script>

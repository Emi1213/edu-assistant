<template>
  <div class="grid gap-3 md:grid-cols-2">
    <button
      v-for="(card, idx) in content.items"
      :key="idx"
      type="button"
      class="text-left rounded-lg border bg-card p-4 hover:border-primary transition min-h-[8rem]"
      :class="{ 'bg-primary/5 border-primary': flippedIndex === idx }"
      @click="toggle(idx)"
    >
      <p class="text-xs uppercase text-muted-foreground">
        {{ flippedIndex === idx ? 'Respuesta' : 'Pregunta' }}
      </p>
      <p class="mt-1 text-base font-medium whitespace-pre-line">
        {{ flippedIndex === idx ? card.back : card.front }}
      </p>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FlashcardsBlockContent } from '../../../types/video-block.types'

defineProps<{ content: FlashcardsBlockContent }>()

const flippedIndex = ref<number | null>(null)

function toggle(idx: number) {
  flippedIndex.value = flippedIndex.value === idx ? null : idx
}
</script>

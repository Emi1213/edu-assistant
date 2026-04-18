<template>
  <div class="video-section-enter mx-auto w-full max-w-xl flex flex-col items-stretch gap-6 sm:gap-8 min-w-0">
    <div v-if="!current" class="p-8 text-center text-muted-foreground">Sin flashcards</div>

    <template v-else>
      <div class="relative pt-4">
        <!-- Stacked paper decoration behind the main card -->
        <div
          aria-hidden="true"
          class="absolute inset-x-6 top-0 h-4 rounded-t-xl bg-[color:var(--paper)] border border-border border-b-0 opacity-70"
        />
        <div
          aria-hidden="true"
          class="absolute inset-x-3 top-2 h-4 rounded-t-xl bg-[color:var(--paper)] border border-border border-b-0"
        />

        <div class="video-flip-stage relative h-[280px] sm:h-[320px]">
          <button
            type="button"
            class="video-flip-inner rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ink)] focus-visible:ring-offset-4"
            :class="{ 'is-flipped': flipped }"
            :aria-label="flipped ? 'Ver pregunta' : 'Ver respuesta'"
            @click="flipped = !flipped"
          >
            <!-- FRONT -->
            <div
              class="video-flip-face rounded-2xl bg-[color:var(--paper)] border border-border shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_32px_-18px_rgba(23,26,58,0.25)] px-5 py-6 sm:px-8 sm:py-8 flex flex-col"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-[color:var(--accent-ink)]" aria-hidden="true" />
                  <span class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
                    Pregunta
                  </span>
                </div>
                <span class="text-[11px] text-muted-foreground tabular-nums font-semibold">
                  <span class="video-display-serif text-base text-primary">{{ index + 1 }}</span>
                  <span class="mx-0.5 text-muted-foreground/60">/</span>
                  {{ content.items.length }}
                </span>
              </div>

              <div class="flex-1 flex items-center justify-center px-1 sm:px-2 min-w-0">
                <p class="video-display-serif font-bold text-foreground text-lg sm:text-2xl text-center leading-[1.25] break-words">
                  {{ current.front }}
                </p>
              </div>

              <div class="pt-4 mt-4 border-t border-border/60">
                <div class="h-[3px] rounded-full bg-muted overflow-hidden">
                  <div
                    class="h-full rounded-full bg-[color:var(--accent-ink)] transition-[width] duration-500 ease-out"
                    :style="{ width: `${progress}%` }"
                  />
                </div>
              </div>
            </div>

            <!-- BACK -->
            <div
              class="video-flip-face video-flip-back rounded-2xl border border-[color:var(--accent-ink)]/30 px-5 py-6 sm:px-8 sm:py-8 flex flex-col"
              style="background-color: var(--accent-ink-wash)"
            >
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                <span class="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Respuesta
                </span>
              </div>

              <div class="flex-1 flex items-center justify-center px-1 sm:px-2 min-w-0">
                <p class="video-display-serif italic text-primary text-base sm:text-xl text-center leading-snug break-words">
                  {{ current.back }}
                </p>
              </div>

              <p class="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]/70">
                Click para volver
              </p>
            </div>
          </button>
        </div>
      </div>

      <div class="flex flex-col items-center gap-3">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-[color:var(--accent-ink)] hover:text-[color:var(--accent-ink)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            :disabled="index === 0"
            aria-label="Anterior"
            @click="prev"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ink)] focus-visible:ring-offset-2"
            @click="flipped = !flipped"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            Voltear
          </button>

          <button
            type="button"
            class="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-[color:var(--accent-ink)] hover:text-[color:var(--accent-ink)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            :disabled="index === content.items.length - 1"
            aria-label="Siguiente"
            @click="next"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <p class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground select-none">
          <kbd class="font-mono bg-muted rounded px-1.5 py-0.5 text-[10px] normal-case">Space</kbd>
          voltear
          <span class="mx-1">·</span>
          <kbd class="font-mono bg-muted rounded px-1.5 py-0.5 text-[10px] normal-case">←</kbd>
          <kbd class="font-mono bg-muted rounded px-1.5 py-0.5 text-[10px] normal-case">→</kbd>
          navegar
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-vue-next'
import type { FlashcardsBlockContent } from '../../../types/video-block.types'

const props = defineProps<{ content: FlashcardsBlockContent }>()

const index = ref(0)
const flipped = ref(false)

const current = computed(() => props.content.items[index.value] ?? null)
const progress = computed(() =>
  props.content.items.length === 0
    ? 0
    : Math.round(((index.value + 1) / props.content.items.length) * 100),
)

function prev() {
  if (index.value > 0) {
    index.value -= 1
    flipped.value = false
  }
}

function next() {
  if (index.value < props.content.items.length - 1) {
    index.value += 1
    flipped.value = false
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

watch(
  () => props.content.items.length,
  () => {
    index.value = 0
    flipped.value = false
  },
)

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

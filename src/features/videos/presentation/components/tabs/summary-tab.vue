<template>
  <article class="video-section-enter space-y-10 sm:space-y-12 max-w-4xl min-w-0">
    <section class="grid grid-cols-[auto_1fr] gap-3 sm:gap-5">
      <div class="flex flex-col items-center">
        <span
          class="video-display-serif italic text-[color:var(--accent-ink)] text-4xl sm:text-5xl leading-none select-none"
          aria-hidden="true"
        >
          §
        </span>
        <span class="flex-1 w-px bg-[color:var(--accent-ink)]/20 mt-2" />
      </div>
      <div class="pb-1 min-w-0">
        <p
          class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)] mb-3"
        >
          Introducción
        </p>
        <h2
          class="video-display-serif font-bold text-primary text-2xl sm:text-3xl leading-[1.15] tracking-tight break-words hyphens-auto"
        >
          {{ content.title }}
        </h2>
        <p class="mt-4 text-foreground/85 text-[14px] sm:text-[15px] leading-[1.7] sm:leading-[1.75] whitespace-pre-line break-words">
          {{ content.summary }}
        </p>
      </div>
    </section>

    <section v-if="content.whatYouLearn.length" class="space-y-6">
      <header class="flex items-baseline gap-3">
        <span
          class="video-display-serif text-[color:var(--accent-ink)] text-base italic"
          aria-hidden="true"
        >
          I.
        </span>
        <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
          Qué vas a aprender
        </p>
        <span class="flex-1 h-px bg-border translate-y-[3px]" aria-hidden="true" />
      </header>

      <ol class="divide-y divide-border/60">
        <li
          v-for="(item, idx) in content.whatYouLearn"
          :key="idx"
          class="grid grid-cols-[auto_1fr] gap-3 sm:gap-5 items-baseline py-4"
        >
          <span
            class="video-display-serif text-primary text-xl sm:text-2xl tabular-nums leading-none"
          >
            {{ String(idx + 1).padStart(2, '0') }}
          </span>
          <span class="text-foreground text-[14px] sm:text-[15px] leading-relaxed break-words min-w-0">{{ item }}</span>
        </li>
      </ol>
    </section>

    <section v-if="content.keyConcepts.length" class="space-y-6">
      <header class="flex items-baseline gap-3">
        <span class="video-display-serif text-[color:var(--accent-ink)] text-base italic" aria-hidden="true">II.</span>
        <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
          Conceptos clave
        </p>
        <span class="flex-1 h-px bg-border translate-y-[3px]" aria-hidden="true" />
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article
          v-for="(item, idx) in content.keyConcepts"
          :key="idx"
          class="group relative rounded-lg bg-[color:var(--paper)] border border-border p-4 sm:p-5 transition-shadow hover:shadow-sm overflow-hidden min-w-0"
        >
          <span
            class="absolute top-0 left-0 h-full w-[3px] bg-[color:var(--accent-ink)]"
            aria-hidden="true"
          />
          <span
            class="video-display-serif italic text-[color:var(--accent-ink)]/60 text-xs tracking-wide"
          >
            concepto / {{ String(idx + 1).padStart(2, '0') }}
          </span>
          <p class="mt-2 text-foreground text-[13.5px] sm:text-[14px] leading-relaxed break-words">
            {{ item }}
          </p>
        </article>
      </div>
    </section>

    <section v-if="content.examples.length" class="space-y-6">
      <header class="flex items-baseline gap-3">
        <span class="video-display-serif text-[color:var(--accent-ink)] text-base italic" aria-hidden="true">III.</span>
        <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
          Ejemplos
        </p>
        <span class="flex-1 h-px bg-border translate-y-[3px]" aria-hidden="true" />
      </header>

      <ul class="space-y-3">
        <li
          v-for="(item, idx) in content.examples"
          :key="idx"
          class="relative pl-6 text-foreground text-[14px] sm:text-[14.5px] leading-relaxed italic break-words"
        >
          <span
            class="absolute left-0 top-0 video-display-serif text-[color:var(--accent-ink)] text-xl leading-none"
            aria-hidden="true"
          >
            ·
          </span>
          {{ item }}
        </li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { SummaryBlockContent } from '../../../types/video-block.types'

defineProps<{ content: SummaryBlockContent }>()
</script>

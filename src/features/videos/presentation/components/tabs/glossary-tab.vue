<template>
  <div class="video-section-enter max-w-5xl w-full">
    <header class="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
          Índice
        </p>
        <h2 class="video-display-serif font-semibold text-primary text-2xl leading-tight">
          {{ content.terms.length }}
          <span class="text-muted-foreground font-normal text-base italic">términos</span>
        </h2>
      </div>

      <nav
        v-if="letters.length > 1"
        class="flex flex-wrap gap-1 bg-[color:var(--paper)] rounded-full border border-border p-1"
        aria-label="Ir a letra"
      >
        <a
          v-for="letter in letters"
          :key="letter"
          :href="`#glossary-${letter}`"
          class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold video-display-serif text-muted-foreground hover:bg-[color:var(--accent-ink-wash)] hover:text-[color:var(--accent-ink)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ink)]"
        >
          {{ letter }}
        </a>
      </nav>
    </header>

    <div class="space-y-10">
      <section v-for="group in groups" :key="group.letter">
        <header class="flex items-center gap-4 mb-4">
          <h3
            :id="`glossary-${group.letter}`"
            class="video-display-serif font-bold text-primary text-4xl leading-none"
            style="scroll-margin-top: 96px"
          >
            {{ group.letter }}
          </h3>
          <span class="flex-1 h-px bg-[color:var(--accent-ink)]/30" aria-hidden="true" />
          <span class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
            {{ group.terms.length }}
          </span>
        </header>

        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="(term, idx) in group.terms"
            :key="idx"
            class="group relative bg-[color:var(--paper)] rounded-lg border border-border p-4 transition-all hover:border-[color:var(--accent-ink)]/40 hover:shadow-sm"
          >
            <dt class="video-display-serif font-semibold text-primary text-[15px] leading-tight">
              {{ term.term }}
            </dt>
            <div class="mt-2 flex items-center gap-2">
              <span class="w-1 h-1 rounded-full bg-[color:var(--accent-ink)]" aria-hidden="true" />
              <span class="h-px bg-[color:var(--accent-ink)]/20 flex-1" aria-hidden="true" />
            </div>
            <dd class="mt-2 text-muted-foreground text-[13px] leading-relaxed">
              {{ term.definition }}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GlossaryBlockContent, GlossaryTerm } from '../../../types/video-block.types'

const props = defineProps<{ content: GlossaryBlockContent }>()

interface GlossaryGroup {
  letter: string
  terms: GlossaryTerm[]
}

const groups = computed<GlossaryGroup[]>(() => {
  const buckets = new Map<string, GlossaryTerm[]>()
  for (const term of props.content.terms) {
    const raw = term.term.trim()[0] ?? '#'
    const letter = /[a-záéíóúñ]/i.test(raw) ? raw.toUpperCase() : '#'
    const bucket = buckets.get(letter) ?? []
    bucket.push(term)
    buckets.set(letter, bucket)
  }
  return Array.from(buckets.entries())
    .map(([letter, terms]) => ({
      letter,
      terms: [...terms].sort((a, b) =>
        a.term.localeCompare(b.term, 'es', { sensitivity: 'base' }),
      ),
    }))
    .sort((a, b) => a.letter.localeCompare(b.letter, 'es', { sensitivity: 'base' }))
})

const letters = computed(() => groups.value.map((g) => g.letter))
</script>

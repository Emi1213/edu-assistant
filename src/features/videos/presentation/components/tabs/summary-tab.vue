<template>
  <article class="space-y-5">
    <header>
      <h2 class="text-xl font-bold">{{ content.title }}</h2>
    </header>

    <p class="text-base leading-relaxed whitespace-pre-line">{{ content.summary }}</p>

    <section v-if="content.whatYouLearn.length" class="space-y-2">
      <h3 class="font-semibold">Qué vas a aprender</h3>
      <ul class="list-disc pl-5 space-y-1">
        <li v-for="(item, idx) in content.whatYouLearn" :key="idx">{{ item }}</li>
      </ul>
    </section>

    <section v-if="content.keyConcepts.length" class="space-y-2">
      <h3 class="font-semibold">Conceptos clave</h3>
      <ul class="list-disc pl-5 space-y-1">
        <li v-for="(item, idx) in content.keyConcepts" :key="idx">{{ item }}</li>
      </ul>
    </section>

    <section v-if="content.examples.length" class="space-y-2">
      <h3 class="font-semibold">Ejemplos</h3>
      <ul class="list-disc pl-5 space-y-1">
        <li v-for="(item, idx) in content.examples" :key="idx">{{ item }}</li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { SummaryBlockContent } from '../../../types/video-block.types'

defineProps<{ content: SummaryBlockContent }>()
</script>

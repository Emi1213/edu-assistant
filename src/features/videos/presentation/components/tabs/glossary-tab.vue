<template>
  <dl class="space-y-3">
    <div v-for="(term, idx) in content.terms" :key="idx" class="rounded border bg-card p-3">
      <dt class="font-semibold">{{ term.term }}</dt>
      <dd class="text-sm text-muted-foreground mt-1">{{ term.definition }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import type { GlossaryBlockContent } from '../../../types/video-block.types'

defineProps<{ content: GlossaryBlockContent }>()
</script>

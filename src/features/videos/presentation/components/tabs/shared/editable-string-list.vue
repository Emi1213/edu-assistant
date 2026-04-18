<template>
  <section class="space-y-3">
    <header class="flex items-baseline gap-3">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
        {{ label }}
      </p>
      <span class="flex-1 h-px bg-border translate-y-[3px]" />
    </header>

    <ul v-if="items.length" class="space-y-2">
      <li
        v-for="(_, idx) in items"
        :key="idx"
        class="grid grid-cols-[auto_1fr_auto] gap-3 items-start"
      >
        <span class="video-display-serif text-primary text-base tabular-nums pt-2 shrink-0">
          {{ String(idx + 1).padStart(2, '0') }}
        </span>
        <input
          :value="items[idx]"
          type="text"
          class="w-full p-2 rounded-lg border border-border bg-[color:var(--paper)] text-[14.5px] focus:border-[color:var(--accent-ink)] focus:outline-none transition-colors"
          @input="onItemChange(idx, ($event.target as HTMLInputElement).value)"
        />
        <button
          type="button"
          class="w-8 h-8 rounded-full border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors flex items-center justify-center"
          aria-label="Quitar"
          @click="emit('remove', idx)"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </li>
    </ul>
    <p v-else class="text-xs italic text-muted-foreground pl-2">Vacío</p>

    <button
      type="button"
      class="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--accent-ink)] hover:text-[color:var(--accent-ink-soft)] transition-colors"
      @click="emit('add')"
    >
      <Plus class="w-3.5 h-3.5" />
      Agregar
    </button>
  </section>
</template>

<script setup lang="ts">
import { Plus, X } from 'lucide-vue-next'

const props = defineProps<{ label: string; items: string[] }>()
const emit = defineEmits<{ add: []; remove: [idx: number] }>()

function onItemChange(idx: number, value: string) {
  props.items[idx] = value
}
</script>

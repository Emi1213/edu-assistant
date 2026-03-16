<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { Page } from '../../types'
import { FileText, Zap, Clock, Link2, Pencil, Loader2 } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  page: Page
  to?: RouteLocationRaw
  generatingRelationsPageId?: number | null
  onClick?: (page: Page) => void
  onGenerateRelations?: (page: Page) => void
  onUpdatePage?: (page: Page) => void
}>()

const isGeneratingRelations = computed(
  () => props.generatingRelationsPageId != null && props.generatingRelationsPageId === props.page.id
)

const timeAgo = computed(() => {
  const now = new Date()
  const updated = new Date(props.page.updatedAt)
  const diffInMs = now.getTime() - updated.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInHours < 1) {
    return 'Hace menos de una hora'
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
  } else if (diffInDays === 1) {
    return 'Hace 1 día'
  } else {
    return `Hace ${diffInDays} días`
  }
})
</script>

<template>
  <component
    :is="props.to ? 'router-link' : 'div'"
    :to="props.to"
    class="group relative rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 block no-underline text-inherit"
    :class="{ 'cursor-pointer': props.to || props.onClick }"
    @click="!props.to && props.onClick && props.onClick(page)"
  >
    <div class="p-5">
      <div class="flex items-start gap-3 mb-3">
        <div class="flex-shrink-0 w-10 h-10 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
          <FileText class="size-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="text-base font-semibold text-card-foreground line-clamp-2 leading-snug">
              {{ page.title }}
            </h3>
            <Zap v-if="page.isPublished" class="size-4 flex-shrink-0 mt-1 text-purple-500 dark:text-purple-400" />
          </div>
          <p v-if="page.keywords && page.keywords.length > 0" class="text-xs text-muted-foreground mb-2">
            {{ page.keywords.join(', ') }}
          </p>
        </div>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-border" @click.stop>
        <div class="flex items-center gap-4 text-xs text-muted-foreground">
          <div class="flex items-center gap-1">
            <Clock class="size-3" />
            <span>{{ timeAgo }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="onUpdatePage"
            type="button"
            class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
            title="Actualizar página"
            @click.stop="onUpdatePage(page)"
          >
            <Pencil class="size-3" />
            <span>Actualizar</span>
          </button>
          <button
            v-if="onGenerateRelations"
            type="button"
            :disabled="isGeneratingRelations"
            class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50 disabled:cursor-wait"
            title="Generar relaciones con otras páginas"
            @click.stop="onGenerateRelations(page)"
          >
            <Loader2 v-if="isGeneratingRelations" class="size-3 animate-spin" />
            <Link2 v-else class="size-3" />
            <span>{{ isGeneratingRelations ? 'Generando...' : 'Relaciones' }}</span>
          </button>
          <span
            class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded"
            :class="page.isPublished
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
          >
            {{ page.isPublished ? 'Publicada' : 'Borrador' }}
          </span>
        </div>
      </div>
    </div>
  </component>
</template>

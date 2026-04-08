<script setup lang="ts">
import type { LearningObject } from '../../types/learning-object.types'
import { FileText, Clock } from 'lucide-vue-next'

const props = defineProps<{
  learningObjects: LearningObject[]
  moduleId: number
  canEdit: boolean
}>()

const timeAgo = (dateStr: string) => {
  const diffInHours = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInHours < 1) return 'Hace menos de una hora'
  if (diffInHours < 24) return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
  if (diffInDays === 1) return 'Hace 1 día'
  return `Hace ${diffInDays} días`
}
</script>

<template>
  <div class="space-y-4 min-w-0">
    <div v-if="learningObjects.length === 0" class="rounded-md bg-card px-6 py-12 text-center">
      <p class="text-muted-foreground">No hay contenido disponible</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in learningObjects"
        :key="item.id"
        class="rounded-lg border border-border bg-card overflow-hidden shadow-sm"
      >
        <div class="p-5">
          <div class="flex items-start gap-3 mb-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-md bg-muted flex items-center justify-center">
              <FileText class="size-5 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2 mb-1">
                <h3 class="text-base font-semibold text-card-foreground line-clamp-2 leading-snug">
                  {{ item.title }}
                </h3>
              </div>
              <p v-if="item.keywords.length > 0" class="text-xs text-muted-foreground">
                {{ item.keywords.join(', ') }}
              </p>
            </div>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-border">
            <div class="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock class="size-3" />
              <span>{{ timeAgo(item.updatedAt) }}</span>
            </div>
            <span
              class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded"
              :class="item.isPublished
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
            >
              {{ item.isPublished ? 'Publicado' : 'Borrador' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

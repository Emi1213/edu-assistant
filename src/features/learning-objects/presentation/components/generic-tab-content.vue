<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { LearningObject } from '../../types'
import { ref } from 'vue'
import { GripVertical } from 'lucide-vue-next'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import LearningObjectCard from './learning-object-card.vue'

const props = defineProps<{
  learningObjects: LearningObject[]
  isLoading: boolean
  canEdit: boolean
  reorderPending?: boolean
  onReorderDrag?: (fromIndex: number, toIndex: number) => void
  generatingRelationsLearningObjectId?: number | null
  publishingLearningObjectId?: number | null
  buildDetailRoute?: (learningObject: LearningObject) => RouteLocationRaw
  onUpdateLearningObject?: (learningObject: LearningObject) => void
  onGenerateRelations?: (learningObject: LearningObject) => void
  onPublishNow?: (learningObject: LearningObject) => void
  onChat?: (learningObject: LearningObject) => void
}>()

const dragFromIndex = ref<number | null>(null)

function handleDragStart(e: DragEvent, index: number) {
  dragFromIndex.value = index
  e.dataTransfer?.setData('text/plain', String(index))
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

function handleDrop(e: DragEvent, toIndex: number) {
  e.preventDefault()
  const raw = e.dataTransfer?.getData('text/plain')
  const fromParsed = raw !== '' && raw != null ? Number(raw) : NaN
  const fromIndex = Number.isFinite(fromParsed) ? fromParsed : dragFromIndex.value
  dragFromIndex.value = null
  if (fromIndex === null || Number.isNaN(fromIndex)) return
  props.onReorderDrag?.(fromIndex, toIndex)
}

function handleDragEnd() {
  dragFromIndex.value = null
}

function rowDragOver(e: DragEvent) {
  if (!props.onReorderDrag) return
  handleDragOver(e)
}

function rowDrop(toIndex: number, e: DragEvent) {
  if (!props.onReorderDrag) return
  handleDrop(e, toIndex)
}
</script>

<template>
  <div class="space-y-4 min-w-0">
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="rounded-lg border border-border bg-card p-5"
      >
        <Skeleton class="h-6 w-3/4 mb-3" />
        <Skeleton class="h-4 w-full mb-2" />
        <Skeleton class="h-4 w-2/3" />
      </div>
    </div>

    <div
      v-else-if="learningObjects.length === 0"
      class="rounded-md bg-card px-6 py-12 text-center"
    >
      <p class="text-muted-foreground">No hay contenido disponible</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="(learningObject, index) in learningObjects"
        :key="learningObject.id"
        class="flex min-w-0 gap-2"
        @dragover="rowDragOver"
        @drop="rowDrop(index, $event)"
      >
        <div
          v-if="onReorderDrag"
          class="flex shrink-0 items-center self-stretch touch-none"
        >
          <button
            type="button"
            draggable="true"
            aria-label="Arrastrar para reordenar"
            :disabled="reorderPending"
            class="cursor-grab rounded-md p-1 text-muted-foreground active:cursor-grabbing disabled:pointer-events-none disabled:opacity-40"
            @dragstart="(e) => handleDragStart(e, index)"
            @dragend="handleDragEnd"
            @click.prevent.stop
          >
            <GripVertical class="size-5" />
          </button>
        </div>
        <div class="min-w-0 flex-1">
          <LearningObjectCard
            :learning-object="learningObject"
            :to="buildDetailRoute ? buildDetailRoute(learningObject) : undefined"
            :generating-relations-learning-object-id="generatingRelationsLearningObjectId"
            :is-publishing="publishingLearningObjectId === learningObject.id"
            :on-update-learning-object="canEdit ? onUpdateLearningObject : undefined"
            :on-generate-relations="canEdit ? onGenerateRelations : undefined"
            :on-publish-now="canEdit ? onPublishNow : undefined"
            :on-chat="onChat"
          />
        </div>
      </div>
    </div>
  </div>
</template>

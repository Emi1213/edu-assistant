<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { LearningObject } from '../../types'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import LearningObjectCard from './learning-object-card.vue'

const props = defineProps<{
  learningObjects: LearningObject[]
  isLoading: boolean
  canEdit: boolean
  generatingRelationsLearningObjectId?: number | null
  publishingLearningObjectId?: number | null
  buildDetailRoute?: (learningObject: LearningObject) => RouteLocationRaw
  onUpdateLearningObject?: (learningObject: LearningObject) => void
  onGenerateRelations?: (learningObject: LearningObject) => void
  onPublishNow?: (learningObject: LearningObject) => void
}>()
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
      <LearningObjectCard
        v-for="learningObject in learningObjects"
        :key="learningObject.id"
        :learning-object="learningObject"
        :to="buildDetailRoute ? buildDetailRoute(learningObject) : undefined"
        :generating-relations-learning-object-id="generatingRelationsLearningObjectId"
        :is-publishing="publishingLearningObjectId === learningObject.id"
        :on-update-learning-object="canEdit ? onUpdateLearningObject : undefined"
        :on-generate-relations="canEdit ? onGenerateRelations : undefined"
        :on-publish-now="canEdit ? onPublishNow : undefined"
      />
    </div>
  </div>
</template>

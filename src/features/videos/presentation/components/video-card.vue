<template>
  <router-link
    :to="detailRoute"
    class="block rounded-lg border bg-card p-4 hover:border-primary transition-colors"
    :class="cardStateClass"
  >
    <div class="flex gap-4">
      <VideoThumbnail
        :source-kind="item.sourceKind"
        :source-url="item.sourceUrl"
        :title="item.title"
      />

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-semibold truncate">{{ item.title }}</h3>

          <div class="flex flex-col items-end gap-1 shrink-0">
            <span
              class="text-xs font-bold px-2 py-0.5 rounded"
              :class="item.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'"
            >
              {{ item.isPublished ? 'PUBLICADO' : 'BORRADOR' }}
            </span>

            <span
              v-if="isProcessing"
              class="text-xs font-medium px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 flex items-center gap-1"
            >
              <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              {{ STATUS_LABELS[item.status] }}
            </span>

            <span
              v-if="item.status === 'FAILED'"
              class="text-xs font-medium px-2 py-0.5 rounded bg-red-100 text-red-800"
              :title="item.errorMessage ?? undefined"
            >
              Falló
            </span>

            <span
              v-if="item.hasManualEdits"
              class="text-xs font-medium px-2 py-0.5 rounded border border-gray-300 text-gray-600"
            >
              Editado
            </span>
          </div>
        </div>

        <div class="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <VideoSourceBadge :source-kind="item.sourceKind" />
          <span v-if="duration">· {{ duration }}</span>
        </div>

        <div class="mt-2 text-xs text-muted-foreground">
          {{ formattedDate }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VideoThumbnail from './video-thumbnail.vue'
import VideoSourceBadge from './video-source-badge.vue'
import { STATUS_LABELS } from '../../constants/video-labels.constants'
import { isProcessingStatus } from '../../constants/video-status.constants'
import { formatDuration } from '../../utils/format-duration'
import { MODULES_ROUTES_NAMES } from '@/features/modules/routes/modules-routes'
import type { VideoDto } from '../../types/video.types'

const props = defineProps<{
  item: VideoDto
  moduleId: number
}>()

const detailRoute = computed(() => ({
  name: MODULES_ROUTES_NAMES.VIDEO_DETAIL,
  params: { id: props.moduleId, learningObjectId: props.item.id },
}))

const isProcessing = computed(() => isProcessingStatus(props.item.status))
const duration = computed(() => formatDuration(props.item.durationSeconds))
const formattedDate = computed(() => new Date(props.item.createdAt).toLocaleDateString())

const cardStateClass = computed(() => {
  if (props.item.status === 'FAILED') return 'border-red-200'
  if (isProcessing.value) return 'border-yellow-200'
  return ''
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 space-y-4">
    <router-link :to="backRoute" class="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
      <ArrowLeft class="w-4 h-4" />
      Volver al módulo
    </router-link>

    <div v-if="isLoading" class="space-y-4">
      <div class="aspect-video w-full rounded-md bg-muted animate-pulse" />
      <div class="space-y-2">
        <div class="h-7 w-2/3 rounded bg-muted animate-pulse" />
        <div class="h-4 w-1/2 rounded bg-muted animate-pulse" />
      </div>
    </div>

    <div v-else-if="!video" class="rounded-lg border bg-card p-8 text-center text-muted-foreground">
      Video no encontrado.
    </div>

    <template v-else>
      <header class="space-y-3">
        <VideoPlayer
          :source-kind="video.sourceKind"
          :source-url="video.sourceUrl"
          :title="video.title"
        />

        <div>
          <h1 class="text-2xl font-bold">{{ video.title }}</h1>
          <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <VideoSourceBadge :source-kind="video.sourceKind" />
            <span v-if="duration">· {{ duration }}</span>
            <span v-if="video.detectedLanguage">· {{ video.detectedLanguage }}</span>
            <span
              class="ml-auto text-xs font-bold px-2 py-0.5 rounded"
              :class="video.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'"
            >
              {{ video.isPublished ? 'PUBLICADO' : 'BORRADOR' }}
            </span>
            <span
              v-if="video.hasManualEdits"
              class="text-xs font-medium px-2 py-0.5 rounded border border-gray-300"
            >
              Editado manualmente
            </span>
          </div>
        </div>
      </header>

      <VideoProcessingScreen
        v-if="isProcessing"
        :status="effectiveStatus"
        :timed-out="processingTimedOut"
      />

      <VideoErrorScreen
        v-else-if="effectiveStatus === 'FAILED'"
        :error-message="errorMessage"
        @retry="handleRetry"
        @delete="handleDelete"
      />

      <div v-else class="rounded-lg border bg-card p-6 text-center text-muted-foreground">
        Contenido disponible. (Tabs se habilitan en Phase 5.)
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import VideoPlayer from '../components/video-player.vue'
import VideoSourceBadge from '../components/video-source-badge.vue'
import VideoProcessingScreen from '../components/video-processing-screen.vue'
import VideoErrorScreen from '../components/video-error-screen.vue'
import { useVideoDetail } from '../../composables/use-video-detail'
import { isProcessingStatus } from '../../constants/video-status.constants'
import {
  POLLING_INTERVAL_MS,
  PROCESSING_TIMEOUT_MS,
} from '../../constants/video-processing.constants'
import { formatDuration } from '../../utils/format-duration'
import { MODULES_ROUTES_NAMES } from '@/features/modules/routes/modules-routes'
import type { IngestionStatus } from '../../types/video.types'

const route = useRoute()
const moduleId = computed(() => Number(route.params.id))
const learningObjectId = computed(() => Number(route.params.learningObjectId))

const { video, isLoading, status, errorMessage } = useVideoDetail(learningObjectId)

const effectiveStatus = computed<IngestionStatus>(() => status.value ?? 'PENDING')
const isProcessing = computed(() => isProcessingStatus(effectiveStatus.value))

const duration = computed(() => formatDuration(video.value?.durationSeconds))

const backRoute = computed(() => ({
  name: MODULES_ROUTES_NAMES.MODULE_WIKI,
  params: { id: moduleId.value },
}))

const processingStartedAt = ref<number | null>(null)
const processingTimedOut = ref(false)

watch(
  isProcessing,
  (v) => {
    if (v && processingStartedAt.value == null) processingStartedAt.value = Date.now()
    if (!v) {
      processingStartedAt.value = null
      processingTimedOut.value = false
    }
  },
  { immediate: true },
)

const timeoutInterval = window.setInterval(() => {
  if (
    processingStartedAt.value &&
    Date.now() - processingStartedAt.value > PROCESSING_TIMEOUT_MS
  ) {
    processingTimedOut.value = true
  }
}, POLLING_INTERVAL_MS)

onUnmounted(() => window.clearInterval(timeoutInterval))

function handleRetry() {
  // Wired in Phase 6
}
function handleDelete() {
  // Wired in Phase 8
}
</script>

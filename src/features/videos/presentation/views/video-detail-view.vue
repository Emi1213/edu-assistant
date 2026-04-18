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

        <div class="flex flex-wrap items-start gap-3 justify-between">
          <div class="min-w-0">
            <h1 class="text-2xl font-bold">{{ video.title }}</h1>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <VideoSourceBadge :source-kind="video.sourceKind" />
              <span v-if="duration">· {{ duration }}</span>
              <span v-if="video.detectedLanguage">· {{ video.detectedLanguage }}</span>
              <span
                class="text-xs font-bold px-2 py-0.5 rounded"
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

          <div v-if="canEditVideo" class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full border border-border bg-background hover:border-[color:var(--accent-ink)] hover:text-[color:var(--accent-ink)] transition-colors"
              :disabled="isProcessing"
              @click="openRetryAll"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              Regenerar todo
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full transition-colors"
              :class="video.isPublished
                ? 'border border-border bg-background hover:bg-muted text-muted-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'"
              @click="togglePublish"
            >
              <CheckCircle2 v-if="!video.isPublished" class="w-3.5 h-3.5" />
              <EyeOff v-else class="w-3.5 h-3.5" />
              {{ video.isPublished ? 'Despublicar' : 'Publicar' }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full border border-border bg-background text-destructive hover:bg-destructive/10 transition-colors"
              @click="deleteOpen = true"
            >
              <Trash2 class="w-3.5 h-3.5" />
              Eliminar
            </button>
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

      <VideoContentTabs
        v-else-if="video.blocks?.length"
        :blocks="video.blocks"
        :can-edit="canEditVideo"
        @regenerate-tab="openRetryForTab"
      />
      <div v-else class="rounded-lg border bg-card p-6 text-center text-muted-foreground">
        Sin contenido aún.
      </div>

      <RetryVideoDialog
        :is-open="retryOpen"
        :preselected="retryPreselected"
        :is-submitting="retryMutation.isPending.value"
        @update:is-open="retryOpen = $event"
        @submit="onRetrySubmit"
      />

      <DeleteVideoConfirmDialog
        :is-open="deleteOpen"
        :is-submitting="deleteMutation.isPending.value"
        :title="video.title"
        @update:is-open="deleteOpen = $event"
        @confirm="onConfirmDelete"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, CheckCircle2, EyeOff, RefreshCw, Trash2 } from 'lucide-vue-next'
import VideoPlayer from '../components/video-player.vue'
import VideoSourceBadge from '../components/video-source-badge.vue'
import VideoProcessingScreen from '../components/video-processing-screen.vue'
import VideoErrorScreen from '../components/video-error-screen.vue'
import VideoContentTabs from '../components/tabs/video-content-tabs.vue'
import RetryVideoDialog from '../components/retry-video-dialog.vue'
import DeleteVideoConfirmDialog from '../components/delete-video-confirm-dialog.vue'
import { useVideoDetail } from '../../composables/use-video-detail'
import { useRetryVideo } from '../../composables/use-retry-video'
import { useToggleVideoPublish } from '../../composables/use-toggle-video-publish'
import { useDeleteVideo } from '../../composables/use-delete-video'
import { useRoles } from '@/features/auth/composables/use-roles'
import { isProcessingStatus } from '../../constants/video-status.constants'
import {
  POLLING_INTERVAL_MS,
  PROCESSING_TIMEOUT_MS,
} from '../../constants/video-processing.constants'
import { VIDEO_BLOCK_TYPES } from '../../constants/video-block-type.constants'
import { formatDuration } from '../../utils/format-duration'
import { MODULES_ROUTES_NAMES } from '@/features/modules/routes/modules-routes'
import type { IngestionStatus } from '../../types/video.types'
import type { VideoBlockType } from '../../types/video-block.types'

const route = useRoute()
const router = useRouter()
const moduleId = computed(() => Number(route.params.id))
const learningObjectId = computed(() => Number(route.params.learningObjectId))

const { canEdit } = useRoles()
const canEditVideo = computed(() => canEdit())

const { video, isLoading, status, errorMessage } = useVideoDetail(learningObjectId)
const retryMutation = useRetryVideo(learningObjectId.value, moduleId.value)
const publishMutation = useToggleVideoPublish(moduleId.value)
const deleteMutation = useDeleteVideo(moduleId.value)
const deleteOpen = ref(false)

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

const retryOpen = ref(false)
const retryPreselected = ref<VideoBlockType[]>([...VIDEO_BLOCK_TYPES])

function openRetryAll() {
  retryPreselected.value = [...VIDEO_BLOCK_TYPES]
  retryOpen.value = true
}

function openRetryForTab(t: VideoBlockType) {
  retryPreselected.value = [t]
  retryOpen.value = true
}

async function onRetrySubmit(payload: { contentTypes?: VideoBlockType[]; instruction?: string }) {
  await retryMutation.mutateAsync(payload)
  retryOpen.value = false
}

function handleRetry() {
  openRetryAll()
}

function handleDelete() {
  deleteOpen.value = true
}

async function togglePublish() {
  if (!video.value) return
  await publishMutation.mutateAsync({
    id: video.value.id,
    isPublished: !video.value.isPublished,
  })
}

async function onConfirmDelete() {
  if (!video.value) return
  await deleteMutation.mutateAsync(video.value.id)
  deleteOpen.value = false
  router.push({ name: MODULES_ROUTES_NAMES.MODULE_WIKI, params: { id: moduleId.value } })
}
</script>

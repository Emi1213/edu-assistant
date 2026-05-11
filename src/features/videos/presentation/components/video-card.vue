<template>
  <div class="group relative h-full">
    <router-link
      :to="detailRoute"
      class="flex h-full rounded-xl border bg-card overflow-hidden transition-all hover:border-primary hover:shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_32px_-20px_rgba(23,26,58,0.25)]"
      :class="cardStateClass"
    >
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 w-full">
        <VideoThumbnail
          :source-kind="item.sourceKind"
          :source-url="item.sourceUrl"
          :title="item.title"
        />

        <div class="flex-1 min-w-0 flex flex-col py-0.5">
          <div>
            <div class="flex items-start justify-between gap-3">
              <h3 class="video-display-serif font-semibold text-foreground text-base leading-tight line-clamp-2 pr-8 min-h-[2lh]">
                {{ item.title }}
              </h3>
            </div>

            <div class="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <VideoSourceBadge :source-kind="item.sourceKind" />
              <span v-if="duration" class="tabular-nums">· {{ duration }}</span>
            </div>
          </div>

          <div class="mt-auto pt-3 flex flex-wrap items-center gap-1.5">
            <span
              v-if="isProcessing"
              class="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {{ STATUS_LABELS[item.status] }}
            </span>
            <span
              v-else-if="item.status === 'FAILED'"
              class="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200"
              :title="item.errorMessage ?? undefined"
            >
              <AlertTriangle class="w-3 h-3" />
              Error
            </span>

            <span
              class="text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
              :class="item.isPublished
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-muted text-muted-foreground border border-border'"
            >
              {{ item.isPublished ? 'Publicado' : 'Borrador' }}
            </span>

            <span
              v-if="item.hasManualEdits"
              class="text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-[color:var(--accent-ink-wash)] text-[color:var(--accent-ink)] border border-[color:var(--accent-ink)]/30"
            >
              Editado
            </span>

            <span class="ml-auto text-[11px] text-muted-foreground/80 tabular-nums">
              {{ formattedDate }}
            </span>
          </div>
        </div>
      </div>
    </router-link>

    <div
      v-if="canEditVideo"
      class="absolute top-3 right-3"
      @click.stop
    >
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            class="w-8 h-8 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ink)]"
            aria-label="Acciones del video"
          >
            <MoreVertical class="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="min-w-[200px]">
          <DropdownMenuItem :disabled="publishMutation.isPending.value" @click="togglePublish">
            <CheckCircle2 v-if="!item.isPublished" class="w-4 h-4 mr-2 text-green-600" />
            <EyeOff v-else class="w-4 h-4 mr-2 text-muted-foreground" />
            {{ item.isPublished ? 'Despublicar' : 'Publicar' }}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="text-destructive focus:text-destructive"
            @click="deleteOpen = true"
          >
            <Trash2 class="w-4 h-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <DeleteVideoConfirmDialog
      :is-open="deleteOpen"
      :is-submitting="deleteMutation.isPending.value"
      :title="item.title"
      @update:is-open="deleteOpen = $event"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AlertTriangle,
  CheckCircle2,
  EyeOff,
  MoreVertical,
  Trash2,
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import VideoThumbnail from './video-thumbnail.vue'
import VideoSourceBadge from './video-source-badge.vue'
import DeleteVideoConfirmDialog from './delete-video-confirm-dialog.vue'
import { STATUS_LABELS } from '../../constants/video-labels.constants'
import { isProcessingStatus } from '../../constants/video-status.constants'
import { formatDuration } from '../../utils/format-duration'
import { useRoles } from '@/features/auth/composables/use-roles'
import { useToggleVideoPublish } from '../../composables/use-toggle-video-publish'
import { useDeleteVideo } from '../../composables/use-delete-video'
import { MODULES_ROUTES_NAMES } from '@/features/modules/routes/modules-routes'
import type { VideoDto } from '../../types/video.types'

const props = defineProps<{
  item: VideoDto
  moduleId: number
}>()

const { canEdit } = useRoles()
const canEditVideo = computed(() => canEdit())

const publishMutation = useToggleVideoPublish(() => props.moduleId)
const deleteMutation = useDeleteVideo(() => props.moduleId)
const deleteOpen = ref(false)

const detailRoute = computed(() => ({
  name: MODULES_ROUTES_NAMES.VIDEO_DETAIL,
  params: { id: props.moduleId, learningObjectId: props.item.id },
}))

const isProcessing = computed(() => isProcessingStatus(props.item.status))
const duration = computed(() => formatDuration(props.item.durationSeconds))
const formattedDate = computed(() => new Date(props.item.createdAt).toLocaleDateString())

const cardStateClass = computed(() => {
  if (props.item.status === 'FAILED') return 'border-red-200'
  if (isProcessing.value) return 'border-amber-200'
  return 'border-border'
})

async function togglePublish() {
  await publishMutation.mutateAsync({
    id: props.item.id,
    isPublished: !props.item.isPublished,
  })
}

async function onConfirmDelete() {
  await deleteMutation.mutateAsync(props.item.id)
  deleteOpen.value = false
}
</script>

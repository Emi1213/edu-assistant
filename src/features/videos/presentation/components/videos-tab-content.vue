<script setup lang="ts">
import { ref } from 'vue'
import { GripVertical } from 'lucide-vue-next'
import VideoCard from './video-card.vue'
import type { VideoDto } from '../../types/video.types'

const props = defineProps<{
  videos: VideoDto[]
  moduleId: number
  isLoading: boolean
  reorderPending?: boolean
  onReorderDrag?: (movedVideo: VideoDto, targetVideo: VideoDto) => void
}>()

const dragFromIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function handleDragStart(e: DragEvent, index: number) {
  dragFromIndex.value = index
  e.dataTransfer?.setData('text/plain', String(index))
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    const target = e.target as HTMLElement
    if (target) target.style.opacity = '0.5'
  }
}

function handleDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  if (dragFromIndex.value !== null && dragFromIndex.value !== index) {
    dragOverIndex.value = index
  }
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

function handleDragLeave() {
  dragOverIndex.value = null
}

function handleDrop(e: DragEvent, toIndex: number) {
  e.preventDefault()
  dragOverIndex.value = null
  const raw = e.dataTransfer?.getData('text/plain')
  const fromParsed = raw !== '' && raw != null ? Number(raw) : NaN
  const fromIndex = Number.isFinite(fromParsed) ? fromParsed : dragFromIndex.value

  dragFromIndex.value = null
  if (fromIndex === null || Number.isNaN(fromIndex)) return
  if (fromIndex === toIndex) return

  const movedVideo = props.videos[fromIndex]
  const targetVideo = props.videos[toIndex]

  if (movedVideo && targetVideo) {
    props.onReorderDrag?.(movedVideo, targetVideo)
  }
}

function handleDragEnd(e: DragEvent) {
  dragFromIndex.value = null
  dragOverIndex.value = null
  const target = e.target as HTMLElement
  if (target) target.style.opacity = '1'
}
</script>

<template>
  <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
    <div v-for="i in 4" :key="i" class="rounded-lg border bg-card p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="w-full sm:w-40 aspect-video rounded-md bg-muted animate-pulse" />
        <div class="flex-1 space-y-2">
          <div class="h-5 w-2/3 rounded bg-muted animate-pulse" />
          <div class="h-3 w-1/3 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  </div>

  <div
    v-else-if="videos.length === 0"
    class="rounded-lg border border-dashed bg-muted/20 p-10 text-center"
  >
    <p class="text-muted-foreground">Sin videos todavía.</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
    <div
      v-for="(video, index) in videos"
      :key="video.id"
      class="flex min-w-0 gap-2 transition-all duration-200"
      :class="[
        dragOverIndex === index ? 'translate-y-1 scale-[1.02] ring-2 ring-primary ring-offset-2 rounded-lg' : ''
      ]"
      @dragover="(e) => onReorderDrag && handleDragOver(e, index)"
      @dragleave="handleDragLeave"
      @drop="(e) => onReorderDrag && handleDrop(e, index)"
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
          class="cursor-grab rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground active:cursor-grabbing disabled:pointer-events-none disabled:opacity-40 transition-colors"
          @dragstart="(e) => handleDragStart(e, index)"
          @dragend="handleDragEnd"
          @click.prevent.stop
        >
          <GripVertical class="size-5" />
        </button>
      </div>
      <div class="min-w-0 flex-1">
        <VideoCard :item="video" :module-id="moduleId" />
      </div>
    </div>
  </div>
</template>

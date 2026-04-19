<template>
  <div>
    <div
      role="button"
      tabindex="0"
      aria-label="Seleccionar archivo de video"
      class="border-2 border-dashed rounded-md p-6 text-center transition-colors cursor-pointer"
      :class="isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'"
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <FolderUp class="w-8 h-8 mx-auto text-muted-foreground mb-2" />
      <p class="text-sm font-medium">Arrastrá tu archivo aquí</p>
      <p class="text-xs text-muted-foreground">o hacé click para seleccionar</p>
      <p class="text-xs text-muted-foreground mt-2">
        {{ ACCEPTED_VIDEO_EXTENSIONS }} · máx 500 MB
      </p>
    </div>

    <input
      ref="inputEl"
      type="file"
      class="hidden"
      :accept="acceptAttr"
      @change="onFileInput"
    />

    <div
      v-if="modelValue"
      class="mt-2 flex items-center gap-2 rounded border bg-muted/30 px-3 py-2 text-sm"
    >
      <div class="min-w-0 flex-1">
        <div class="truncate font-medium">{{ modelValue.name }}</div>
        <div class="text-xs text-muted-foreground">{{ formatSize(modelValue.size) }}</div>
      </div>
      <button
        type="button"
        class="shrink-0 text-muted-foreground hover:text-destructive"
        aria-label="Quitar archivo"
        @click.stop="emit('update:modelValue', null)"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FolderUp, X } from 'lucide-vue-next'
import {
  ACCEPTED_VIDEO_EXTENSIONS,
  ACCEPTED_VIDEO_MIME_TYPES,
} from '../../constants/video-upload.constants'

defineProps<{ modelValue: File | null }>()
const emit = defineEmits<{ 'update:modelValue': [file: File | null] }>()

const inputEl = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const acceptAttr = ACCEPTED_VIDEO_MIME_TYPES.join(',')

function openPicker() {
  inputEl.value?.click()
}

function onFileInput(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  emit('update:modelValue', file)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0] ?? null
  emit('update:modelValue', file)
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

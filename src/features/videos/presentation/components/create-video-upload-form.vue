<template>
  <div class="space-y-3">
    <VideoFileDropzone
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>

    <div v-if="progress > 0 && progress < 100" class="space-y-1">
      <div class="flex justify-between text-xs text-muted-foreground">
        <span>Subiendo...</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="h-2 rounded bg-muted overflow-hidden">
        <div class="h-full bg-primary transition-all" :style="{ width: `${progress}%` }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoFileDropzone from './video-file-dropzone.vue'

defineProps<{ modelValue: File | null; error?: string; progress: number }>()
const emit = defineEmits<{ 'update:modelValue': [file: File | null] }>()
</script>

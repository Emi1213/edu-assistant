<template>
  <div class="space-y-3">
    <div class="space-y-1">
      <label for="video-youtube-url" class="text-sm font-medium">URL de YouTube *</label>
      <input
        id="video-youtube-url"
        :value="modelValue"
        type="url"
        class="w-full p-2 rounded border bg-background"
        placeholder="https://www.youtube.com/watch?v=..."
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string; error?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

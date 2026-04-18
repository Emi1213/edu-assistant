<template>
  <div class="space-y-1">
    <label :for="fieldId" class="text-sm font-medium">Idioma de salida</label>
    <select
      :id="fieldId"
      :value="modelValue"
      class="w-full p-2 rounded border bg-background"
      @change="onChange"
    >
      <option v-for="opt in OUTPUT_LANGUAGE_OPTIONS" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { OUTPUT_LANGUAGE_OPTIONS } from '../../constants/video-language.constants'
import type { OutputLanguage } from '../../types/video.types'

defineProps<{ modelValue: OutputLanguage }>()
const emit = defineEmits<{ 'update:modelValue': [value: OutputLanguage] }>()
const fieldId = useId()

function onChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as OutputLanguage
  emit('update:modelValue', value)
}
</script>

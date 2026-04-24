<template>
  <div class="grid gap-2">
    <Label :for="fieldId">Idioma de salida</Label>
    <Select :model-value="modelValue" @update:model-value="onUpdate">
      <SelectTrigger :id="fieldId" class="w-full">
        <SelectValue placeholder="Seleccioná un idioma" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="opt in OUTPUT_LANGUAGE_OPTIONS"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import type { AcceptableValue } from 'reka-ui'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OUTPUT_LANGUAGE_OPTIONS } from '../../constants/video-language.constants'
import type { OutputLanguage } from '../../types/video.types'

defineProps<{ modelValue: OutputLanguage }>()
const emit = defineEmits<{ 'update:modelValue': [value: OutputLanguage] }>()
const fieldId = useId()

function onUpdate(value: AcceptableValue) {
  emit('update:modelValue', value as OutputLanguage)
}
</script>

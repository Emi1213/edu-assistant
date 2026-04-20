<template>
  <Dialog :open="isOpen" @update:open="emit('update:isOpen', $event)">
    <DialogContent class="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Regenerar contenido</DialogTitle>
        <DialogDescription>
          Elegí qué regenerar y, opcionalmente, dale instrucciones a la IA.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <fieldset class="space-y-2">
          <legend class="text-sm font-medium">¿Qué querés regenerar?</legend>
          <label v-for="t in VIDEO_BLOCK_TYPES" :key="t" class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              :checked="selected.includes(t)"
              @change="toggle(t)"
            />
            {{ BLOCK_TAB_LABELS[t] }}
          </label>
        </fieldset>

        <div class="space-y-1">
          <label for="retry-instruction" class="text-sm font-medium">
            Instrucciones para la IA (opcional)
          </label>
          <textarea
            id="retry-instruction"
            v-model="instruction"
            rows="3"
            maxlength="500"
            class="w-full p-2 rounded border bg-background"
            placeholder="Ej: agregá más ejemplos con código, hacelo más conciso..."
          />
          <p class="text-xs text-muted-foreground text-right">{{ instruction.length }}/500</p>
        </div>

        <p class="text-xs text-yellow-700 bg-yellow-50 rounded p-2">
          Se guardará una copia del contenido actual antes de regenerar.
        </p>
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" :disabled="isSubmitting" @click="emit('update:isOpen', false)">
          Cancelar
        </Button>
        <Button
          type="button"
          :disabled="isSubmitting || selected.length === 0"
          @click="onSubmit"
        >
          <Loader2 v-if="isSubmitting" class="size-4 animate-spin mr-2" />
          {{ isSubmitting ? 'Regenerando...' : 'Regenerar' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'
import { VIDEO_BLOCK_TYPES } from '../../constants/video-block-type.constants'
import { BLOCK_TAB_LABELS } from '../../constants/video-labels.constants'
import type { VideoBlockType } from '../../types/video-block.types'

const props = defineProps<{
  isOpen: boolean
  preselected: VideoBlockType[]
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  submit: [payload: { contentTypes?: VideoBlockType[]; instruction?: string }]
}>()

const selected = ref<VideoBlockType[]>([...props.preselected])
const instruction = ref('')

watch(
  () => props.isOpen,
  (v) => {
    if (v) {
      selected.value = [...props.preselected]
      instruction.value = ''
    }
  },
)

function toggle(t: VideoBlockType) {
  const i = selected.value.indexOf(t)
  if (i >= 0) selected.value.splice(i, 1)
  else selected.value.push(t)
}

function onSubmit() {
  const contentTypes =
    selected.value.length === VIDEO_BLOCK_TYPES.length ? undefined : [...selected.value]
  const trimmed = instruction.value.trim()
  emit('submit', { contentTypes, instruction: trimmed || undefined })
}
</script>

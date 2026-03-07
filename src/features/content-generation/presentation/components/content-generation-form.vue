<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles, Loader2 } from 'lucide-vue-next'
import TiptapEditor from './tiptap-editor.vue'
import { useGenerateContent } from '../../composables/mutations/use-generate-content'
import type { ContentGeneration } from '../../types/content-generation.types'

interface Props {
  pageId: number
}

interface Emits {
  (e: 'contentGenerated', content: ContentGeneration): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const instructions = ref('')
const { mutate, isPending, isError, error } = useGenerateContent()

const handleGenerateContent = () => {
  if (!instructions.value.trim()) {
    return
  }

  mutate(
    {
      pageId: props.pageId,
      instructions: instructions.value,
    },
    {
      onSuccess: (data) => {
        if (data) {
          emit('contentGenerated', data)
          instructions.value = ''
        }
      },
    }
  )
}

const canGenerate = () => {
  return instructions.value.trim().length > 0 && !isPending
}
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label class="text-sm font-medium text-foreground">
        Instrucciones para generar contenido
      </label>
      <p class="text-sm text-muted-foreground">
        Describe qué tipo de contenido quieres generar para esta página. Puedes ser tan específico como desees.
      </p>
    </div>

    <TiptapEditor 
      v-model="instructions"
      placeholder="Ejemplo: Genera una introducción sobre algoritmos de ordenamiento, explicando bubble sort y quick sort con ejemplos..."
    />

    <div v-if="isError && error" class="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
      <p class="text-sm text-destructive font-medium">Error al generar contenido</p>
      <p class="text-sm text-destructive/80 mt-1">{{ error.message }}</p>
    </div>

    <div class="flex justify-end">
      <button
        @click="handleGenerateContent"
        :disabled="!canGenerate()"
        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Loader2 v-if="isPending" class="size-4 animate-spin" />
        <Sparkles v-else class="size-4" />
        <span>{{ isPending ? 'Generando...' : 'Generar Contenido' }}</span>
      </button>
    </div>
  </div>
</template>

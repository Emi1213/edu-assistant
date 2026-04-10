<script setup lang="ts">
import { Loader2, Sparkles, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { GeneratedActivityPreview } from '@/features/activities/utils/activities-create-generate.utils'
import type { ActivityType as GenActivityType } from '@/features/content-generation/types'

type GenerateFormModel = {
  type: GenActivityType
  language: string
  difficulty: number
  instructions: string
}

const generateForm = defineModel<GenerateFormModel>('generateForm', { required: true })

defineProps<{
  show: boolean
  generatedPreview: GeneratedActivityPreview | null
  isGeneratingActivity: boolean
  isCreating: boolean
  languageOptions: Array<{ value: string; label: string }>
}>()

const emit = defineEmits<{
  close: []
  generate: []
  discard: []
  save: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="bg-card rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Sparkles class="size-5 text-primary" />
            {{ generatedPreview ? 'Vista previa de la actividad' : 'Generar actividad con IA' }}
          </h2>
          <button type="button" class="text-muted-foreground hover:text-foreground" :disabled="isGeneratingActivity" @click="emit('close')">
            <X class="size-5" />
          </button>
        </div>

        <div v-if="generatedPreview" class="space-y-4">
          <div class="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
            <p class="text-sm font-medium text-muted-foreground">
              {{ generatedPreview.type === 'MULTIPLE_CHOICE' ? 'Pregunta' : generatedPreview.type === 'TRUE_FALSE' ? 'Afirmación' : generatedPreview.type === 'FILL_BLANK' ? 'Enunciado' : 'Instrucciones' }}
            </p>
            <p class="text-foreground">{{ generatedPreview.question }}</p>

            <div v-if="generatedPreview.type === 'MULTIPLE_CHOICE' && generatedPreview.options?.length" class="mt-3">
              <p class="text-sm font-medium text-muted-foreground mb-2">Opciones</p>
              <ul class="space-y-2">
                <li
                  v-for="(opt, i) in generatedPreview.options"
                  :key="i"
                  class="pl-3 py-1.5 rounded-md text-sm"
                  :class="i === generatedPreview.correctAnswer ? 'bg-primary/15 text-primary font-medium border border-primary/30' : 'bg-background border border-border'"
                >
                  <span class="text-muted-foreground mr-2">{{ String.fromCharCode(65 + i) }}.</span>
                  {{ opt }}
                  <span v-if="i === generatedPreview.correctAnswer" class="ml-2 text-xs">(correcta)</span>
                </li>
              </ul>
            </div>

            <div v-if="generatedPreview.type === 'TRUE_FALSE'" class="mt-3">
              <p class="text-sm font-medium text-muted-foreground">Respuesta correcta</p>
              <p class="text-foreground font-medium">{{ generatedPreview.correctAnswerBoolean ? 'Verdadero' : 'Falso' }}</p>
            </div>

            <div v-if="generatedPreview.type === 'FILL_BLANK'" class="mt-3 space-y-2">
              <div v-if="generatedPreview.correctAnswerText">
                <p class="text-sm font-medium text-muted-foreground">Respuesta correcta</p>
                <p class="text-foreground">{{ generatedPreview.correctAnswerText }}</p>
              </div>
              <div v-if="generatedPreview.acceptableAnswers?.length">
                <p class="text-sm font-medium text-muted-foreground">Otras aceptables</p>
                <p class="text-sm text-foreground">{{ generatedPreview.acceptableAnswers.join(', ') }}</p>
              </div>
            </div>

            <div v-if="generatedPreview.type === 'MATCH' && generatedPreview.pairs?.length" class="mt-3">
              <p class="text-sm font-medium text-muted-foreground mb-2">Parejas</p>
              <ul class="space-y-1.5 text-sm">
                <li
                  v-for="(pair, idx) in generatedPreview.pairs"
                  :key="idx"
                  class="flex items-center gap-2 py-1"
                >
                  <span class="text-foreground font-medium">{{ pair.left }}</span>
                  <span class="text-muted-foreground">→</span>
                  <span class="text-foreground">{{ pair.right }}</span>
                </li>
              </ul>
            </div>

            <div v-if="generatedPreview.explanation" class="mt-3 pt-3 border-t border-border">
              <p class="text-sm font-medium text-muted-foreground mb-1">Explicación</p>
              <p class="text-sm text-foreground">{{ generatedPreview.explanation }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 justify-end">
            <Button type="button" variant="outline" @click="emit('discard')">
              Descartar
            </Button>
            <Button :disabled="isCreating" @click="emit('save')">
              <Loader2 v-if="isCreating" class="size-4 animate-spin mr-2" />
              Guardar actividad
            </Button>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Tipo</Label>
              <select v-model="generateForm.type" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                <option value="MULTIPLE_CHOICE">Opción múltiple</option>
                <option value="TRUE_FALSE">Verdadero / Falso</option>
                <option value="FILL_BLANK">Completar espacios</option>
                <option value="MATCH">Emparejar</option>
              </select>
            </div>
            <div class="space-y-2">
              <Label>Dificultad (1-5)</Label>
              <Input v-model.number="generateForm.difficulty" type="number" min="1" max="5" />
            </div>
          </div>
          <div class="space-y-2">
            <Label>Idioma</Label>
            <select
              v-model="generateForm.language"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option
                v-for="opt in languageOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label>Instrucciones (opcional)</Label>
            <textarea
              v-model="generateForm.instructions"
              rows="2"
              class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              placeholder="Ej: Que sea sobre el ejemplo de código del final."
            />
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" :disabled="isGeneratingActivity" @click="emit('close')">Cancelar</Button>
            <Button :disabled="isGeneratingActivity" @click="emit('generate')">
              <Loader2 v-if="isGeneratingActivity" class="size-4 animate-spin mr-2" />
              {{ isGeneratingActivity ? 'Generando...' : 'Generar' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Loader2, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type {
  Activity,
  ActivityType,
  ActivityOptionsByType,
  MultipleChoiceActivityOptions,
  TrueFalseActivityOptions,
  FillBlankActivityOptions,
  MatchActivityOptions,
} from '@/features/activities/types'
import { getDefaultOptionsForType } from '@/features/activities/constants/activity.constants'

type EditFormShape = {
  activityId?: number
  type: ActivityType
  question: string
  options: ActivityOptionsByType
  explanation?: string
  difficulty: number
  isApprovedByTeacher: boolean
  usedAsExample: boolean
}

const editForm = defineModel<EditFormShape>('editForm', { required: true })

defineProps<{
  show: boolean
  activityToEdit: Activity | null
  isUpdating: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show && activityToEdit"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="bg-card rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">Editar actividad</h2>
          <button type="button" class="text-muted-foreground hover:text-foreground" :disabled="isUpdating" @click="emit('close')">
            <X class="size-5" />
          </button>
        </div>
        <form class="space-y-4" @submit.prevent="emit('submit')">
          <div class="space-y-2">
            <Label>Tipo</Label>
            <select
              v-model="editForm.type"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              @change="editForm.options = getDefaultOptionsForType(editForm.type)"
            >
              <option value="MULTIPLE_CHOICE">Opción múltiple</option>
              <option value="TRUE_FALSE">Verdadero / Falso</option>
              <option value="FILL_BLANK">Completar espacios</option>
              <option value="MATCH">Emparejar</option>
            </select>
          </div>
          <div class="space-y-2">
            <Label>Pregunta / Enunciado</Label>
            <textarea
              v-model="editForm.question"
              rows="2"
              class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              placeholder="Ej: ¿La respiración celular ocurre en las mitocondrias?"
            />
          </div>
          <template v-if="editForm.type === 'MULTIPLE_CHOICE' && editForm.options && 'options' in editForm.options">
            <div class="space-y-2">
              <Label>Opciones (indica cuál es la correcta abajo)</Label>
              <div class="space-y-2">
                <Input
                  v-for="(_, i) in (editForm.options as MultipleChoiceActivityOptions).options"
                  :key="i"
                  v-model="(editForm.options as MultipleChoiceActivityOptions).options[i]"
                  :placeholder="`Opción ${i + 1}`"
                />
              </div>
              <div class="flex items-center gap-2 mt-2">
                <Label class="text-sm">Correcta:</Label>
                <select
                  v-model.number="(editForm.options as MultipleChoiceActivityOptions).correctAnswer"
                  class="flex h-9 rounded-md border border-input bg-transparent px-2 text-sm"
                >
                  <option v-for="(_, i) in (editForm.options as MultipleChoiceActivityOptions).options" :key="i" :value="i">{{ i + 1 }}</option>
                </select>
              </div>
            </div>
          </template>
          <template v-else-if="editForm.type === 'TRUE_FALSE' && editForm.options && 'correctAnswer' in editForm.options">
            <div class="space-y-2">
              <Label>Respuesta correcta</Label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" :value="true" v-model="(editForm.options as TrueFalseActivityOptions).correctAnswer" />
                  <span>Verdadero</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" :value="false" v-model="(editForm.options as TrueFalseActivityOptions).correctAnswer" />
                  <span>Falso</span>
                </label>
              </div>
            </div>
          </template>
          <template v-else-if="editForm.type === 'FILL_BLANK' && editForm.options">
            <div class="space-y-2">
              <Label>Respuestas correctas (una por línea o separadas por coma)</Label>
              <textarea
                :value="(editForm.options as FillBlankActivityOptions).correctAnswers?.join('\n') ?? ''"
                @input="(e: Event) => { const o = editForm.options as FillBlankActivityOptions; if (!o.correctAnswers) o.correctAnswers = []; o.correctAnswers = (e.target as HTMLTextAreaElement).value.split(/[\n,]/).map(s => s.trim()).filter(Boolean) }"
                rows="3"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="respuesta1&#10;respuesta2"
              />
            </div>
          </template>
          <template v-else-if="editForm.type === 'MATCH' && editForm.options">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Columna izquierda (una por línea)</Label>
                <textarea
                  :value="(editForm.options as MatchActivityOptions).leftItems?.join('\n') ?? ''"
                  @input="(e: Event) => { const o = editForm.options as MatchActivityOptions; o.leftItems = (e.target as HTMLTextAreaElement).value.split('\n').map(s => s.trim()).filter(Boolean) }"
                  rows="4"
                  class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div class="space-y-2">
                <Label>Columna derecha (una por línea, mismo orden correcto)</Label>
                <textarea
                  :value="(editForm.options as MatchActivityOptions).rightItems?.join('\n') ?? ''"
                  @input="(e: Event) => { const o = editForm.options as MatchActivityOptions; o.rightItems = (e.target as HTMLTextAreaElement).value.split('\n').map(s => s.trim()).filter(Boolean) }"
                  rows="4"
                  class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                />
              </div>
            </div>
          </template>
          <div class="space-y-2">
            <Label>Explicación (opcional)</Label>
            <textarea
              v-model="editForm.explanation"
              rows="2"
              class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              placeholder="Ej: Ocurre principalmente en la mitocondria."
            />
          </div>
          <div class="space-y-2">
            <Label>Dificultad (1-5)</Label>
            <Input v-model.number="editForm.difficulty" type="number" min="1" max="5" />
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="editForm.isApprovedByTeacher" type="checkbox" class="rounded border-input" />
              <span class="text-sm">Aprobada por profesor</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="editForm.usedAsExample" type="checkbox" class="rounded border-input" />
              <span class="text-sm">Usar como ejemplo</span>
            </label>
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" :disabled="isUpdating" @click="emit('close')">Cancelar</Button>
            <Button type="submit" :disabled="isUpdating">
              <Loader2 v-if="isUpdating" class="size-4 animate-spin mr-2" />
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

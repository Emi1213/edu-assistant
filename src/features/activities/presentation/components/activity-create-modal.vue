<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type {
  CreateActivityPayload,
  CreateActivityMultipleChoiceDto,
  CreateActivityTrueFalseDto,
  CreateActivityFillBlankDto,
  CreateActivityMatchDto,
} from '@/features/activities/types'

const createForm = defineModel<CreateActivityPayload>('createForm', { required: true })

defineProps<{
  show: boolean
  matchColumnLeft: string
  matchColumnRight: string
  isCreating: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: []
  typeChange: []
  'update:matchColumnLeft': [value: string]
  'update:matchColumnRight': [value: string]
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="bg-card rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">Crear actividad</h2>
          <button type="button" class="text-muted-foreground hover:text-foreground" @click="emit('close')">
            <X class="size-5" />
          </button>
        </div>
        <form class="space-y-4" @submit.prevent="emit('submit')">
          <div class="space-y-2">
            <Label>Tipo</Label>
            <select
              v-model="createForm.type"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              @change="emit('typeChange')"
            >
              <option value="MULTIPLE_CHOICE">Opción múltiple</option>
              <option value="TRUE_FALSE">Verdadero / Falso</option>
              <option value="FILL_BLANK">Completar espacios</option>
              <option value="MATCH">Emparejar</option>
            </select>
          </div>

          <template v-if="createForm.type === 'MULTIPLE_CHOICE'">
            <div class="space-y-2">
              <Label>Pregunta</Label>
              <textarea
                v-model="(createForm.options as CreateActivityMultipleChoiceDto).question"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Ej: ¿Cuál es la mejor definición de X?"
              />
            </div>
            <div class="space-y-2">
              <Label>Cuatro opciones</Label>
              <div class="space-y-2">
                <Input
                  v-for="i in 4"
                  :key="i"
                  v-model="(createForm.options as CreateActivityMultipleChoiceDto).options[i - 1]"
                  :placeholder="`Opción ${i}`"
                />
              </div>
              <div class="flex items-center gap-2 mt-2">
                <Label class="text-sm">Correcta (1-4):</Label>
                <select
                  v-model.number="(createForm.options as CreateActivityMultipleChoiceDto).correctAnswer"
                  class="flex h-9 rounded-md border border-input bg-transparent px-2 text-sm"
                >
                  <option v-for="j in 4" :key="j" :value="j - 1">{{ j }}</option>
                </select>
              </div>
            </div>
            <div class="space-y-2">
              <Label>Explicación</Label>
              <textarea
                v-model="(createForm.options as CreateActivityMultipleChoiceDto).explanation"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Por qué esa opción es la correcta"
              />
            </div>
          </template>

          <template v-else-if="createForm.type === 'TRUE_FALSE'">
            <div class="space-y-2">
              <Label>Afirmación</Label>
              <textarea
                v-model="(createForm.options as CreateActivityTrueFalseDto).statement"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Ej: El ADN es una doble hélice."
              />
            </div>
            <div class="space-y-2">
              <Label>Respuesta correcta</Label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" :value="true" v-model="(createForm.options as CreateActivityTrueFalseDto).correctAnswer" />
                  <span>Verdadero</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" :value="false" v-model="(createForm.options as CreateActivityTrueFalseDto).correctAnswer" />
                  <span>Falso</span>
                </label>
              </div>
            </div>
            <div class="space-y-2">
              <Label>Explicación</Label>
              <textarea
                v-model="(createForm.options as CreateActivityTrueFalseDto).explanation"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Por qué es verdadero o falso"
              />
            </div>
          </template>

          <template v-else-if="createForm.type === 'FILL_BLANK'">
            <div class="space-y-2">
              <Label>Enunciado (usa ___ para el hueco)</Label>
              <textarea
                v-model="(createForm.options as CreateActivityFillBlankDto).sentence"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Ej: La ___ es responsable de producir ATP."
              />
            </div>
            <div class="space-y-2">
              <Label>Respuesta correcta</Label>
              <Input
                v-model="(createForm.options as CreateActivityFillBlankDto).correctAnswer"
                placeholder="Ej: mitocondria"
              />
            </div>
            <div class="space-y-2">
              <Label>Respuestas aceptables (1-3 variaciones, una por línea)</Label>
              <textarea
                :value="(createForm.options as CreateActivityFillBlankDto).acceptableAnswers.join('\n')"
                rows="3"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="mitocondria&#10;mitochondria"
                @input="
                  (e: Event) => {
                    const o = createForm.options as CreateActivityFillBlankDto
                    o.acceptableAnswers = (e.target as HTMLTextAreaElement).value
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .slice(0, 3)
                  }
                "
              />
            </div>
            <div class="space-y-2">
              <Label>Explicación</Label>
              <textarea
                v-model="(createForm.options as CreateActivityFillBlankDto).explanation"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              />
            </div>
          </template>

          <template v-else-if="createForm.type === 'MATCH'">
            <div class="space-y-2">
              <Label>Instrucciones</Label>
              <textarea
                v-model="(createForm.options as CreateActivityMatchDto).instructions"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Ej: Relaciona cada término con su definición"
              />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Columna izquierda (una por línea)</Label>
                <textarea
                  :value="matchColumnLeft"
                  rows="5"
                  class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono"
                  @input="emit('update:matchColumnLeft', ($event.target as HTMLTextAreaElement).value)"
                />
              </div>
              <div class="space-y-2">
                <Label>Columna derecha (una por línea, mismo orden)</Label>
                <textarea
                  :value="matchColumnRight"
                  rows="5"
                  class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono"
                  @input="emit('update:matchColumnRight', ($event.target as HTMLTextAreaElement).value)"
                />
              </div>
            </div>
            <div class="space-y-2">
              <Label>Explicación (opcional)</Label>
              <textarea
                v-model="(createForm.options as CreateActivityMatchDto).explanation"
                rows="2"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              />
            </div>
          </template>
          <div class="space-y-2">
            <Label>Dificultad (1-5)</Label>
            <Input v-model.number="createForm.difficulty" type="number" min="1" max="5" />
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" @click="emit('close')">Cancelar</Button>
            <Button type="submit" :disabled="isCreating">{{ isCreating ? 'Creando...' : 'Crear' }}</Button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

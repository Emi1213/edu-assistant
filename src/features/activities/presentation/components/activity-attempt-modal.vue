<script setup lang="ts">
import { Loader2, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type {
  Activity,
  ActivityAttemptResponse,
  MatchActivityOptions,
  MultipleChoiceActivityOptions,
} from '@/features/activities/types'
import { getActivityTypeLabel } from '@/features/activities/constants/activity.constants'

type AttemptAnswerModel = {
  selectedOption?: number
  answer?: boolean
  fillAnswer?: string
  matchPairs?: [number, number][]
}

const attemptAnswer = defineModel<AttemptAnswerModel>('attemptAnswer', { required: true })

defineProps<{
  show: boolean
  activityToAttempt: Activity | null
  attemptResult: ActivityAttemptResponse | null
  isSubmittingAttempt: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show && activityToAttempt"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div
        class="bg-card rounded-xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-6"
        :class="activityToAttempt?.type === 'MATCH' ? 'max-w-5xl' : 'max-w-2xl'"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">Realizar actividad</h2>
          <button type="button" class="text-muted-foreground hover:text-foreground" :disabled="isSubmittingAttempt" @click="emit('close')">
            <X class="size-5" />
          </button>
        </div>
        <p class="text-sm text-muted-foreground mb-2">{{ getActivityTypeLabel(activityToAttempt.type) }}</p>
        <p class="font-medium text-foreground mb-4">{{ activityToAttempt.question }}</p>

        <div v-if="!attemptResult" class="space-y-4">
          <div v-if="activityToAttempt.type === 'MULTIPLE_CHOICE' && activityToAttempt.options && 'options' in activityToAttempt.options" class="space-y-2">
            <Label>Elige una opción</Label>
            <ul class="space-y-2">
              <li
                v-for="(opt, i) in (activityToAttempt.options as MultipleChoiceActivityOptions).options"
                :key="i"
                class="flex items-center gap-2"
              >
                <input
                  :id="`opt-${activityToAttempt.id}-${i}`"
                  v-model="attemptAnswer.selectedOption"
                  type="radio"
                  :value="i"
                  :name="`mc-option-${activityToAttempt.id}`"
                />
                <label :for="`opt-${activityToAttempt.id}-${i}`" class="cursor-pointer text-sm">{{ opt }}</label>
              </li>
            </ul>
          </div>
          <div v-else-if="activityToAttempt.type === 'TRUE_FALSE'" class="space-y-2">
            <Label>Verdadero o Falso</Label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="attemptAnswer.answer" type="radio" :value="true" :name="`tf-option-${activityToAttempt.id}`" />
                <span>Verdadero</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="attemptAnswer.answer" type="radio" :value="false" :name="`tf-option-${activityToAttempt.id}`" />
                <span>Falso</span>
              </label>
            </div>
          </div>
          <div v-else-if="activityToAttempt.type === 'FILL_BLANK'" class="space-y-2">
            <Label>Tu respuesta</Label>
            <Input v-model="attemptAnswer.fillAnswer" placeholder="Escribe la palabra o frase" />
          </div>
          <div v-else-if="activityToAttempt.type === 'MATCH' && activityToAttempt.options && 'leftItems' in activityToAttempt.options" class="space-y-3">
            <Label>Empareja cada elemento</Label>
            <div
              v-for="(left, idx) in (activityToAttempt.options as MatchActivityOptions).leftItems"
              :key="idx"
              class="flex items-center gap-3 min-w-0"
            >
              <span class="text-sm font-medium min-w-0 flex-1 shrink-0 max-w-[45%] break-words">{{ left }}</span>
              <span class="text-muted-foreground shrink-0">→</span>
              <select
                :value="(attemptAnswer.matchPairs || [])[idx]?.[1] ?? 0"
                class="flex h-9 min-w-0 flex-1 max-w-[45%] rounded-md border border-input bg-transparent px-2 text-sm"
                @change="(e) => {
                  const rightIdx = Number((e.target as HTMLSelectElement).value)
                  if (!attemptAnswer.matchPairs) return
                  const next = [...attemptAnswer.matchPairs]
                  next[idx] = [idx, rightIdx]
                  attemptAnswer.matchPairs = next
                }"
              >
                <option v-for="(right, ri) in (activityToAttempt.options as MatchActivityOptions).rightItems" :key="ri" :value="ri">
                  {{ right }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" :disabled="isSubmittingAttempt" @click="emit('close')">Cancelar</Button>
            <Button :disabled="isSubmittingAttempt" @click="emit('submit')">
              <Loader2 v-if="isSubmittingAttempt" class="size-4 animate-spin mr-2" />
              Enviar respuesta
            </Button>
          </div>
        </div>

        <div v-else-if="attemptResult" class="space-y-4">
          <div
            class="p-4 rounded-lg border"
            :class="attemptResult.isCorrect ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-destructive/10 border-destructive/30 text-destructive'"
          >
            <p class="font-medium">{{ attemptResult.isCorrect ? '¡Correcto!' : 'Incorrecto' }}</p>
            <p class="text-sm opacity-90">Intento {{ attemptResult.attemptNumber }}</p>
          </div>
          <div v-if="typeof activityToAttempt.explanation === 'string' && activityToAttempt.explanation" class="text-sm text-muted-foreground border-t pt-3">
            {{ activityToAttempt.explanation }}
          </div>
          <div class="flex justify-end">
            <Button @click="emit('close')">Cerrar</Button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

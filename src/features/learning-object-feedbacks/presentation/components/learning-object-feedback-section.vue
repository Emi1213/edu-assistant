<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLearningObjectFeedback } from '../../composables/use-learning-object-feedback'
import { MessageSquare, User as UserIcon, Send } from 'lucide-vue-next'
import { useRoles } from '@/features/auth/composables/use-roles'
import { formatLongDate } from '@/shared/utils/date.utils'
import type { LearningObjectFeedback } from '../../types/learning-object-feedbacks.types'

interface Props {
  learningObjectId: number
  feedbacks?: LearningObjectFeedback[]
}

const props = defineProps<Props>()
const { canEdit } = useRoles()
const isProfessor = computed(() => canEdit())

const isFormVisible = ref(false)
const { comment, isPending, handleSubmit } = useLearningObjectFeedback(props.learningObjectId)

const onSendFeedback = async () => {
  await handleSubmit()
  isFormVisible.value = false
}
</script>

<template>
  <div class="learning-object-feedback-section space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-foreground flex items-center gap-2">
        {{ isProfessor ? 'Feedbacks de los estudiantes' : 'Feedback del contenido' }}
        <span v-if="isProfessor && feedbacks?.length" class="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">{{ feedbacks.length }}</span>
      </h3>
      
      <button
        v-if="!isFormVisible && !isProfessor"
        @click="isFormVisible = true"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm"
      >
        <MessageSquare class="size-4" />
        Agregar feedback
      </button>
    </div>

    <!-- Feedback Form (Only for students) -->
    <div v-if="isFormVisible && !isProfessor" class="rounded-lg border border-primary/20 bg-primary/5 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div class="space-y-4">
        <label class="text-sm font-medium text-foreground">Tu comentario</label>
        <textarea
          v-model="comment"
          placeholder="¿Qué te pareció este objeto de aprendizaje? Tus sugerencias nos ayudan a mejorar..."
          class="w-full min-h-[120px] p-4 rounded-lg border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all resize-none"
        />
        
        <div class="flex justify-end gap-3">
          <button
            @click="isFormVisible = false"
            class="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="onSendFeedback"
            :disabled="isPending || !comment.trim()"
            class="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Send v-if="!isPending" class="size-4" />
            <span v-else class="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
            Enviar
          </button>
        </div>
      </div>
    </div>

    <!-- Feedback List (ONLY FOR TEACHERS) -->
    <div v-if="isProfessor && feedbacks && feedbacks.length > 0" class="grid gap-4">
      <div 
        v-for="f in feedbacks" 
        :key="f.id" 
        class="p-4 rounded-lg border border-border bg-card/50 flex flex-col gap-3"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserIcon class="size-4" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-foreground">
                {{ f.user?.name }} {{ f.user?.lastName }}
              </span>
              <span class="text-xs text-muted-foreground">
                {{ formatLongDate(f.createdAt) }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="text-sm text-foreground whitespace-pre-wrap leading-relaxed italic">
          {{ f.feedback }}
        </div>
      </div>
    </div>
    
    <div v-else-if="isProfessor && feedbacks" class="text-center py-8 rounded-lg border border-dashed border-border bg-muted/10 text-muted-foreground text-sm italic">
      Aún no hay feedback de estudiantes para este contenido.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, ChevronRight, MessageSquare, BookOpen, AlertCircle } from 'lucide-vue-next'
import type { TeacherFeedback } from '../../types/teacher-feedback.types'
import { TeacherFeedbackScope } from '../../types/teacher-feedback.types'

interface Props {
  feedback: TeacherFeedback
  loTitle?: string
}

const props = defineProps<Props>()
defineEmits<{
  (e: 'view-detail', feedback: TeacherFeedback): void
}>()

const formattedDate = computed(() => {
  if (!props.feedback?.createdAt) return 'Fecha no disponible'
  
  const date = new Date(props.feedback.createdAt)
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) return 'Fecha inválida'
  
  try {
    return new Intl.DateTimeFormat('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }).format(date)
  } catch {
    return 'Error en formato'
  }
})

const isModuleScope = computed(() => props.feedback?.scope === TeacherFeedbackScope.MODULE)

const priorityCounts = computed(() => {
  const content = props.feedback?.content
  if (!content) return { high: 0, medium: 0, low: 0 }
  
  const items = [
    ...(content.strengths || []),
    ...(content.improvements || []),
    ...(content.recommendations || []),
  ]
  
  return {
    high: items.filter(i => i.priority === 'HIGH').length,
    medium: items.filter(i => i.priority === 'MEDIUM').length,
    low: items.filter(i => i.priority === 'LOW').length,
  }
})
</script>

<template>
  <div 
    v-if="feedback"
    class="group relative bg-card hover:bg-accent/50 border border-border rounded-xl p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
    @click="$emit('view-detail', feedback)"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-3 flex-1 min-w-0">
        <!-- Header: Scope and Date -->
        <div class="flex flex-wrap items-center gap-2">
          <div v-if="isModuleScope" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <BookOpen class="size-3 mr-1" />
            Módulo
          </div>
          <div v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            <MessageSquare class="size-3 mr-1" />
            Objeto de Aprendizaje
          </div>
          
          <div class="flex items-center text-xs text-muted-foreground ml-1 capitalize">
            <Calendar class="size-3 mr-1" />
            {{ formattedDate }}
          </div>
        </div>

        <!-- Summary -->
        <div v-if="feedback.content">
          <h3 class="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            <template v-if="isModuleScope">Feedback General del Módulo</template>
            <template v-else-if="loTitle">Feedback: {{ loTitle }}</template>
            <template v-else>Feedback de Objeto de Aprendizaje</template>
          </h3>
          <p class="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {{ feedback.content.summary }}
          </p>
        </div>

        <!-- Metrics/Badges -->
        <div v-if="feedback.content" class="flex items-center gap-3 pt-1">
          <div v-if="priorityCounts.high > 0" class="flex items-center text-xs font-medium text-destructive">
            <AlertCircle class="size-3 mr-1" />
            {{ priorityCounts.high }} Críticos
          </div>
          <div class="flex items-center text-xs text-muted-foreground">
            <span class="size-1.5 rounded-full bg-blue-500 mr-1.5"></span>
            {{ feedback.content.strengths?.length || 0 }} Fortalezas
          </div>
          <div class="flex items-center text-xs text-muted-foreground">
            <span class="size-1.5 rounded-full bg-amber-500 mr-1.5"></span>
            {{ feedback.content.improvements?.length || 0 }} Mejoras
          </div>
        </div>
      </div>

      <div class="shrink-0 self-center">
        <div class="size-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          <ChevronRight class="size-5" />
        </div>
      </div>
    </div>
  </div>
</template>

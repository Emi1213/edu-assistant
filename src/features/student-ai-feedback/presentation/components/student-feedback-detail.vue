<script setup lang="ts">
import { computed } from 'vue'
import { 
  CheckCircle2, 
  Lightbulb, 
  AlertTriangle,
  Info,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-vue-next'
import type { StudentFeedback, StudentAiFeedbackItem } from '../../types/student-ai-feedback.types'

interface Props {
  feedback: StudentFeedback
}

const props = defineProps<Props>()

const formattedDate = computed(() => {
  if (!props.feedback?.createdAt) return 'Fecha no disponible'
  const date = new Date(props.feedback.createdAt)
  if (isNaN(date.getTime())) return 'Fecha inválida'
  
  return new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  }).format(date)
})

const getPriorityColor = (priority: StudentAiFeedbackItem['priority']) => {
  switch (priority) {
    case 'HIGH': return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'LOW': return 'bg-blue-100 text-blue-700 border-blue-200'
    default: return 'bg-muted text-muted-foreground'
  }
}

const getPriorityLabel = (priority: StudentAiFeedbackItem['priority']) => {
  switch (priority) {
    case 'HIGH': return 'Alta Prioridad'
    case 'MEDIUM': return 'Prioridad Media'
    case 'LOW': return 'Baja Prioridad'
    default: return priority
  }
}
</script>

<template>
  <div v-if="feedback" class="h-full flex flex-col bg-background">
    <!-- Header -->
    <div class="p-6 border-b border-border bg-muted/30">
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
          <TrendingUp class="size-4 mr-2" />
          Mi Progreso Personal
        </div>
      </div>

      <h2 class="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
        Tu Feedback Pedagógico
        <Award class="size-6 text-amber-500" />
      </h2>
      
      <div class="flex items-center text-sm text-muted-foreground capitalize">
        <Calendar class="size-4 mr-2" />
        Analizado el {{ formattedDate }}
      </div>
    </div>

    <div v-if="feedback.content" class="flex-1 overflow-y-auto">
      <div class="p-6 space-y-8 pb-12">
        <!-- Summary Section -->
        <section class="space-y-3">
          <div class="flex items-center gap-2 text-primary">
            <Info class="size-5" />
            <h3 class="font-bold text-lg">Resumen de tu semana</h3>
          </div>
          <div class="bg-primary/5 border border-primary/10 rounded-xl p-5 text-foreground leading-relaxed text-sm">
            {{ feedback.content.summary }}
          </div>
        </section>

        <!-- Strengths Section -->
        <section v-if="feedback.content.strengths?.length" class="space-y-4">
          <div class="flex items-center gap-2 text-green-600">
            <CheckCircle2 class="size-5" />
            <h3 class="font-bold text-lg">Tus Fortalezas</h3>
          </div>
          <div class="grid gap-4">
            <div 
              v-for="(item, index) in feedback.content.strengths" 
              :key="index"
              class="bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <div class="flex items-start justify-between gap-3 mb-2">
                <h4 class="font-bold text-foreground text-sm">{{ item.topic }}</h4>
                <div :class="[getPriorityColor(item.priority), 'px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider font-bold shrink-0']">
                  {{ getPriorityLabel(item.priority) }}
                </div>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ item.detail }}</p>
            </div>
          </div>
        </section>

        <!-- Improvements Section -->
        <section v-if="feedback.content.improvements?.length" class="space-y-4">
          <div class="flex items-center gap-2 text-amber-600">
            <AlertTriangle class="size-5" />
            <h3 class="font-bold text-lg">Tus Desafíos</h3>
          </div>
          <div class="grid gap-4">
            <div 
              v-for="(item, index) in feedback.content.improvements" 
              :key="index"
              class="bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <div class="flex items-start justify-between gap-3 mb-2">
                <h4 class="font-bold text-foreground text-sm">{{ item.topic }}</h4>
                <div :class="[getPriorityColor(item.priority), 'px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider font-bold shrink-0']">
                  {{ getPriorityLabel(item.priority) }}
                </div>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ item.detail }}</p>
            </div>
          </div>
        </section>

        <!-- Recommendations Section -->
        <section v-if="feedback.content.recommendations?.length" class="space-y-4">
          <div class="flex items-center gap-2 text-blue-600">
            <Lightbulb class="size-5" />
            <h3 class="font-bold text-lg">Consejos para vos</h3>
          </div>
          <div class="grid gap-4">
            <div 
              v-for="(item, index) in feedback.content.recommendations" 
              :key="index"
              class="bg-blue-50/50 border border-blue-100 rounded-xl p-4"
            >
              <div class="flex items-start justify-between gap-3 mb-2">
                <h4 class="font-bold text-blue-900 text-sm">{{ item.topic }}</h4>
                <div :class="[getPriorityColor(item.priority), 'px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider font-bold shrink-0']">
                  {{ getPriorityLabel(item.priority) }}
                </div>
              </div>
              <p class="text-xs text-blue-800/80 leading-relaxed">{{ item.detail }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

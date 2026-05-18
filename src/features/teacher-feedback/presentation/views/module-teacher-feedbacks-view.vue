<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  MessageSquare,
  Search,
  LayoutGrid,
  History,
  Info,
  AlertCircle
} from 'lucide-vue-next'
import { useTeacherFeedbacks } from '../../composables/queries/use-teacher-feedbacks'
import { useGenerateTeacherFeedback } from '../../composables/mutations/use-generate-teacher-feedback'
import { useLearningObjects } from '@/features/learning-objects/composables/queries/use-learning-objects'
import { TeacherFeedbackScope } from '../../types/teacher-feedback.types'
import TeacherFeedbackItem from '../components/teacher-feedback-item.vue'
import TeacherFeedbackDetail from '../components/teacher-feedback-detail.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import type { TeacherFeedback } from '../../types/teacher-feedback.types'
import type { LearningObject } from '@/features/learning-objects/types/learning-object.types'

const route = useRoute()
const router = useRouter()
const moduleId = computed(() => Number(route.params.id))

const activeScope = ref<TeacherFeedbackScope | 'ALL'>('ALL')
const searchQuery = ref('')

const queryParams = computed(() => {
  if (activeScope.value === 'ALL') return {}
  return { scope: activeScope.value as TeacherFeedbackScope }
})

const { data: feedbacks, isLoading, isError } = useTeacherFeedbacks(moduleId, queryParams)
const { mutate: generateFeedback, isPending: isGenerating } = useGenerateTeacherFeedback(moduleId.value)

// Fetch LOs to get titles
const { data: learningObjects } = useLearningObjects(computed(() => ({ moduleId: moduleId.value })))

const loTitlesMap = computed(() => {
  const map: Record<number, string> = {}
  if (!learningObjects.value) return map
  
  const los = (Array.isArray(learningObjects.value) 
    ? learningObjects.value 
    : (learningObjects.value as { records: LearningObject[] }).records || []) as LearningObject[]
    
  los.forEach((lo) => {
    if (lo && lo.id) map[lo.id] = lo.title
  })
  return map
})

const selectedFeedback = ref<TeacherFeedback | null>(null)
const isSheetOpen = ref(false)

const openDetail = (feedback: TeacherFeedback) => {
  if (!feedback) return
  selectedFeedback.value = feedback
  isSheetOpen.value = true
}

const filteredFeedbacks = computed(() => {
  if (!feedbacks.value || !Array.isArray(feedbacks.value)) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  
  return feedbacks.value.filter(f => {
    if (!f || !f.content) return false
    
    // Si no hay query, pasa el filtro
    if (!query) return true
    
    const summaryMatch = (f.content.summary || '').toLowerCase().includes(query)
    const strengthsMatch = (f.content.strengths || []).some(s => (s.topic || '').toLowerCase().includes(query))
    const improvementsMatch = (f.content.improvements || []).some(i => (i.topic || '').toLowerCase().includes(query))
    
    return summaryMatch || strengthsMatch || improvementsMatch
  })
})

const goBack = () => {
  router.push({ name: 'module-wiki', params: { id: moduleId.value } })
}
</script>

<template>
  <div class="space-y-6 pt-4 sm:pt-8 min-w-0 pb-12">
    <!-- Header Navigation -->
    <div class="flex items-center justify-between gap-4">
      <Button variant="ghost" @click="goBack" class="gap-2">
        <ArrowLeft class="size-4" />
        Volver al Módulo
      </Button>

      <Button 
        variant="default" 
        @click="generateFeedback()" 
        :disabled="isGenerating"
        class="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg transition-all duration-300"
      >
        <Sparkles v-if="!isGenerating" class="size-4 mr-2" />
        <span v-else class="size-4 mr-2 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full"></span>
        {{ isGenerating ? 'Generando...' : 'Generar Nuevo Feedback' }}
      </Button>
    </div>

    <!-- Title and Description -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
        Feedbacks Pedagógicos
        <div class="inline-flex items-center px-2 py-0.5 rounded border border-border text-xs font-normal bg-muted/50">IA Assistant</div>
      </h1>
      <p class="text-muted-foreground max-w-2xl">
        Analizamos la interacción de tus estudiantes con los contenidos y el chat para ofrecerte puntos clave de mejora y fortalezas de tu módulo.
      </p>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      <div class="flex p-1 bg-muted rounded-lg w-full md:w-auto">
        <button 
          @click="activeScope = 'ALL'"
          :class="[
            'flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2',
            activeScope === 'ALL' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          ]"
        >
          <LayoutGrid class="size-3.5" />
          Todos
        </button>
        <button 
          @click="activeScope = TeacherFeedbackScope.MODULE"
          :class="[
            'flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2',
            activeScope === TeacherFeedbackScope.MODULE ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          ]"
        >
          <BookOpen class="size-3.5" />
          Módulo
        </button>
        <button 
          @click="activeScope = TeacherFeedbackScope.LEARNING_OBJECT"
          :class="[
            'flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2',
            activeScope === TeacherFeedbackScope.LEARNING_OBJECT ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          ]"
        >
          <MessageSquare class="size-3.5" />
          Objetos
        </button>
      </div>

      <div class="relative w-full md:w-72">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input 
          v-model="searchQuery" 
          placeholder="Buscar en el feedback..." 
          class="pl-9 bg-muted/50 border-none focus-visible:ring-1"
        />
      </div>
    </div>

    <!-- Feedback List -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 4" :key="i" class="h-40 rounded-xl border border-border bg-card/50 p-5 animate-pulse">
        <div class="flex gap-4 mb-4">
          <Skeleton class="h-5 w-20 rounded" />
          <Skeleton class="h-5 w-32 rounded" />
        </div>
        <Skeleton class="h-6 w-3/4 mb-3" />
        <Skeleton class="h-4 w-full" />
      </div>
    </div>

    <div v-else-if="isError" class="py-12 text-center">
      <div class="max-w-md mx-auto p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
        <AlertCircle class="size-5 shrink-0" />
        No pudimos cargar los feedbacks. Por favor, intenta de nuevo más tarde.
      </div>
    </div>

    <div v-else-if="filteredFeedbacks.length === 0" class="py-20 text-center bg-card rounded-2xl border border-dashed border-border">
      <div class="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <History class="size-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-semibold text-foreground mb-1">No hay feedbacks disponibles</h3>
      <p class="text-muted-foreground max-w-xs mx-auto mb-6">
        Aún no se ha generado feedback para este módulo o con los filtros seleccionados.
      </p>
      <Button variant="outline" @click="generateFeedback()" :disabled="isGenerating">
        Solicitar primera generación
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TeacherFeedbackItem 
        v-for="feedback in filteredFeedbacks" 
        :key="feedback.id" 
        :feedback="feedback"
        :lo-title="feedback.learningObjectId ? loTitlesMap[feedback.learningObjectId] : undefined"
        @view-detail="openDetail"
      />
    </div>

    <!-- Info Banner -->
    <div v-if="filteredFeedbacks.length > 0" class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
      <Info class="size-5 text-blue-600 shrink-0 mt-0.5" />
      <div class="text-sm text-blue-800">
        <p class="font-semibold mb-0.5">Sobre el feedback semanal</p>
        <p>Los reportes se generan automáticamente cada semana basándose en la actividad acumulada, pero puedes solicitar una generación manual en cualquier momento.</p>
      </div>
    </div>

    <!-- Detail Sheet -->
    <Sheet :open="isSheetOpen" @update:open="isSheetOpen = $event">
      <SheetContent side="right" class="w-full sm:max-w-xl p-0">
        <TeacherFeedbackDetail v-if="selectedFeedback" :feedback="selectedFeedback" />
      </SheetContent>
    </Sheet>
  </div>
</template>

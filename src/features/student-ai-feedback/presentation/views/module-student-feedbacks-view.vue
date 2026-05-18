<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Sparkles, 
  Search,
  History,
  Info,
  AlertCircle
} from 'lucide-vue-next'
import { useStudentFeedbacks } from '../../composables/queries/use-student-feedbacks'
import { useGenerateStudentFeedback } from '../../composables/mutations/use-generate-student-feedback'
import StudentFeedbackItem from '../components/student-feedback-item.vue'
import StudentFeedbackDetail from '../components/student-feedback-detail.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import type { StudentFeedback } from '../../types/student-ai-feedback.types'

const route = useRoute()
const router = useRouter()
const moduleId = computed(() => Number(route.params.id))

const searchQuery = ref('')

const { data: feedbacks, isLoading, isError } = useStudentFeedbacks(moduleId)
const { mutate: generateFeedback, isPending: isGenerating } = useGenerateStudentFeedback(moduleId.value)

const selectedFeedback = ref<StudentFeedback | null>(null)
const isSheetOpen = ref(false)

const openDetail = (feedback: StudentFeedback) => {
  if (!feedback) return
  selectedFeedback.value = feedback
  isSheetOpen.value = true
}

const filteredFeedbacks = computed(() => {
  if (!feedbacks.value || !Array.isArray(feedbacks.value)) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  
  return feedbacks.value.filter(f => {
    if (!f || !f.content) return false
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
        class="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:shadow-lg transition-all duration-300"
      >
        <Sparkles v-if="!isGenerating" class="size-4 mr-2" />
        <span v-else class="size-4 mr-2 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full"></span>
        {{ isGenerating ? 'Generando...' : 'Analizar mi Progreso' }}
      </Button>
    </div>

    <!-- Title and Description -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
        Mi Feedback IA
        <div class="inline-flex items-center px-2 py-0.5 rounded border border-border text-xs font-normal bg-muted/50">Personal</div>
      </h1>
      <p class="text-muted-foreground max-w-2xl">
        Revisamos tus actividades, chats y participación para darte consejos personalizados sobre cómo mejorar en este módulo.
      </p>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
      <div class="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <History class="size-4" />
        Historial de análisis
      </div>

      <div class="relative w-full md:w-72">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input 
          v-model="searchQuery" 
          placeholder="Buscar en mis reportes..." 
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
        No pudimos cargar tus reportes. Por favor, intenta de nuevo más tarde.
      </div>
    </div>

    <div v-else-if="filteredFeedbacks.length === 0" class="py-20 text-center bg-card rounded-2xl border border-dashed border-border">
      <div class="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles class="size-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-semibold text-foreground mb-1">Aún no tenés reportes</h3>
      <p class="text-muted-foreground max-w-xs mx-auto mb-6">
        Pedile a la IA que analice tu progreso para recibir tus primeros consejos personalizados.
      </p>
      <Button variant="outline" @click="generateFeedback()" :disabled="isGenerating">
        Generar mi primer análisis
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StudentFeedbackItem 
        v-for="feedback in filteredFeedbacks" 
        :key="feedback.id" 
        :feedback="feedback"
        @view-detail="openDetail"
      />
    </div>

    <!-- Info Banner -->
    <div v-if="filteredFeedbacks.length > 0" class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
      <Info class="size-5 text-indigo-600 shrink-0 mt-0.5" />
      <div class="text-sm text-indigo-800">
        <p class="font-semibold mb-0.5">Sobre tu feedback personal</p>
        <p>Estos reportes son privados y solo vos podés verlos. Se basan en tu actividad real dentro de la plataforma para ayudarte a estudiar mejor.</p>
      </div>
    </div>

    <!-- Detail Sheet -->
    <Sheet :open="isSheetOpen" @update:open="isSheetOpen = $event">
      <SheetContent side="right" class="w-full sm:max-w-xl p-0">
        <StudentFeedbackDetail v-if="selectedFeedback" :feedback="selectedFeedback" />
      </SheetContent>
    </Sheet>
  </div>
</template>

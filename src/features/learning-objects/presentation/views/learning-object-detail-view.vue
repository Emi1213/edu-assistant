<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MessageSquare,
  MessageCircleQuestion,
  ClipboardList,
  Bot,
} from 'lucide-vue-next'
import { useLearningObject } from '../../composables/queries/use-learning-object'
import { useRoles } from '@/features/auth/composables/use-roles'
import { useAuthStore } from '@/features/auth/context/auth-store'
import PageContentRenderer from '../components/learning-object-content-renderer.vue'
import NotesPanel from '@/features/notes/presentation/components/notes-panel.vue'
import LearningObjectFeedbackSection from '@/features/learning-object-feedbacks/presentation/components/learning-object-feedback-section.vue'
import StudentQuestionsPanel from '@/features/student-questions/presentation/components/student-questions-panel.vue';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { Button } from '@/components/ui/button'
import { MODULES_ROUTES_NAMES } from '@/features/modules/routes/modules-routes'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import ChatPanel from '@/features/chat/presentation/components/chat-panel.vue'
import { useCreateChatSession } from '@/features/chat/composables/mutations/use-create-chat-session'
import { Loader2, X } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const learningObjectId = computed(() => Number(route.params.learningObjectId))
const moduleId = computed(() => Number(route.params.id))

const { data: learningObject, isLoading } = useLearningObject(learningObjectId)
const { canEdit, isStudent } = useRoles()
const authStore = useAuthStore()

const isChatOpen = ref(false)
const chatSessionId = ref<number | null>(null)
const { mutate: createChatSession, isPending: isStartingSession } = useCreateChatSession(learningObjectId)

const pageNotes = computed(() => {
  if (!learningObject.value) return []
  return learningObject.value.notes ?? []
})

const pageStudentQuestions = computed(() => {
  if (!learningObject.value) return []
  return learningObject.value.studentQuestions ?? []
})

const isProfessor = computed(() => canEdit())

const loFeedbacks = computed(() => {
  if (!learningObject.value) return []
  return learningObject.value.loFeedbacks ?? []
})

const userFeedback = computed(() => {
  const feedbacksValue = loFeedbacks.value
  if (!feedbacksValue || !Array.isArray(feedbacksValue)) return null
  return feedbacksValue.find(f => f.user?.id === authStore.user?.id) || null
})

const goBack = () => {
  router.push({
    name: MODULES_ROUTES_NAMES.MODULE_WIKI,
    params: { id: moduleId.value },
  })
}

const goToEditor = () => {
  router.push({
    name: MODULES_ROUTES_NAMES.LEARNING_OBJECT_EDIT,
    params: { id: moduleId.value, learningObjectId: learningObjectId.value },
  })
}

const goToActivities = () => {
  router.push({
    name: MODULES_ROUTES_NAMES.LEARNING_OBJECT_ACTIVITIES,
    params: { id: moduleId.value, learningObjectId: learningObjectId.value },
  })
}

const goToChat = () => {
  isChatOpen.value = true
  if (!chatSessionId.value) {
    createChatSession({}, {
      onSuccess: (session) => {
        if (session) chatSessionId.value = session.id
      }
    })
  }
}

const hasAdjacentNavigation = computed(() => {
  const lo = learningObject.value
  if (!lo) return false
  return lo.previousLoId != null || lo.nextLoId != null
})

const goToLearningObject = (targetId: number) => {
  if (!Number.isFinite(targetId) || targetId <= 0 || !route.name) return
  router.push({
    name: route.name,
    params: { ...route.params, learningObjectId: String(targetId) },
  })
}


const scrollToFeedback = () => {
  const feedbackSection = document.getElementById('feedback-section')
  if (feedbackSection) {
    feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const scrollToQuestions = () => {
  const questionsSection = document.getElementById('questions-section')
  if (questionsSection) {
    questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="space-y-6 pt-4 sm:pt-8 min-w-0">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <button
        @click="goBack"
        class="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md transition-all duration-200 w-full sm:w-auto"
      >
        <ArrowLeft class="size-4 shrink-0" />
        <span>Volver al módulo</span>
      </button>

      <button
        v-if="!isLoading && learningObject && canEdit()"
        @click="goToEditor"
        class="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-md w-full sm:w-auto"
      >
        <Edit3 class="size-4" />
        <span>Editar con IA</span>
      </button>
    </div>

    <div
      v-if="!isLoading && learningObject && isProfessor && hasAdjacentNavigation"
      class="grid w-full grid-cols-2 items-center gap-3"
      role="navigation"
      aria-label="Navegación entre páginas del módulo"
    >
      <div class="flex min-w-0 justify-start">
        <Button
          v-if="learningObject.previousLoId != null"
          variant="outline"
          class="gap-2 max-w-full"
          @click="goToLearningObject(learningObject.previousLoId)"
        >
          <ChevronLeft class="size-4 shrink-0" />
          <span class="truncate">Anterior</span>
        </Button>
      </div>
      <div class="flex min-w-0 justify-end">
        <Button
          v-if="learningObject.nextLoId != null"
          variant="outline"
          class="gap-2 max-w-full"
          @click="goToLearningObject(learningObject.nextLoId)"
        >
          <span class="truncate">Siguiente</span>
          <ChevronRight class="size-4 shrink-0" />
        </Button>
      </div>
    </div>

    <div v-if="isLoading" class="space-y-4">
      <Skeleton class="h-10 w-3/4" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-2/3" />
    </div>

    <div
      v-else-if="learningObject"
      :key="learningObject.id"
      class="flex flex-col lg:flex-row gap-0 min-w-0"
    >
      <div class="flex-1 min-w-0 overflow-x-auto">
        <div class="wiki-page">
          <div class="page-header">
            <h1 class="page-title text-xl sm:text-2xl lg:text-3xl break-words">
              {{ learningObject.title }}
            </h1>
            <div v-if="learningObject.keywords && learningObject.keywords.length > 0" class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="keyword in learningObject.keywords"
                :key="keyword"
                class="keyword-badge"
              >
                {{ keyword }}
              </span>
            </div>
            
            <div class="mt-4 flex flex-wrap gap-2">
              <button
                v-if="isStudent"
                @click="goToChat"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Bot class="size-4" />
                <span>Chat con IA</span>
              </button>

              <button
                @click="scrollToFeedback"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-all duration-200"
              >
                <MessageSquare class="size-4" />
                <span v-if="isStudent">{{ userFeedback ? 'Ver tu feedback' : 'Agregar feedback' }}</span>
                <span v-else>Ver feedbacks</span>
              </button>
              <button
                @click="scrollToQuestions"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-all duration-200"
              >
                <MessageCircleQuestion class="size-4" />
                <span>Ver preguntas</span>
              </button>
            </div>
          </div>

          <div class="page-content-wrapper">
            <PageContentRenderer :learning-object="learningObject" />
          </div>

          <div v-if="learningObject" class="mt-6 pt-6 border-t border-border">
            <Button variant="outline" class="gap-2" @click="goToActivities">
              <ClipboardList class="size-4" />
              Ver actividades
            </Button>
          </div>

          <div v-if="learningObject" id="feedback-section" class="mt-6 pt-6 border-t border-border">
            <LearningObjectFeedbackSection :learning-object-id="learningObject.id" :feedbacks="loFeedbacks" />
          </div>
          <div v-if="learningObject" id="questions-section" class="mt-6 pt-6 border-t border-border">
            <StudentQuestionsPanel
              :learning-object-id="learningObject.id"
              :student-questions="pageStudentQuestions"
              :is-professor="isProfessor"
              embedded
            />
          </div>
        </div>
      </div>

      <div v-if="isStudent && learningObject" class="notes-sidebar-wrapper">
        <NotesPanel :learning-object-id="learningObject.id" :notes="pageNotes" />
      </div>

    </div>

    <div v-else class="rounded-md bg-card px-6 py-12 text-center">
      <p class="text-muted-foreground">Objeto de aprendizaje no encontrado</p>
    </div>

    <Sheet :open="isChatOpen" @update:open="isChatOpen = $event">
      <SheetContent side="right" class="w-[400px] sm:w-[540px] p-0">
        <div v-if="isStartingSession" class="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
          <Loader2 class="size-10 text-primary animate-spin" />
          <p class="text-muted-foreground font-medium">Iniciando sesión con el asistente...</p>
        </div>
        <ChatPanel 
          v-else-if="chatSessionId" 
          :session-id="chatSessionId"
          @close="isChatOpen = false" 
        />
        <div v-else class="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div class="size-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
            <X class="size-6" />
          </div>
          <p class="text-muted-foreground">No se pudo iniciar la sesión de chat. Intenta de nuevo.</p>
          <Button variant="outline" @click="goToChat">Reintentar</Button>
        </div>
      </SheetContent>
    </Sheet>

  </div>
</template>

<style scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-content-area {
  flex: 1;
  min-width: 0;
}

.notes-sidebar-wrapper {
  width: 100%;
  order: 2;
  margin-top: 1rem;
}

@media (min-width: 1024px) {
  .page-layout {
    flex-direction: row;
    gap: 0;
  }
  
  .page-content-area {
    order: 1;
  }
  
  .notes-sidebar-wrapper {
    flex-shrink: 0;
    width: 400px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    position: sticky;
    top: 100px;
    transition: width 0.3s ease, min-width 0.3s ease;
    order: 2;
    margin-top: 0;
  }
  
  .notes-sidebar-wrapper:has(.collapsed) {
    width: 70px;
    min-width: 70px;
  }
}

.wiki-page {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

@media (min-width: 768px) {
  .wiki-page {
    padding: 0 1rem;
  }
}

@media (min-width: 1024px) {
  .wiki-page {
    max-width: 100%;
    padding: 0 2rem;
  }
  
  .wiki-page.with-sidebar {
    max-width: 900px;
  }
}

.page-header {
  background-color: var(--card);
  padding: 2rem 2rem 1.5rem;
  border-radius: 0;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 3rem;
  line-height: 1.2;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 0;
  letter-spacing: -0.02em;
}

.keyword-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background-color: var(--muted);
  color: var(--muted-foreground);
  transition: all 0.2s ease;
}

.keyword-badge:hover {
  background-color: var(--accent);
}

.page-content-wrapper {
  background-color: transparent;
  padding: 0 1rem 0.5rem;
}

.page-content {
  color: var(--foreground);
}

.page-content :deep(h1) {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--foreground);
}

.page-content :deep(h2) {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--foreground);
}

.page-content :deep(h3) {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.page-content :deep(h4) {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.page-content :deep(p) {
  font-size: 1rem;
  line-height: 1.75rem;
  margin-bottom: 1rem;
  color: var(--foreground);
  opacity: 0.9;
}

.page-content :deep(ul),
.page-content :deep(ol) {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
}

.page-content :deep(ul) {
  list-style-type: disc;
}

.page-content :deep(ol) {
  list-style-type: decimal;
}

.page-content :deep(li) {
  font-size: 1rem;
  color: var(--foreground);
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.page-content :deep(code) {
  background-color: var(--muted);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  color: var(--foreground);
}

.page-content :deep(pre) {
  background-color: var(--muted);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.page-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.page-content :deep(blockquote) {
  border-left: 4px solid #233a83;
  padding-left: 1rem;
  font-style: italic;
  margin: 1rem 0;
  color: var(--muted-foreground);
}

.page-content :deep(a) {
  color: #233a83;
  text-decoration: underline;
}

.page-content :deep(a:hover) {
  text-decoration: underline;
}

.dark .page-content :deep(a) {
  color: #9fb3ff;
}

.page-content :deep(strong) {
  font-weight: 700;
  color: var(--foreground);
}

.page-content :deep(em) {
  font-style: italic;
}

.page-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.page-content :deep(th),
.page-content :deep(td) {
  border: 1px solid var(--border);
  padding: 0.5rem;
  text-align: left;
}

.page-content :deep(th) {
  background-color: var(--muted);
  font-weight: 600;
}

.page-content :deep(img) {
  max-width: 100%;
  width: auto;
  height: auto;
  max-height: 360px;
  object-fit: contain;
  border-radius: 0.5rem;
  margin: 1rem auto;
  display: block;
}
</style>

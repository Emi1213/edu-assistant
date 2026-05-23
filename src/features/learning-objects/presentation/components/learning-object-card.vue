<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { LearningObject } from '../../types'
import { FileText, Zap, Clock, Link2, Pencil, Bot, CheckCircle2, Circle } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoles } from '@/features/auth/composables/use-roles'
import { useLoProgress } from '../../composables/use-lo-progress'

const props = defineProps<{
  learningObject: LearningObject
  to?: RouteLocationRaw
  generatingRelationsLearningObjectId?: number | null
  isPublishing?: boolean
  onClick?: (learningObject: LearningObject) => void
  onGenerateRelations?: (learningObject: LearningObject) => void
  onUpdateLearningObject?: (learningObject: LearningObject) => void
  onPublishNow?: (learningObject: LearningObject) => void
  onChat?: (learningObject: LearningObject) => void
}>()

const { isStudent, isAdmin } = useRoles()

// A user should see progress if they are a student OR if they are a teacher/admin BUT NOT the owner
// In this context, if onChat is provided but NOT edit actions, they are likely in student mode
const showProgress = computed(() => {
  if (isStudent.value) return true
  // If it's a teacher/admin, only show progress if they are NOT in a position to edit (meaning they are likely enrolled)
  return !props.onUpdateLearningObject && !props.onGenerateRelations && !isAdmin.value
})

const { isVisited: isVisitedFromQuery, isLoading: isLoadingProgress } = useLoProgress(computed(() => props.learningObject.id))

const isGeneratingRelations = computed(
  () => props.generatingRelationsLearningObjectId != null && props.generatingRelationsLearningObjectId === props.learningObject.id
)

const isVisited = computed(() => isVisitedFromQuery.value)
</script>


<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    class="group block bg-card hover:bg-accent/50 border border-border hover:border-primary/50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg"
    @click="onClick?.(learningObject)"
  >
    <div class="flex items-start gap-4">
      <div class="mt-1 flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 relative">
        <FileText class="size-5" />
        <div v-if="showProgress && isVisited" class="absolute -top-1 -right-1 bg-background rounded-full p-0.5 shadow-sm border border-border">
          <CheckCircle2 class="size-3.5 text-green-500 fill-green-500/10" />
        </div>
      </div>
      
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {{ learningObject.title }}
          </h3>
          <span
            v-if="learningObject.isPublished"
            class="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 uppercase tracking-wider border border-green-500/20"
          >
            Publicado
          </span>
          <span
            v-else
            class="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-wider border border-amber-500/20"
          >
            Borrador
          </span>
        </div>

        <p class="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[2.5rem]">
          {{ learningObject.keywords?.join(', ') || 'Sin palabras clave' }}
        </p>

        <div class="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/50">
          <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock class="size-3.5" />
            <span>{{ new Date(learningObject.createdAt).toLocaleDateString() }}</span>
          </div>
          
          <div v-if="learningObject.studentQuestions?.length" class="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link2 class="size-3.5" />
            <span>{{ learningObject.studentQuestions.length }} preguntas</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="onGenerateRelations || onUpdateLearningObject || onPublishNow || onChat" class="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border/50">
      <div v-if="showProgress" class="flex items-center gap-2">
        <div v-if="isLoadingProgress" class="w-20 h-6 bg-muted animate-pulse rounded-md"></div>
        <template v-else>
          <span v-if="isVisited" class="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold bg-green-500/10 text-green-600 rounded-md border border-green-500/20">
            <CheckCircle2 class="size-3" />
            VISITADO
          </span>
          <span v-else class="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold bg-orange-500/10 text-orange-600 rounded-md border border-orange-500/20">
            <Circle class="size-3" />
            POR VISITAR
          </span>
        </template>
      </div>

      <button
        v-if="onChat"
        @click.prevent.stop="onChat(learningObject)"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
        title="Consultar con IA"
      >
        <Bot class="size-3.5" />
        Chat con IA
      </button>

      <button
        v-if="!learningObject.isPublished && onPublishNow"
        @click.prevent.stop="onPublishNow(learningObject)"
        :disabled="isPublishing"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-all border border-green-500/20 disabled:opacity-50"
        title="Publicar para estudiantes"
      >
        <div v-if="isPublishing" class="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        <Zap v-else class="size-3.5" />
        Publicar
      </button>

      <button
        v-if="onGenerateRelations"
        @click.prevent.stop="onGenerateRelations(learningObject)"
        :disabled="isGeneratingRelations"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
        title="Generar relaciones con otros temas"
      >
        <div v-if="isGeneratingRelations" class="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        <Zap v-else class="size-3.5" />
        {{ isGeneratingRelations ? 'Procesando...' : 'Relaciones' }}
      </button>

      <button
        v-if="onUpdateLearningObject"
        @click.prevent.stop="onUpdateLearningObject(learningObject)"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Editar detalles"
      >
        <Pencil class="size-3.5" />
        Editar
      </button>
    </div>
  </component>
</template>

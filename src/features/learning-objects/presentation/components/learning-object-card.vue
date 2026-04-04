<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { LearningObject } from '../../types'
import { FileText, Zap, Clock, Link2, Pencil, Loader2 } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  learningObject: LearningObject
  to?: RouteLocationRaw
  generatingRelationsLearningObjectId?: number | null
  isPublishing?: boolean
  onClick?: (learningObject: LearningObject) => void
  onGenerateRelations?: (learningObject: LearningObject) => void
  onUpdateLearningObject?: (learningObject: LearningObject) => void
  onPublishNow?: (learningObject: LearningObject) => void
}>()


const isGeneratingRelations = computed(
  () => props.generatingRelationsLearningObjectId != null && props.generatingRelationsLearningObjectId === props.learningObject.id
)
</script>

<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    class="group block bg-card hover:bg-accent/50 border border-border hover:border-primary/50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg"
    @click="onClick?.(learningObject)"
  >
    <div class="flex items-start gap-4">
      <div class="mt-1 flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        <FileText class="size-5" />
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

    <div v-if="onGenerateRelations || onUpdateLearningObject || onPublishNow" class="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border/50">
      <button
        v-if="!learningObject.isPublished && onPublishNow"
        @click.prevent.stop="onPublishNow(learningObject)"
        :disabled="isPublishing"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-all border border-green-500/20 disabled:opacity-50"
        title="Publicar para estudiantes"
      >
        <Loader2 v-if="isPublishing" class="size-3.5 animate-spin" />
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
        <Loader2 v-if="isGeneratingRelations" class="size-3.5 animate-spin" />
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

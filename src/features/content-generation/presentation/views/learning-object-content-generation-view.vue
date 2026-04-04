<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, FileText } from 'lucide-vue-next'
import { useLearningObject } from '@/features/learning-objects/composables/queries/use-learning-object'
import ContentGenerationForm from '../components/content-generation-form.vue'
import GeneratedContentDisplay from '../components/generated-content-display.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import type { ContentGeneration } from '../../types'

const route = useRoute()
const router = useRouter()
const learningObjectId = computed(() => Number(route.params.learningObjectId))
const moduleId = computed(() => Number(route.params.id))

const { data: learningObject, isLoading } = useLearningObject(learningObjectId.value)

const generatedContent = ref<ContentGeneration | null>(null)

const goBack = () => {
  router.push(`/modules/${moduleId.value}/learning-objects/${learningObjectId.value}`)
}

const handleContentGenerated = (content: ContentGeneration) => {
  generatedContent.value = content
}
</script>

<template>
  <div class="space-y-6 min-w-0">
    <button
      @click="goBack"
      class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto"
    >
      <ArrowLeft class="size-4 shrink-0" />
      <span>Volver al objeto de aprendizaje</span>
    </button>

    <div v-if="isLoading" class="space-y-4">
      <Skeleton class="h-10 w-3/4" />
      <Skeleton class="h-32 w-full" />
    </div>

    <div v-else-if="learningObject" class="space-y-6 sm:space-y-8">
      <!-- Learning Object Info -->
      <div class="rounded-lg border border-border bg-card p-4 sm:p-6 min-w-0">
        <div class="flex flex-col sm:flex-row sm:items-start gap-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText class="size-6 text-primary" />
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold text-foreground mb-2 break-words">
              Generar Contenido para: {{ learningObject.title }}
            </h1>
            <p class="text-sm text-muted-foreground">
              Usa el editor a continuación para proporcionar instrucciones sobre qué tipo de contenido deseas generar para este objeto de aprendizaje.
            </p>
          </div>
        </div>
      </div>

      <!-- Content Generation Form -->
      <div class="rounded-lg border border-border bg-card p-4 sm:p-6 min-w-0">
        <ContentGenerationForm
          :learning-object-id="learningObjectId"
          @content-generated="handleContentGenerated"
        />
      </div>

      <!-- Generated Content Display -->
      <div v-if="generatedContent" class="rounded-lg border border-border bg-card p-4 sm:p-6 min-w-0 overflow-x-auto">
        <div class="mb-6">
          <h2 class="text-lg sm:text-xl font-bold text-foreground mb-2">Contenido Generado</h2>
          <p class="text-sm text-muted-foreground">
            Revisa el contenido generado a continuación. Puedes copiarlo o modificarlo según necesites.
          </p>
        </div>
        
        <GeneratedContentDisplay :content="generatedContent" />
      </div>
    </div>

    <div v-else class="rounded-md bg-card px-6 py-12 text-center">
      <p class="text-muted-foreground">Objeto de aprendizaje no encontrado</p>
    </div>
  </div>
</template>

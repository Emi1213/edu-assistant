<script setup lang="ts">
import { ref } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import { ArrowLeft, Sparkles, Loader2, X, Save, BookOpen, Image } from 'lucide-vue-next'
import { useLearningObjectEditorView } from '../../composables/editor/use-page-editor-view'
import { usePageEditorConceptModal } from '../../composables/editor/use-page-editor-concept-modal'
import { usePageEditorPageLinkModal } from '../../composables/editor/use-page-editor-page-link-modal'
import { usePageEditorImageModal } from '../../composables/editor/use-page-editor-image-modal'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useConceptDefinitionHoverTooltip } from '../../composables/use-concept-definition-hover-tooltip'
import ConceptDefinitionHoverLayer from '../components/concept-definition-hover-layer.vue'
import EditorToolbar from '../components/editor-toolbar.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const {
  learningObjectId,
  moduleId,
  isLoadingLearningObject,
  editor,
  isSaving,
  learningObjectTitle,
  learningObjectKeywords,
  goBack,
  saveContent,
  showAIModal,
  aiInstructions,
  openAIModal,
  closeAIModal,
  handleGenerateContent,
  handleKeyDown,
  isGenerating,
  generationError,
  handleGenerateConcepts,
  isExtractingConcepts,
} = useLearningObjectEditorView()

const {
  showConceptModal,
  conceptForm,
  openConceptModal,
  closeConceptModal,
  submitConcept,
  isCreatingConcept,
} = usePageEditorConceptModal(learningObjectId.value, editor)

const {
  showPageLinkModal,
  pageLinkForm,
  modulePages,
  openPageLinkModal,
  closePageLinkModal,
  submitPageLink,
} = usePageEditorPageLinkModal(editor, learningObjectId, moduleId)

const {
  showImagePromptModal,
  imagePrompt,
  openImagePromptModal,
  closeImagePromptModal,
  handleGenerateImageFromPrompt,
  isGeneratingImage,
} = usePageEditorImageModal(editor)

const conceptHoverRoot = ref<HTMLElement | null>(null)
const { visible: conceptTooltipVisible, text: conceptTooltipText, style: conceptTooltipStyle } =
  useConceptDefinitionHoverTooltip(conceptHoverRoot)
</script>

<template>
  <div class="page-editor-view h-screen flex flex-col bg-background pt-4 sm:pt-8 min-w-0">
    <div class="border-b border-border bg-card px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-7xl mx-auto">
        <button
          @click="goBack"
          class="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md transition-all duration-200 w-full sm:w-auto order-2 sm:order-1"
        >
          <ArrowLeft class="size-4 shrink-0" />
          <span>Volver al objeto de aprendizaje</span>
        </button>

        <div class="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 order-1 sm:order-2">
          <button
            @click="openAIModal"
            :disabled="isGenerating"
            class="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <Loader2 v-if="isGenerating" class="size-4 animate-spin" />
            <Sparkles v-else class="size-4" />
            <span>{{ isGenerating ? 'Generando...' : 'Generar con IA' }}</span>
          </button>

          <button
            @click="handleGenerateConcepts"
            :disabled="isExtractingConcepts"
            type="button"
            class="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-lg font-medium transition-all duration-200 hover:bg-muted/80 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <Loader2 v-if="isExtractingConcepts" class="size-4 animate-spin" />
            <BookOpen v-else class="size-4" />
            <span>{{ isExtractingConcepts ? 'Generando...' : 'Generar conceptos' }}</span>
          </button>

          <button
            @click="saveContent"
            :disabled="isSaving"
            class="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-lg font-medium transition-all duration-200 hover:bg-muted/80 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <Loader2 v-if="isSaving" class="size-4 animate-spin" />
            <Save v-else class="size-4" />
            <span class="hidden sm:inline">{{ isSaving ? 'Guardando...' : 'Guardar' }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoadingLearningObject" class="flex-1 overflow-y-auto min-w-0">
      <div class="px-4 sm:px-6 py-6 sm:py-8 space-y-4">
        <Skeleton class="h-12 w-3/4" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-2/3" />
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
      <TooltipProvider>
        <div class="editor-page-wrapper min-w-0">
          <div class="editor-toolbar-wrapper">
          <EditorToolbar
            :editor="editor"
            :on-insert-concept="openConceptModal"
            :on-insert-page-link="openPageLinkModal"
            :on-insert-image="openImagePromptModal"
          />
        </div>

        <div class="editor-main-container">
          <div class="page-header-editor">
            <h1 class="page-title-input">
              <input
                v-model="learningObjectTitle"
                type="text"
                placeholder="Título del objeto de aprendizaje"
                class="w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
              />
            </h1>

            <div v-if="learningObjectKeywords.length > 0" class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="(keyword, index) in learningObjectKeywords"
                :key="index"
                class="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary"
              >
                {{ keyword }}
                <button
                  @click="learningObjectKeywords.splice(index, 1)"
                  class="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                >
                  <X class="size-3" />
                </button>
              </span>
            </div>
          </div>

          <div ref="conceptHoverRoot" class="editor-content">
            <EditorContent :editor="editor" />
            <ConceptDefinitionHoverLayer
              :visible="conceptTooltipVisible"
              :text="conceptTooltipText"
              :overlay-style="conceptTooltipStyle"
            />
          </div>
        </div>
        </div>
      </TooltipProvider>
    </div>

    <Teleport to="body">
      <div
        v-if="showAIModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeAIModal"
      >
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6 animate-scale-in">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles class="size-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-foreground mb-2">
                Generar Contenido con IA
              </h2>
              <p class="text-sm text-muted-foreground">
                Describe qué contenido necesitas y la IA lo generará para ti. El contenido se insertará en tu editor.
              </p>
            </div>
            <button
              @click="closeAIModal"
              :disabled="isGenerating"
              class="flex-shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <X class="size-6" />
            </button>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-foreground mb-2">
              Instrucciones para la IA
            </label>
            <textarea
              id="ai-instructions-input"
              v-model="aiInstructions"
              @keydown="handleKeyDown"
              :disabled="isGenerating"
              placeholder="Ejemplo: Genera una explicación detallada sobre algoritmos de ordenamiento, incluyendo bubble sort y quick sort con ejemplos de código..."
              class="w-full min-h-[160px] p-4 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div v-if="isGenerating" class="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div class="flex items-center gap-3">
              <Loader2 class="size-5 text-primary animate-spin" />
              <div class="flex-1">
                <p class="text-sm font-medium text-primary">Generando contenido...</p>
                <p class="text-xs text-muted-foreground mt-1">
                  La IA está procesando tu solicitud. Esto puede tardar hasta un minuto.
                </p>
              </div>
            </div>
          </div>

          <div v-if="generationError" class="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p class="text-sm font-medium text-destructive">{{ generationError }}</p>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-xs text-muted-foreground">
              {{ isGenerating ? 'Generando contenido, por favor espera...' : 'Presiona Enter para generar, Shift+Enter para nueva línea' }}
            </p>
            <div class="flex gap-3">
              <button
                @click="closeAIModal"
                :disabled="isGenerating"
                class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="handleGenerateContent"
                :disabled="isGenerating || !aiInstructions.trim()"
                class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="isGenerating" class="size-4 animate-spin" />
                <Sparkles v-else class="size-4" />
                <span>{{ isGenerating ? 'Generando...' : 'Generar' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modals -->
    <Teleport to="body">
      <!-- Concept Modal -->
      <div v-if="showConceptModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-scale-in">
          <h3 class="text-xl font-bold mb-4">Añadir Concepto</h3>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium mb-1">Término</label>
              <input v-model="conceptForm.term" class="w-full p-2 rounded border bg-background" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Definición</label>
              <textarea v-model="conceptForm.definition" class="w-full p-2 rounded border bg-background min-h-[100px]" />
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button @click="closeConceptModal" class="px-4 py-2 text-muted-foreground hover:bg-muted/50 rounded">Cancelar</button>
            <button
              @click="submitConcept"
              :disabled="isCreatingConcept || !conceptForm.term || !conceptForm.definition"
              class="px-4 py-2 bg-primary text-primary-foreground rounded flex items-center gap-2 disabled:opacity-50"
            >
              <Loader2 v-if="isCreatingConcept" class="size-4 animate-spin" />
              Guardar
            </button>
          </div>
        </div>
      </div>

      <!-- Page Link Modal -->
      <div v-if="showPageLinkModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-scale-in">
          <h3 class="text-xl font-bold mb-4">Enlazar Objeto de Aprendizaje</h3>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium mb-1">Texto a mostrar</label>
              <input v-model="pageLinkForm.mentionText" class="w-full p-2 rounded border bg-background" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Seleccionar objeto</label>
              <select v-model="pageLinkForm.targetPageId" class="w-full p-2 rounded border bg-background">
                <option :value="null">Seleccionar...</option>
                <option v-for="p in modulePages" :key="p.id" :value="p.id">
                  {{ p.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button @click="closePageLinkModal" class="px-4 py-2 text-muted-foreground hover:bg-muted/50 rounded">Cancelar</button>
            <button
              @click="submitPageLink"
              :disabled="!pageLinkForm.mentionText || !pageLinkForm.targetPageId"
              class="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            >
              Enlazar
            </button>
          </div>
        </div>
      </div>

      <!-- Image Generation Modal -->
      <div v-if="showImagePromptModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6 animate-scale-in">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Image class="size-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-foreground mb-2">Generar Imagen</h2>
              <p class="text-sm text-muted-foreground">La IA generará una imagen personalizada para este bloque.</p>
            </div>
            <button @click="closeImagePromptModal" class="text-muted-foreground hover:text-foreground"><X class="size-6" /></button>
          </div>
          <textarea
            v-model="imagePrompt"
            placeholder="Describe la imagen que deseas..."
            class="w-full min-h-[120px] p-4 rounded-lg border-2 border-border bg-background mb-6 resize-none focus:outline-none focus:border-primary"
          />
          <div v-if="isGeneratingImage" class="mb-6 flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <Loader2 class="size-5 text-primary animate-spin" />
            <p class="text-sm font-medium text-primary">Generando imagen...</p>
          </div>
          <div class="flex justify-end gap-3">
            <button @click="closeImagePromptModal" class="px-4 py-2 text-muted-foreground hover:bg-muted/50 rounded">Cancelar</button>
            <button
              @click="handleGenerateImageFromPrompt"
              :disabled="isGeneratingImage || !imagePrompt.trim()"
              class="px-4 py-2 bg-primary text-primary-foreground rounded flex items-center gap-2 disabled:opacity-50"
            >
              <Loader2 v-if="isGeneratingImage" class="size-4 animate-spin" />
              Generar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-editor-view {
  max-width: 100%;
}

.editor-page-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
}

.editor-toolbar-wrapper {
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 30;
  background-color: var(--background);
  padding-top: 1rem;
}

.editor-main-container {
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.page-header-editor {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.page-title-input {
  font-size: 2.5rem;
  line-height: 1.2;
  font-weight: 700;
  margin: 0;
}

.editor-content {
  min-height: 400px;
  position: relative;
}

.editor-content :deep(.ProseMirror) {
  outline: none;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--foreground);
}

.editor-content :deep(.ProseMirror p) {
  margin-bottom: 1rem;
}

.editor-content :deep(.ProseMirror h1) {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

.editor-content :deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

@keyframes scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out forwards;
}
</style>

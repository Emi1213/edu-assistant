<script setup lang="ts">
import { computed, ref } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  X,
  Save,
  BookOpen,
  Image,
  Zap,
  Wand2,
} from 'lucide-vue-next'
import { useLearningObjectEditorView } from '../../composables/editor/use-learning-object-editor-view'
import { useLearningObjectEditorConceptModal } from '../../composables/editor/use-learning-object-editor-concept-modal'
import { useLearningObjectEditorExternalLinkModal } from '../../composables/editor/use-learning-object-editor-external-link-modal'
import { useLearningObjectEditorImageModal } from '../../composables/editor/use-learning-object-editor-image-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useConceptDefinitionHoverTooltip } from '../../composables/use-concept-definition-hover-tooltip'
import ConceptDefinitionHoverLayer from '../components/concept-definition-hover-layer.vue'
import RegenerateContentModal from '../components/RegenerateContentModal.vue'
import EditorToolbar from '../components/editor-toolbar.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import LearningObjectLinkModal from '../components/learning-object-link-modal.vue'

import { Eye, EyeOff } from 'lucide-vue-next'
import LearningObjectDetailView from './learning-object-detail-view.vue'

const {
  learningObjectId,
  moduleId,
  learningObject,
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
  handleRegenerateContent,
  showRegenerateModal,
  isRegenerating,
  isGenerating,
  generationError,
  handleGenerateConcepts,
  isExtractingConcepts,
  handleGenerateRelations,
  isExtractingRelations,
} = useLearningObjectEditorView()

const isPreviewMode = ref(false)

const previewData = computed(() => {
  const base = learningObject.value || {
    id: learningObjectId.value,
    moduleId: moduleId.value,
    title: '',
    keywords: [],
    content: '',
    blocks: [],
    previousLoId: null,
    nextLoId: null,
    chatSessionId: null,
    isPublished: false,
    orderIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return {
    ...base,
    title: learningObjectTitle.value,
    keywords: [...learningObjectKeywords.value],
    content: editor.value?.getJSON() || '',
    blocks: [], 
  }
})
const {
  showConceptModal,
  conceptForm,
  openConceptModal,
  openConceptModalForEditAtPos,
  closeConceptModal,
  submitConcept,
  isCreatingConcept,
  generateConceptDefinitionWithAi,
  isGeneratingConceptDefinition,
  isEditingConcept,
} = useLearningObjectEditorConceptModal(learningObjectId, editor, learningObject)

const isAnyAiActionLoading = computed(
  () =>
    isGenerating.value ||
    isExtractingConcepts.value ||
    isExtractingRelations.value ||
    isGeneratingConceptDefinition.value,
)
const currentAiActionLabel = computed(() => {
  if (isGenerating.value) return 'Generando contenido...'
  if (isExtractingConcepts.value) return 'Generando conceptos...'
  if (isExtractingRelations.value) return 'Procesando relaciones...'
  if (isGeneratingConceptDefinition.value) return 'Generando definición...'
  return 'Herramientas'
})

<<<<<<< HEAD
const {
  showPageLinkModal,
  searchQuery,
  pageLinkForm,
  modulePages,
  isEditingLearningObjectLink,
  isFetching: isSearchingPages,
  openPageLinkModal,
  closePageLinkModal,
  submitPageLink,
  removeLearningObjectLink,
} = useLearningObjectEditorLinkModal(editor, learningObjectId, moduleId)

const selectedPageTitle = computed(() => {
  if (!pageLinkForm.value.targetLearningObjectId) return ''
  return modulePages.value.find(p => p.id === pageLinkForm.value.targetLearningObjectId)?.title || ''
})

function selectPage(page: LearningObject) {
  pageLinkForm.value.targetLearningObjectId = page.id
  searchQuery.value = ''
}
=======
const linkModal = ref<InstanceType<typeof LearningObjectLinkModal> | null>(null)
>>>>>>> 5a1e84f (Divide component)

const {
  showExternalLinkModal,
  externalLinkForm,
  openExternalLinkModal,
  closeExternalLinkModal,
  submitExternalLink,
  removeExternalLink,
} = useLearningObjectEditorExternalLinkModal(editor)

const {
  showImagePromptModal,
  imagePrompt,
  openImagePromptModal,
  closeImagePromptModal,
  handleGenerateImageFromPrompt,
  isGeneratingImage,
} = useLearningObjectEditorImageModal(editor)

const conceptHoverRoot = ref<HTMLElement | null>(null)
const { visible: conceptTooltipVisible, text: conceptTooltipText, style: conceptTooltipStyle } =
  useConceptDefinitionHoverTooltip(conceptHoverRoot)

function handleEditorContentClick(event: MouseEvent) {
  if (!editor.value) return
  const target = event.target as HTMLElement | null
  const conceptEl = target?.closest?.('[data-type="concept"]') as HTMLElement | null
  if (!conceptEl) return
  const pos = editor.value.view.posAtDOM(conceptEl, 0)
  if (Number.isFinite(pos)) {
    openConceptModalForEditAtPos(pos)
  }
}
</script>

<template>
  <div class="learning-object-editor-view h-screen flex flex-col bg-background pt-4 sm:pt-8 min-w-0">
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
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button
                :disabled="isAnyAiActionLoading"
                class="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <Loader2 v-if="isAnyAiActionLoading" class="size-4 animate-spin" />
                <Zap v-else class="size-4" />
                <span>{{ currentAiActionLabel }}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              <DropdownMenuItem @click="openAIModal" :disabled="isGenerating">
                <Sparkles class="mr-2 size-4" />
                <span>Generar con IA</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="showRegenerateModal = true" :disabled="isRegenerating">
                <Wand2 class="mr-2 size-4" />
                <span>Regenerar contenido</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleGenerateConcepts" :disabled="isExtractingConcepts">
                <BookOpen class="mr-2 size-4" />
                <span>Generar conceptos</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleGenerateRelations" :disabled="isExtractingRelations">
                <Zap class="mr-2 size-4" />
                <span>Relaciones</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            @click="isPreviewMode = !isPreviewMode"
            class="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-lg font-medium transition-all duration-200 hover:bg-muted/80 hover:shadow-sm"
          >
            <component :is="isPreviewMode ? EyeOff : Eye" class="size-4" />
            <span class="hidden sm:inline">{{ isPreviewMode ? 'Volver al editor' : 'Vista previa' }}</span>
          </button>

          <button
            v-if="!isPreviewMode"
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

    <div v-if="isPreviewMode" class="flex-1 overflow-y-auto overflow-x-hidden min-w-0 bg-background">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div class="bg-primary/5 border border-primary/10 rounded-lg p-3 mt-6 mb-2 flex items-center gap-3">
          <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Eye class="size-5" />
          </div>
          <div>
            <p class="text-xl font-bold text-primary">Modo Vista Estudiante</p>
            <p class="text-base text-muted-foreground">Así es como los alumnos verán este contenido una vez publicado.</p>
          </div>
        </div>
        <LearningObjectDetailView :preview-data="previewData" is-preview />
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
      <TooltipProvider>
        <div class="editor-page-wrapper min-w-0">
          <div class="editor-toolbar-wrapper">
          <EditorToolbar
            :editor="editor"
            :on-insert-concept="openConceptModal"
            :on-insert-page-link="() => linkModal?.open()"
            :on-insert-external-link="openExternalLinkModal"
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
                class="keyword-badge keyword-badge-editable inline-flex items-center gap-1"
              >
                {{ keyword }}
                <button
                  type="button"
                  @click="learningObjectKeywords.splice(index, 1)"
                  class="keyword-badge-remove p-0.5 rounded transition-colors"
                  aria-label="Quitar palabra clave"
                >
                  <X class="size-3" />
                </button>
              </span>
            </div>
          </div>

          <div ref="conceptHoverRoot" class="editor-content" @click.capture="handleEditorContentClick">
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

    <Teleport to="body">
      <div v-if="showConceptModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-scale-in">
          <h3 class="text-xl font-bold mb-4">{{ isEditingConcept ? 'Editar Concepto' : 'Añadir Concepto' }}</h3>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium mb-1">Término</label>
              <input v-model="conceptForm.term" class="w-full p-2 rounded border bg-background" />
            </div>
            <div>
              <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                <label class="block text-sm font-medium">Definición</label>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                  :disabled="isGeneratingConceptDefinition || !conceptForm.term || !conceptForm.term.trim()"
                  @click="generateConceptDefinitionWithAi()"
                >
                  <Sparkles class="size-4 shrink-0" />
                  {{ isGeneratingConceptDefinition ? 'Generando…' : 'Generar con IA' }}
                </button>
              </div>
              <textarea
                v-model="conceptForm.definition"
                class="w-full p-2 rounded border bg-background min-h-[100px]"
                :disabled="isGeneratingConceptDefinition"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button @click="closeConceptModal" class="px-4 py-2 text-muted-foreground hover:bg-muted/50 rounded">Cancelar</button>
            <button
              @click="submitConcept"
              :disabled="isCreatingConcept || isGeneratingConceptDefinition || !conceptForm.term || !conceptForm.definition"
              class="px-4 py-2 bg-primary text-primary-foreground rounded flex items-center gap-2 disabled:opacity-50"
            >
              <Loader2 v-if="isCreatingConcept" class="size-4 animate-spin" />
              {{ isEditingConcept ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>

      <LearningObjectLinkModal
        ref="linkModal"
        :editor="editor"
        :learning-object-id="learningObjectId"
        :module-id="moduleId"
      />
      <div v-if="showExternalLinkModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-scale-in">
          <h3 class="text-xl font-bold mb-4">Enlace externo</h3>
          <p class="text-sm text-muted-foreground mb-4">
            Pega una URL (YouTube, artículo, etc.). Si no hay texto seleccionado, puedes escribir el texto del enlace.
          </p>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium mb-1">URL</label>
              <input
                v-model="externalLinkForm.href"
                type="url"
                placeholder="https://www.youtube.com/watch?v=…"
                class="w-full p-2 rounded border bg-background"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Texto a mostrar (si el cursor está vacío)</label>
              <input
                v-model="externalLinkForm.label"
                type="text"
                placeholder="Ver video en YouTube"
                class="w-full p-2 rounded border bg-background"
              />
            </div>
          </div>
          <div class="flex flex-wrap justify-end gap-3">
            <button
              v-if="editor?.isActive('link')"
              type="button"
              @click="removeExternalLink"
              class="px-4 py-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded mr-auto"
            >
              Quitar enlace
            </button>
            <button @click="closeExternalLinkModal" class="px-4 py-2 text-muted-foreground hover:bg-muted/50 rounded">
              Cancelar
            </button>
            <button
              @click="submitExternalLink"
              :disabled="!externalLinkForm.href.trim()"
              class="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>

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
    <RegenerateContentModal
      v-model:open="showRegenerateModal"
      :is-loading="isRegenerating"
      @regenerate="handleRegenerateContent"
    />
  </div>
</template>

<style scoped>
.editor-page-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

@media (min-width: 768px) {
  .editor-page-wrapper {
    padding: 0 1rem 2.5rem;
  }
}

@media (min-width: 1024px) {
  .editor-page-wrapper {
    max-width: min(100%, 1200px);
    padding: 0 2rem 3rem;
  }
}

@media (min-width: 1536px) {
  .editor-page-wrapper {
    max-width: min(100%, 1400px);
  }
}

.editor-toolbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 10;
  margin: 0 -1rem 1.25rem;
  padding: 0.625rem 1rem;
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
}

@media (min-width: 1024px) {
  .editor-toolbar-wrapper {
    margin: 0 0 1.5rem;
    padding-left: 0;
    padding-right: 0;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
  }
}

.editor-main-container {
  min-width: 0;
}

.page-header-editor {
  background-color: var(--card);
  padding: 2rem 2rem 1.5rem;
  border-radius: 0;
  margin-bottom: 2rem;
}

.page-title-input input {
  width: 100%;
  font-size: 1.875rem;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--foreground);
}

@media (min-width: 1024px) {
  .page-title-input input {
    font-size: 3rem;
  }
}

.keyword-badge {
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  background-color: var(--muted);
  color: var(--muted-foreground);
  transition: background-color 0.2s ease;
}

.keyword-badge-editable:hover {
  background-color: var(--accent);
}

.keyword-badge-remove {
  color: var(--muted-foreground);
}

.keyword-badge-remove:hover {
  color: var(--foreground);
  background-color: var(--muted);
}

.editor-content {
  background-color: transparent;
  padding: 0 0.25rem 1rem;
}

.editor-content :deep(.ProseMirror) {
  color: var(--foreground);
  outline: none;
  min-height: 50vh;
}

.editor-content :deep(.ProseMirror h1) {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--foreground);
}

.editor-content :deep(.ProseMirror h2) {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--foreground);
}

.editor-content :deep(.ProseMirror h3) {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.editor-content :deep(.ProseMirror h4) {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.editor-content :deep(.ProseMirror p) {
  font-size: 1rem;
  line-height: 1.75rem;
  margin-bottom: 1rem;
  color: var(--foreground);
  opacity: 0.9;
}

.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
}

.editor-content :deep(.ProseMirror ul) {
  list-style-type: disc;
}

.editor-content :deep(.ProseMirror ol) {
  list-style-type: decimal;
}

.editor-content :deep(.ProseMirror li) {
  font-size: 1rem;
  color: var(--foreground);
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.editor-content :deep(.ProseMirror code) {
  background-color: var(--muted);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  color: var(--foreground);
}

.editor-content :deep(.ProseMirror pre) {
  background-color: var(--muted);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.editor-content :deep(.ProseMirror pre code) {
  background-color: transparent;
  padding: 0;
}

.editor-content :deep(.ProseMirror blockquote) {
  border-left: 4px solid #233a83;
  padding-left: 1rem;
  font-style: italic;
  margin: 1rem 0;
  color: var(--muted-foreground);
}

.editor-content :deep(.ProseMirror a) {
  color: #233a83;
  text-decoration: underline;
}

:global(.dark) .editor-content :deep(.ProseMirror a) {
  color: #9fb3ff;
}

.editor-content :deep(.ProseMirror .concept-term) {
  font-style: italic;
  font-weight: 500;
  color: var(--foreground);
  cursor: help;
  padding: 0 0.15em;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: currentColor;
  text-underline-offset: 0.2em;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.editor-content :deep(.ProseMirror .concept-term strong) {
  font-weight: 700;
  font-style: italic;
  color: inherit;
}

.editor-content :deep(.ProseMirror .learning-object-link-term) {
  border-bottom: none;
  text-decoration: underline;
  text-decoration-color: var(--primary);
  text-underline-offset: 0.2em;
  color: var(--primary);
  cursor: pointer;
  background-color: transparent;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.editor-content :deep(.ProseMirror .learning-object-link-term strong),
.editor-content :deep(.ProseMirror .learning-object-link-term em),
.editor-content :deep(.ProseMirror .learning-object-link-term code) {
  color: var(--primary);
}

.editor-content :deep(.ProseMirror .learning-object-link-term:hover) {
  opacity: 0.88;
}

.editor-content :deep(.ProseMirror strong) {
  font-weight: 700;
  color: var(--foreground);
}

.editor-content :deep(.ProseMirror em) {
  font-style: italic;
}

.editor-content :deep(.ProseMirror table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.editor-content :deep(.ProseMirror th),
.editor-content :deep(.ProseMirror td) {
  border: 1px solid var(--border);
  padding: 0.5rem;
  text-align: left;
}

.editor-content :deep(.ProseMirror th) {
  background-color: var(--muted);
  font-weight: 600;
}

.editor-content :deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  max-height: 360px;
  object-fit: contain;
  border-radius: 0.5rem;
  margin: 1rem auto;
  display: block;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import { ArrowLeft, Sparkles, Loader2, X, Save, BookOpen, Link2, Image } from 'lucide-vue-next'
import { usePageEditorView } from '../../composables/editor/use-page-editor-view'
import { usePageEditorConceptModal } from '../../composables/editor/use-page-editor-concept-modal'
import { usePageEditorPageLinkModal } from '../../composables/editor/use-page-editor-page-link-modal'
import { usePageEditorImageModal } from '../../composables/editor/use-page-editor-image-modal'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useConceptDefinitionHoverTooltip } from '../../composables/use-concept-definition-hover-tooltip'
import ConceptDefinitionHoverLayer from '../components/concept-definition-hover-layer.vue'
import EditorToolbar from '../components/editor-toolbar.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const {
  pageId,
  moduleId,
  isLoadingPage,
  editor,
  isSaving,
  pageTitle,
  pageKeywords,
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
} = usePageEditorView()

const {
  showConceptModal,
  conceptForm,
  openConceptModal,
  closeConceptModal,
  submitConcept,
  isCreatingConcept,
} = usePageEditorConceptModal(pageId.value, editor)

const {
  showPageLinkModal,
  pageLinkForm,
  modulePages,
  openPageLinkModal,
  closePageLinkModal,
  submitPageLink,
} = usePageEditorPageLinkModal(editor, pageId, moduleId)

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
          <span>Volver a la página</span>
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

    <div v-if="isLoadingPage" class="flex-1 overflow-y-auto min-w-0">
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
                v-model="pageTitle"
                type="text"
                placeholder="Título de la página"
                class="w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
              />
            </h1>

            <div v-if="pageKeywords.length > 0" class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="(keyword, index) in pageKeywords"
                :key="index"
                class="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary"
              >
                {{ keyword }}
                <button
                  @click="pageKeywords.splice(index, 1)"
                  class="hover:text-primary/80"
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
                class="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                @click="handleGenerateContent"
                :disabled="!aiInstructions.trim() || isGenerating"
                class="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-200 flex items-center gap-2"
              >
                <Loader2 v-if="isGenerating" class="size-4 animate-spin" />
                <Sparkles v-else class="size-4" />
                <span>{{ isGenerating ? 'Generando...' : 'Generar Contenido' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Generar imagen con IA -->
    <Teleport to="body">
      <div
        v-if="showImagePromptModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeImagePromptModal"
      >
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-scale-in">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Image class="size-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-foreground mb-1">Generar imagen con IA</h2>
              <p class="text-sm text-muted-foreground">
                Escribe cómo quieres que sea la imagen y se insertará donde está el cursor.
              </p>
            </div>
            <button
              type="button"
              class="flex-shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-50"
              :disabled="isGeneratingImage"
              @click="closeImagePromptModal"
            >
              <X class="size-6" />
            </button>
          </div>
          <div class="mb-6">
            <label for="image-prompt-input" class="block text-sm font-medium text-foreground mb-2">Descripción de la imagen</label>
            <input
              id="image-prompt-input"
              v-model="imagePrompt"
              type="text"
              :disabled="isGeneratingImage"
              placeholder="Ej: Un diagrama de una célula con sus partes señaladas, estilo limpio"
              class="w-full px-4 py-2.5 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:opacity-50"
              @keydown.enter.prevent="handleGenerateImageFromPrompt"
            />
          </div>
          <div v-if="isGeneratingImage" class="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div class="flex items-center gap-3">
              <Loader2 class="size-5 text-primary animate-spin" />
              <p class="text-sm font-medium text-primary">Generando imagen...</p>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeImagePromptModal"
              :disabled="isGeneratingImage"
              class="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="handleGenerateImageFromPrompt"
              :disabled="!imagePrompt.trim() || isGeneratingImage"
              class="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Loader2 v-if="isGeneratingImage" class="size-4 animate-spin" />
              <Image v-else class="size-4" />
              <span>{{ isGeneratingImage ? 'Generando...' : 'Generar e insertar' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showConceptModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeConceptModal"
      >
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 animate-scale-in">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen class="size-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-foreground mb-1">Insertar concepto</h2>
              <p class="text-sm text-muted-foreground">
                Crea un concepto y se insertará en el editor. Guarda la página al finalizar.
              </p>
            </div>
            <button
              type="button"
              class="flex-shrink-0 text-muted-foreground hover:text-foreground"
              @click="closeConceptModal"
            >
              <X class="size-6" />
            </button>
          </div>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Término</label>
              <input
                v-model="conceptForm.term"
                type="text"
                placeholder="Ej: variable"
                class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Definición</label>
              <textarea
                v-model="conceptForm.definition"
                rows="3"
                placeholder="Definición del concepto (se mostrará en el tooltip)"
                class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/30 rounded-lg"
              @click="closeConceptModal"
            >
              Cancelar
            </button>
            <button
              type="button"
              :disabled="!conceptForm.term.trim() || isCreatingConcept"
              class="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              @click="submitConcept"
            >
              <Loader2 v-if="isCreatingConcept" class="size-4 animate-spin" />
              <span>{{ isCreatingConcept ? 'Creando...' : 'Insertar concepto' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Enlace a página -->
    <Teleport to="body">
      <div
        v-if="showPageLinkModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closePageLinkModal"
      >
        <div class="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 animate-scale-in">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Link2 class="size-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-foreground mb-1">Enlace a otra página</h2>
              <p class="text-sm text-muted-foreground">
                Elige una página del módulo y el texto a mostrar. Guarda la página al finalizar.
              </p>
            </div>
            <button
              type="button"
              class="flex-shrink-0 text-muted-foreground hover:text-foreground"
              @click="closePageLinkModal"
            >
              <X class="size-6" />
            </button>
          </div>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Página destino</label>
              <select
                v-model="pageLinkForm.targetPageId"
                class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
              >
                <option :value="null">Selecciona una página</option>
                <option
                  v-for="p in modulePages"
                  :key="p.id"
                  :value="p.id"
                >
                  {{ p.title }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Texto a mostrar</label>
              <input
                v-model="pageLinkForm.mentionText"
                type="text"
                placeholder="Ej: respiración celular"
                class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/30 rounded-lg"
              @click="closePageLinkModal"
            >
              Cancelar
            </button>
            <button
              type="button"
              :disabled="pageLinkForm.targetPageId == null || !pageLinkForm.mentionText.trim()"
              class="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              @click="submitPageLink"
            >
              Insertar enlace
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped src="../styles/page-editor-view.css"></style>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { EditorContent } from '@tiptap/vue-3'
import { ArrowLeft, Sparkles, Loader2, X, Save } from 'lucide-vue-next'
import { usePage } from '../../composables/queries/use-page'
import { usePageEditor } from '../../composables/use-page-editor'
import { useAIContentGeneration } from '@/features/content-generation/composables/use-ai-content-generation'
import { useImageGenerationHandler } from '@/features/content-generation/composables/use-image-generation-handler'
import EditorToolbar from '../components/editor-toolbar.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const route = useRoute()
const router = useRouter()
const pageId = computed(() => Number(route.params.pageId))
const moduleId = computed(() => Number(route.params.id))

const { data: page, isLoading: isLoadingPage } = usePage(pageId.value)

const pageTitle = ref('')
const pageKeywords = ref<string[]>([])

const { editor, isMounted, isSaving, setContentFromPage, insertContent, saveContent } = usePageEditor(pageId.value)

const {
  showAIModal,
  aiInstructions,
  isGenerating,
  generationError,
  openAIModal,
  closeAIModal,
  generate,
} = useAIContentGeneration(pageId.value)


useImageGenerationHandler(editor)

watch(() => page.value, (pageData) => {
  if (pageData) {
    pageTitle.value = pageData.title
    pageKeywords.value = [...pageData.keywords]
    if (editor.value) {
      setContentFromPage(pageData)
    }
  }
}, { immediate: true })

watch(() => editor.value, (editorInstance) => {
  if (editorInstance && page.value) {
    if (!pageTitle.value) {
      pageTitle.value = page.value.title
      pageKeywords.value = [...page.value.keywords]
    }
    setContentFromPage(page.value)
  }
}, { immediate: true })

const goBack = () => {
  router.push(`/modules/${moduleId.value}/pages/${pageId.value}`)
}

const handleGenerateContent = () => {
  generate(
    (result) => {
      if (result.title) pageTitle.value = result.title
      if (result.keywords) pageKeywords.value = result.keywords
      
      // Insert text content first
      if (result.content) {
        insertContent(result.content)
      }
      
      // Insert image suggestions as custom nodes
      if (result.imageSuggestions && result.imageSuggestions.length > 0 && editor.value) {
        result.imageSuggestions.forEach((suggestion) => {
          editor.value?.commands.setImageSuggestion(suggestion.prompt, suggestion.reason)
        })
      }
    },
    () => isMounted.value
  )
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleGenerateContent()
  } else if (e.key === 'Escape') {
    closeAIModal()
  }
}
</script>

<template>
  <div class="page-editor-view h-screen flex flex-col bg-background pt-8">
    <div class="border-b border-border bg-card px-6 py-4">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <button
          @click="goBack"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md transition-all duration-200"
        >
          <ArrowLeft class="size-4" />
          <span>Volver al módulo</span>
        </button>

        <div class="flex items-center gap-3">
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

    <div v-if="isLoadingPage" class="flex-1 overflow-y-auto">
      <div class="px-6 py-8 space-y-4">
        <Skeleton class="h-12 w-3/4" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-2/3" />
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto">
      <div class="editor-page-wrapper">
        <div class="editor-toolbar-wrapper">
          <EditorToolbar :editor="editor" />
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

          <div class="editor-content">
            <EditorContent :editor="editor" />
          </div>
        </div>
      </div>
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
  </div>
</template>

<style scoped>
.editor-page-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.editor-toolbar-wrapper {
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0.75rem 0;
}

.editor-main-container {
  background-color: var(--card);
}

.page-header-editor {
  padding: 2rem 0 1.5rem;
  border-bottom: 1px solid var(--border);
}

.page-title-input {
  margin-bottom: 0;
}

.page-title-input input {
  font-size: 3rem;
  line-height: 1.2;
  font-weight: 700;
}

.editor-content {
  padding: 2rem 0;
  min-height: 60vh;
}

.editor-content :deep(.ProseMirror) {
  outline: none;
  color: var(--foreground);
  line-height: 1.75;
  min-height: 60vh;
}

.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: 'Comienza a escribir o usa el botón "Generar con IA" para crear contenido...';
  color: var(--muted-foreground);
  float: left;
  pointer-events: none;
  height: 0;
}

.editor-content :deep(h1) {
  font-size: 2.5rem;
  line-height: 1.3;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--foreground);
}

.editor-content :deep(h1:first-child) {
  margin-top: 0;
}

.editor-content :deep(h2) {
  font-size: 2rem;
  line-height: 1.3;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--foreground);
}

.editor-content :deep(h3) {
  font-size: 1.625rem;
  line-height: 1.4;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.625rem;
  color: var(--foreground);
}

.editor-content :deep(h4) {
  font-size: 1.375rem;
  line-height: 1.5;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.editor-content :deep(p) {
  font-size: 1.0625rem;
  line-height: 1.75;
  margin-bottom: 0.75rem;
  color: var(--foreground);
}

.editor-content :deep(p:empty) {
  margin-bottom: 0.25rem;
}

.editor-content :deep(ul),
.editor-content :deep(ol) {
  padding-left: 2rem;
  margin-bottom: 0.75rem;
  margin-top: 0.5rem;
  line-height: 1.75;
}

.editor-content :deep(ul) {
  list-style-type: disc;
}

.editor-content :deep(ol) {
  list-style-type: decimal;
}

.editor-content :deep(li) {
  font-size: 1.0625rem;
  color: var(--foreground);
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  line-height: 1.75;
}

.editor-content :deep(li p) {
  margin-bottom: 0.5rem;
}

.editor-content :deep(code) {
  background-color: var(--muted);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  color: var(--foreground);
  border: 1px solid var(--border);
}

.editor-content :deep(pre) {
  position: relative;
  background-color: #f6f8fa;
  padding: 3rem 1.5rem 1.5rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid var(--border);
}

.dark .editor-content :deep(pre) {
  background-color: #161b22;
}

.editor-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.6;
}

.editor-content :deep(pre)::before {
  content: attr(data-language);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--muted-foreground);
  background-color: var(--muted);
  border-bottom: 1px solid var(--border);
  border-radius: 0.75rem 0.75rem 0 0;
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
}

.editor-content :deep(blockquote) {
  border-left: 3px solid var(--border);
  padding: 1rem 1.5rem;
  margin: 0.75rem 0;
  background-color: var(--muted);
  border-radius: 0.5rem;
  font-style: italic;
  color: var(--muted-foreground);
}

.editor-content :deep(blockquote p) {
  margin-bottom: 0.5rem;
}

.editor-content :deep(blockquote p:last-child) {
  margin-bottom: 0;
}

.editor-content :deep(strong) {
  font-weight: 700;
  color: var(--foreground);
}

.editor-content :deep(em) {
  font-style: italic;
  color: var(--foreground);
}

.editor-content :deep(a) {
  color: #C8102E;
  text-decoration: underline;
  transition: opacity 0.2s ease;
}

.editor-content :deep(a:hover) {
  opacity: 0.7;
}

.editor-content :deep(hr) {
  margin: 1rem 0;
  border: none;
  height: 1px;
  background-color: var(--border);
}

.editor-content :deep(.image-suggestion-block) {
  border: 1px solid var(--border);
  border-left: 4px solid #C8102E;
  background: linear-gradient(to right, rgba(200, 16, 46, 0.05), var(--muted));
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 1rem 0;
}

.editor-content :deep(.image-suggestion-title) {
  font-weight: 700;
  font-size: 1rem;
  color: #C8102E;
  margin-bottom: 0.75rem;
}

.editor-content :deep(.image-suggestion-prompt) {
  font-size: 0.9375rem;
  color: var(--foreground);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.editor-content :deep(.image-suggestion-reason) {
  font-size: 0.875rem;
  color: var(--muted-foreground);
  font-style: italic;
  margin-bottom: 0.75rem;
}

.editor-content :deep(.image-suggestion-actions) {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
}

.editor-content :deep(.generate-image-btn) {
  background-color: #C8102E;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.editor-content :deep(.generate-image-btn:hover:not([disabled])) {
  background-color: #B00E26;
  box-shadow: 0 2px 8px rgba(200, 16, 46, 0.3);
  transform: translateY(-1px);
}

.editor-content :deep(.generate-image-btn[disabled]) {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 200ms ease-out;
}
</style>

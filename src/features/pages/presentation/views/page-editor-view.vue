<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { EditorContent } from '@tiptap/vue-3'
import { ArrowLeft, Sparkles, Loader2, X, Save } from 'lucide-vue-next'
import { usePage } from '../../composables/queries/use-page'
import { usePageEditor } from '../../composables/use-page-editor'
import { useAIContentGeneration } from '@/features/content-generation/composables/use-ai-content-generation'
import EditorToolbar from '../components/editor-toolbar.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const route = useRoute()
const router = useRouter()
const pageId = computed(() => Number(route.params.pageId))
const moduleId = computed(() => Number(route.params.id))

const { data: page, isLoading: isLoadingPage } = usePage(pageId.value)

const pageTitle = ref('')
const pageKeywords = ref<string[]>([])

const { editor, isMounted, setContent, insertContent } = usePageEditor()

const {
  showAIModal,
  aiInstructions,
  isGenerating,
  generationError,
  openAIModal,
  closeAIModal,
  generate,
} = useAIContentGeneration(pageId.value)

watch(() => page.value, (pageData) => {
  if (pageData) {
    pageTitle.value = pageData.title
    pageKeywords.value = [...pageData.keywords]
    setContent(pageData.content)
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
      insertContent(result.content)
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
  <div class="page-editor-view h-screen flex flex-col bg-background">
    <div class="border-b border-border bg-card px-6 py-4">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft class="size-4" />
          <span>Volver</span>
        </button>

        <div class="flex items-center gap-3">
          <button
            @click="openAIModal"
            :disabled="isGenerating"
            class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isGenerating" class="size-4 animate-spin" />
            <Sparkles v-else class="size-4" />
            <span>{{ isGenerating ? 'Generando...' : 'Generar con IA' }}</span>
          </button>

          <button
            class="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg font-medium transition-colors hover:bg-muted/80"
          >
            <Save class="size-4" />
            <span class="hidden sm:inline">Guardar</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoadingPage" class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto px-6 py-8 space-y-4">
        <Skeleton class="h-12 w-3/4" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-2/3" />
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto px-6 py-8">
        <input
          v-model="pageTitle"
          type="text"
          placeholder="Título de la página"
          class="w-full text-4xl font-bold bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground mb-4"
        />

        <div v-if="pageKeywords.length > 0" class="flex flex-wrap gap-2 mb-8">
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

        <div class="editor-container">
          <EditorToolbar :editor="editor" />
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
                class="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                @click="handleGenerateContent"
                :disabled="!aiInstructions.trim() || isGenerating"
                class="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
.editor-container {
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--card);
}

.editor-content {
  padding: 1.5rem;
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
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.editor-content :deep(h2) {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  margin-top: 1.75rem;
  margin-bottom: 0.875rem;
}

.editor-content :deep(h3) {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.editor-content :deep(p) {
  margin-bottom: 1rem;
}

.editor-content :deep(ul),
.editor-content :deep(ol) {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
}

.editor-content :deep(ul) {
  list-style-type: disc;
}

.editor-content :deep(ol) {
  list-style-type: decimal;
}

.editor-content :deep(li) {
  margin-bottom: 0.5rem;
}

.editor-content :deep(code) {
  background-color: var(--muted);
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.editor-content :deep(pre) {
  background-color: var(--muted);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.editor-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.editor-content :deep(blockquote) {
  border-left-width: 4px;
  border-color: var(--primary);
  padding-left: 1rem;
  font-style: italic;
  margin: 1.5rem 0;
  color: var(--muted-foreground);
}

.editor-content :deep(blockquote p) {
  margin: 0.5rem 0;
}

.editor-content :deep(hr) {
  margin: 2rem 0;
  border-color: var(--border);
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

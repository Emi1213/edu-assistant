<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onUnmounted } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Sparkles, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import { useGenerateContent } from '../../composables/mutations/use-generate-content'
import { normalizeConceptMarkersInMarkdown } from '../../utils/normalize-concept-markers'
import { lowlight } from '@/shared/config/lowlight.config'

interface Props {
  modelValue?: string
  learningObjectId: number
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Escribe algo o usa el botón de IA para generar contenido...',
})

const emit = defineEmits<Emits>()

const showAIPrompt = ref(false)
const aiPrompt = ref('')
const aiPromptPosition = ref({ top: 0, left: 0 })
const generationStatus = ref<'idle' | 'generating' | 'success' | 'error'>('idle')
const errorMessage = ref('')
const isMounted = ref(true)

const { mutate: generateContent, isPending: isGenerating, reset: resetMutation } = useGenerateContent()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      codeBlock: false,
    }),
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'plaintext',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[400px] max-w-none p-6',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (value) => {
  if (editor.value && editor.value.getHTML() !== value) {
    editor.value.commands.setContent(value)
  }
})

const openAIPrompt = () => {
  if (!editor.value) return
  
  // Obtener posición del cursor
  const { view } = editor.value
  const { from } = view.state.selection
  const coords = view.coordsAtPos(from)
  
  aiPromptPosition.value = {
    top: coords.top - view.dom.getBoundingClientRect().top + 40,
    left: coords.left - view.dom.getBoundingClientRect().left,
  }
  
  showAIPrompt.value = true
  
  setTimeout(() => {
    const input = document.getElementById('ai-prompt-input')
    if (input) input.focus()
  }, 50)
}

const closeAIPrompt = () => {
  showAIPrompt.value = false
  aiPrompt.value = ''
  generationStatus.value = 'idle'
  errorMessage.value = ''
}

const handleGenerateContent = () => {
  if (!aiPrompt.value.trim() || !editor.value || !isMounted.value) return

  generationStatus.value = 'generating'
  errorMessage.value = ''

  generateContent(
    {
      learningObjectId: props.learningObjectId,
      instructions: aiPrompt.value,
    },
    {
      onSuccess: (data) => {
        if (!isMounted.value || !editor.value) return

        if (!data) {
          generationStatus.value = 'error'
          errorMessage.value = 'No se recibió contenido del servidor'
          return
        }

        let contentToInsert = ''

        if (data.title) {
          contentToInsert += `<h2>${data.title}</h2>`
        }

        data.blocks.forEach((block) => {
          switch (block.type) {
            case 'TEXT':
              if ('markdown' in block.content) {
                contentToInsert += normalizeConceptMarkersInMarkdown(block.content.markdown as string)
              }
              break
            case 'CODE':
              if ('code' in block.content && 'language' in block.content) {
                contentToInsert += `<pre><code>${block.content.code}</code></pre>`
              }
              break
            case 'IMAGE_SUGGESTION':
              if ('prompt' in block.content && 'reason' in block.content) {
                contentToInsert += `<blockquote><strong>💡 Sugerencia de Imagen:</strong><br>${block.content.prompt}<br><em>${block.content.reason}</em></blockquote>`
              }
              break
          }
        })

        editor.value.commands.insertContent(contentToInsert)

        generationStatus.value = 'success'

        setTimeout(() => {
          if (isMounted.value) {
            closeAIPrompt()
          }
        }, 1000)
      },
      onError: (error) => {
        if (!isMounted.value) return
        
        generationStatus.value = 'error'
        errorMessage.value = error.message || 'Error al generar contenido. Por favor, intenta de nuevo.'
      },
    }
  )
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleGenerateContent()
  } else if (e.key === 'Escape') {
    closeAIPrompt()
  }
}

onBeforeUnmount(() => {
  isMounted.value = false
  editor.value?.destroy()
})

onUnmounted(() => {
  resetMutation()
})
</script>

<template>
  <div class="notion-style-editor relative">
    <div class="editor-container rounded-lg border border-border bg-card overflow-hidden">
      <!-- Toolbar -->
      <div class="editor-toolbar border-b border-border bg-muted/30 p-3 flex items-center gap-2 flex-wrap">
        <!-- Formato de texto -->
        <div class="flex items-center gap-1">
          <button
            v-if="editor"
            @click="editor.chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
            class="toolbar-button"
            type="button"
            title="Negrita"
          >
            <span class="font-bold">B</span>
          </button>
          
          <button
            v-if="editor"
            @click="editor.chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
            class="toolbar-button"
            type="button"
            title="Cursiva"
          >
            <span class="italic">I</span>
          </button>
          
          <button
            v-if="editor"
            @click="editor.chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }"
            class="toolbar-button"
            type="button"
            title="Tachado"
          >
            <span class="line-through">S</span>
          </button>
        </div>

        <div class="w-px h-6 bg-border"></div>

        <!-- Encabezados -->
        <div class="flex items-center gap-1">
          <button
            v-if="editor"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            class="toolbar-button"
            type="button"
            title="Encabezado 1"
          >
            H1
          </button>
          
          <button
            v-if="editor"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            class="toolbar-button"
            type="button"
            title="Encabezado 2"
          >
            H2
          </button>
          
          <button
            v-if="editor"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
            class="toolbar-button"
            type="button"
            title="Encabezado 3"
          >
            H3
          </button>
        </div>

        <div class="w-px h-6 bg-border"></div>

        <!-- Listas -->
        <div class="flex items-center gap-1">
          <button
            v-if="editor"
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            class="toolbar-button"
            type="button"
            title="Lista"
          >
            • Lista
          </button>
          
          <button
            v-if="editor"
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }"
            class="toolbar-button"
            type="button"
            title="Lista numerada"
          >
            1. Lista
          </button>
        </div>

        <div class="flex-1"></div>

        <!-- Botón de IA -->
        <button
          @click="openAIPrompt"
          :disabled="isGenerating"
          class="toolbar-button-ai"
          type="button"
          title="Generar contenido con IA"
        >
          <Loader2 v-if="isGenerating" class="size-4 animate-spin" />
          <Sparkles v-else class="size-4" />
          <span class="hidden sm:inline">Generar con IA</span>
        </button>
      </div>

      <!-- Editor -->
      <div class="editor-wrapper relative">
        <EditorContent :editor="editor" />

        <!-- AI Prompt Modal -->
        <div
          v-if="showAIPrompt"
          class="ai-prompt-overlay"
          @click.self="closeAIPrompt"
        >
          <div class="ai-prompt-modal">
            <div class="flex items-start gap-3 mb-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles class="size-5 text-primary" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-foreground mb-1">
                  Generar contenido con IA
                </h3>
                <p class="text-sm text-muted-foreground">
                  Describe qué contenido quieres generar y se insertará en tu documento
                </p>
              </div>
              <button
                @click="closeAIPrompt"
                class="flex-shrink-0 text-muted-foreground hover:text-foreground"
                type="button"
              >
                <X class="size-5" />
              </button>
            </div>

            <textarea
              id="ai-prompt-input"
              v-model="aiPrompt"
              @keydown="handleKeyDown"
              :disabled="generationStatus === 'generating'"
              placeholder="Ejemplo: Explica qué son los algoritmos de ordenamiento con ejemplos de bubble sort y quick sort..."
              class="w-full min-h-[120px] p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <!-- Status Messages -->
            <div v-if="generationStatus === 'generating'" class="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div class="flex items-center gap-2 text-sm text-primary">
                <Loader2 class="size-4 animate-spin" />
                <span class="font-medium">Generando contenido...</span>
              </div>
              <p class="text-xs text-muted-foreground mt-1">
                Esto puede tardar unos segundos. Por favor espera.
              </p>
            </div>

            <div v-if="generationStatus === 'success'" class="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 class="size-4" />
                <span class="font-medium">¡Contenido generado exitosamente!</span>
              </div>
            </div>

            <div v-if="generationStatus === 'error'" class="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div class="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle class="size-4" />
                <span class="font-medium">Error al generar contenido</span>
              </div>
              <p class="text-xs text-destructive/80 mt-1">
                {{ errorMessage }}
              </p>
            </div>

            <div class="flex items-center justify-between mt-4">
              <p class="text-xs text-muted-foreground">
                {{ generationStatus === 'generating' 
                  ? 'Generando contenido, por favor espera...' 
                  : 'Presiona Enter para generar, Shift+Enter para nueva línea' }}
              </p>
              <div class="flex gap-2">
                <button
                  @click="closeAIPrompt"
                  :disabled="generationStatus === 'generating'"
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ generationStatus === 'success' ? 'Cerrar' : 'Cancelar' }}
                </button>
                <button
                  v-if="generationStatus !== 'success'"
                  @click="handleGenerateContent"
                  :disabled="!aiPrompt.trim() || generationStatus === 'generating'"
                  type="button"
                  class="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Loader2 v-if="generationStatus === 'generating'" class="size-4 animate-spin" />
                  <Sparkles v-else class="size-4" />
                  <span>{{ generationStatus === 'generating' ? 'Generando...' : 'Generar' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbar-button {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition-property: color, background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  color: var(--muted-foreground);
}

.toolbar-button:hover {
  color: var(--foreground);
  background-color: var(--muted);
}

.toolbar-button.is-active {
  background-color: var(--muted);
  color: var(--foreground);
}

.toolbar-button-ai {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  border-radius: 0.375rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.toolbar-button-ai:hover:not(:disabled) {
  background-color: var(--primary);
  opacity: 0.9;
}

.toolbar-button-ai:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-wrapper :deep(.ProseMirror) {
  outline: none;
  color: var(--foreground);
}

.editor-wrapper :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: var(--muted-foreground);
  float: left;
  pointer-events: none;
  height: 0;
}

.editor-wrapper :deep(h1) {
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.editor-wrapper :deep(h2) {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.editor-wrapper :deep(h3) {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.editor-wrapper :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.editor-wrapper :deep(ul),
.editor-wrapper :deep(ol) {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
}

.editor-wrapper :deep(ul) {
  list-style-type: disc;
}

.editor-wrapper :deep(ol) {
  list-style-type: decimal;
}

.editor-wrapper :deep(li) {
  margin-bottom: 0.25rem;
}

.editor-wrapper :deep(code) {
  background-color: var(--muted);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.editor-wrapper :deep(pre) {
  background-color: #f6f8fa;
  padding: 1.5rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  border: 1px solid var(--border);
}

.dark .editor-wrapper :deep(pre) {
  background-color: #161b22;
}

.editor-wrapper :deep(pre code) {
  background-color: transparent;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.6;
}

.editor-wrapper :deep(blockquote) {
  border-left-width: 4px;
  border-color: var(--primary);
  padding-left: 1rem;
  font-style: italic;
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: var(--muted-foreground);
}

.editor-wrapper :deep(hr) {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border-color: var(--border);
}

/* AI Prompt Overlay */
.ai-prompt-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: fadeIn 150ms ease-out;
}

.ai-prompt-modal {
  background-color: var(--card);
  border-radius: 0.75rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: scaleIn 200ms ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

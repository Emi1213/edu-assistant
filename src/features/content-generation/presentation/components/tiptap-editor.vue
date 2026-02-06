<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  modelValue?: string
  placeholder?: string
  editable?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Escribe tus instrucciones aquí...',
  editable: true,
})

const emit = defineEmits<Emits>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  editable: props.editable,
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] max-w-none',
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

watch(() => props.editable, (value) => {
  if (editor.value) {
    editor.value.setEditable(value)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="tiptap-editor">
    <div v-if="editor && editable" class="editor-toolbar border border-border rounded-t-lg bg-card p-2 flex flex-wrap gap-1">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        class="toolbar-button"
        type="button"
      >
        <span class="font-bold">B</span>
      </button>
      
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        class="toolbar-button"
        type="button"
      >
        <span class="italic">I</span>
      </button>
      
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        class="toolbar-button"
        type="button"
      >
        <span class="line-through">S</span>
      </button>
      
      <div class="w-px h-6 bg-border mx-1"></div>
      
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        class="toolbar-button"
        type="button"
      >
        H1
      </button>
      
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        class="toolbar-button"
        type="button"
      >
        H2
      </button>
      
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        class="toolbar-button"
        type="button"
      >
        H3
      </button>
      
      <div class="w-px h-6 bg-border mx-1"></div>
      
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        class="toolbar-button"
        type="button"
      >
        • Lista
      </button>
      
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        class="toolbar-button"
        type="button"
      >
        1. Lista
      </button>
      
      <button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        class="toolbar-button"
        type="button"
      >
        &lt;/&gt;
      </button>
      
      <button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        class="toolbar-button"
        type="button"
      >
        "
      </button>
      
      <div class="w-px h-6 bg-border mx-1"></div>
      
      <button
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="toolbar-button"
        type="button"
      >
        —
      </button>
      
      <button
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        class="toolbar-button"
        type="button"
      >
        ↶
      </button>
      
      <button
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        class="toolbar-button"
        type="button"
      >
        ↷
      </button>
    </div>
    
    <EditorContent 
      :editor="editor" 
      :class="[
        'editor-content border border-border bg-card',
        editable ? 'rounded-b-lg border-t-0' : 'rounded-lg'
      ]"
    />
  </div>
</template>

<style scoped>
.toolbar-button {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  color: var(--muted-foreground);
}

.toolbar-button:hover {
  color: var(--foreground);
  background-color: var(--muted);
}

.toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-button.is-active {
  background-color: var(--muted);
  color: var(--foreground);
}

.editor-content {
  padding: 1rem;
}

.editor-content :deep(.ProseMirror) {
  outline: 2px solid transparent;
  outline-offset: 2px;
  color: var(--foreground);
}

.editor-content :deep(.ProseMirror:focus) {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: var(--muted-foreground);
  float: left;
  pointer-events: none;
  height: 0;
}

.editor-content :deep(h1) {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.editor-content :deep(h2) {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

.editor-content :deep(h3) {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
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
  margin-bottom: 0.25rem;
}

.editor-content :deep(code) {
  background-color: var(--muted);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.editor-content :deep(pre) {
  background-color: var(--muted);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
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
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: var(--muted-foreground);
}

.editor-content :deep(hr) {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border-color: var(--border);
}
</style>

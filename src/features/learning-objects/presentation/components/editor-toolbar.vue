<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { Bold, Italic, Strikethrough, List, ListOrdered, Code, Quote, Minus, Undo, Redo, BookOpen, Link2, Image, ExternalLink } from 'lucide-vue-next'

interface Props {
  editor: Editor | undefined
  onInsertConcept?: () => void
  onInsertPageLink?: () => void
  onInsertExternalLink?: () => void
  onInsertImage?: () => void
}

defineProps<Props>()
</script>

<template>
  <div v-if="editor" class="toolbar">
    <div class="toolbar-group">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        class="toolbar-btn"
        type="button"
        title="Negrita (Ctrl+B)"
      >
        <Bold class="size-4" />
      </button>

      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        class="toolbar-btn"
        type="button"
        title="Cursiva (Ctrl+I)"
      >
        <Italic class="size-4" />
      </button>

      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        class="toolbar-btn"
        type="button"
        title="Tachado"
      >
        <Strikethrough class="size-4" />
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        class="toolbar-btn"
        type="button"
        title="Título 1"
      >
        <span class="font-bold">H1</span>
      </button>

      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        class="toolbar-btn"
        type="button"
        title="Título 2"
      >
        <span class="font-bold">H2</span>
      </button>

      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        class="toolbar-btn"
        type="button"
        title="Título 3"
      >
        <span class="font-bold">H3</span>
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        class="toolbar-btn"
        type="button"
        title="Lista"
      >
        <List class="size-4" />
      </button>

      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        class="toolbar-btn"
        type="button"
        title="Lista numerada"
      >
        <ListOrdered class="size-4" />
      </button>

      <button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        class="toolbar-btn"
        type="button"
        title="Cita"
      >
        <Quote class="size-4" />
      </button>

      <button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        class="toolbar-btn"
        type="button"
        title="Bloque de código"
      >
        <Code class="size-4" />
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <div v-if="onInsertConcept || onInsertPageLink || onInsertExternalLink || onInsertImage" class="toolbar-group">
      <button
        v-if="onInsertConcept"
        type="button"
        class="toolbar-btn"
        title="Insertar concepto"
        @click="onInsertConcept()"
      >
        <BookOpen class="size-4" />
      </button>
      <button
        v-if="onInsertPageLink"
        type="button"
        class="toolbar-btn"
        title="Enlace a otro objeto de aprendizaje"
        @click="onInsertPageLink()"
      >
        <Link2 class="size-4" />
      </button>
      <button
        v-if="onInsertExternalLink"
        type="button"
        class="toolbar-btn"
        :class="{ 'is-active': editor.isActive('link') }"
        title="Enlace web (YouTube, artículos, etc.)"
        @click="onInsertExternalLink()"
      >
        <ExternalLink class="size-4" />
      </button>
      <button
        v-if="onInsertImage"
        type="button"
        class="toolbar-btn"
        title="Generar imagen con IA"
        @click="onInsertImage()"
      >
        <Image class="size-4" />
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <button
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="toolbar-btn"
        type="button"
        title="Línea horizontal"
      >
        <Minus class="size-4" />
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <button
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        class="toolbar-btn"
        type="button"
        title="Deshacer (Ctrl+Z)"
      >
        <Undo class="size-4" />
      </button>

      <button
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        class="toolbar-btn"
        type="button"
        title="Rehacer (Ctrl+Shift+Z)"
      >
        <Redo class="size-4" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
  background-color: var(--muted);
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  gap: 0.25rem;
}

.toolbar-divider {
  width: 1px;
  height: 1.5rem;
  background-color: var(--border);
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: var(--muted-foreground);
  transition: all 150ms ease;
  min-width: 2rem;
  min-height: 2rem;
}

.toolbar-btn:hover:not(:disabled) {
  background-color: var(--background);
  color: var(--foreground);
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn.is-active {
  background-color: var(--background);
  color: var(--primary);
}
</style>

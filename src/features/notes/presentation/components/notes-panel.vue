<script setup lang="ts">
import { toRef } from 'vue'
import { StickyNote, Plus, Edit2, Trash2, Save, X, Loader2, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { useNotesPanel } from '../../composables/use-notes-panel'
import ConfirmationDialog from '@/shared/components/confirmation-dialog.vue'
import type { Note } from '../../types/notes.types'

interface Props {
  pageId: number
  notes: Note[] | null | undefined
}

const props = defineProps<Props>()

const notesRef = toRef(props, 'notes')

const {
  isCollapsed,
  isCreating,
  editingNoteId,
  newNoteContent,
  editNoteContent,
  isCreatingNote,
  isUpdatingNote,
  isDeletingNote,
  showDeleteDialog,
  userNotes,
  toggleCollapse,
  startCreating,
  cancelCreating,
  saveNewNote,
  startEditing,
  cancelEditing,
  saveEdit,
  openDeleteDialog,
  cancelDelete,
  confirmDelete,
  formatDate,
} = useNotesPanel(props.pageId, notesRef)
</script>

<template>
  <div 
    class="notes-panel bg-card border border-border rounded-lg overflow-hidden transition-all duration-300"
    :class="isCollapsed ? 'collapsed' : ''"
  >
    <div class="flex items-center justify-between p-4 border-b border-border bg-muted/30">
      <div class="flex items-center gap-2" :class="isCollapsed ? 'flex-col' : ''">
        <StickyNote class="size-5 text-primary flex-shrink-0" />
        <div v-if="!isCollapsed" class="flex items-center gap-2">
          <h3 class="text-lg font-semibold text-foreground">Mis Notas</h3>
          <span class="text-sm text-muted-foreground">({{ userNotes.length }})</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="!isCreating && !isCollapsed"
          @click="startCreating"
          class="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          <Plus class="size-4" />
          <span class="hidden sm:inline">Nueva</span>
        </button>
        <button
          @click="toggleCollapse"
          class="p-2 hover:bg-muted rounded-lg transition-colors"
          :title="isCollapsed ? 'Expandir' : 'Colapsar'"
        >
          <component :is="isCollapsed ? ChevronRight : ChevronLeft" class="size-4 text-muted-foreground" />
        </button>
      </div>
    </div>
    
    <div v-show="!isCollapsed" class="p-6 transition-all duration-300">

    <div v-if="isCreating" class="mb-4 p-4 bg-muted/30 border border-border rounded-lg">
      <textarea
        id="new-note-textarea"
        v-model="newNoteContent"
        placeholder="Escribe tu nota aquí..."
        :disabled="isCreatingNote"
        class="w-full min-h-[120px] p-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
      />
      <div class="flex items-center justify-end gap-2 mt-3">
        <button
          @click="cancelCreating"
          :disabled="isCreatingNote"
          class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          <X class="size-4 inline mr-1" />
          Cancelar
        </button>
        <button
          @click="saveNewNote"
          :disabled="isCreatingNote || !newNoteContent.trim()"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isCreatingNote" class="size-4 animate-spin" />
          <Save v-else class="size-4" />
          <span>{{ isCreatingNote ? 'Guardando...' : 'Guardar' }}</span>
        </button>
      </div>
    </div>

    <div v-if="userNotes.length === 0 && !isCreating" class="text-center py-12">
      <StickyNote class="size-12 mx-auto text-muted-foreground/30 mb-3" />
      <p class="text-muted-foreground text-sm">No tienes notas aún</p>
      <p class="text-muted-foreground/60 text-xs mt-1">Crea una nota para recordar información importante</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="note in userNotes"
        :key="note.id"
        class="group relative bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200"
      >
        <div v-if="editingNoteId === note.id" class="space-y-3">
          <textarea
            :id="`edit-note-${note.id}`"
            v-model="editNoteContent"
            :disabled="isUpdatingNote"
            class="w-full min-h-[100px] p-3 bg-muted/30 border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
          />
          <div class="flex items-center justify-end gap-2">
            <button
              @click="cancelEditing"
              :disabled="isUpdatingNote"
              class="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all duration-200 disabled:opacity-50"
            >
              <X class="size-3 inline mr-1" />
              Cancelar
            </button>
            <button
              @click="saveEdit(note.id)"
              :disabled="isUpdatingNote || !editNoteContent.trim()"
              class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isUpdatingNote" class="size-3 animate-spin" />
              <Save v-else class="size-3" />
              <span>{{ isUpdatingNote ? 'Guardando...' : 'Guardar' }}</span>
            </button>
          </div>
        </div>

        <div v-else>
          <div class="flex items-start justify-between gap-3 mb-2">
            <p class="text-sm text-foreground whitespace-pre-wrap flex-1">{{ note.content }}</p>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                @click="startEditing(note)"
                :disabled="isDeletingNote"
                class="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-all duration-200 disabled:opacity-50"
                title="Editar"
              >
                <Edit2 class="size-4" />
              </button>
              <button
                @click="openDeleteDialog(note.id)"
                :disabled="isDeletingNote"
                class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-all duration-200 disabled:opacity-50"
                title="Eliminar"
              >
                <Trash2 class="size-4" />
              </button>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">{{ formatDate(note.createdAt) }}</p>
        </div>
      </div>
    </div>
    </div>
  </div>

  <ConfirmationDialog
    :visible="showDeleteDialog"
    title="Eliminar nota"
    message="¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer."
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<style scoped>
textarea {
  font-family: inherit;
  line-height: 1.5;
}

.notes-panel {
  transition: width 0.3s ease, min-width 0.3s ease;
}

.notes-panel.collapsed {
  width: 70px;
  min-width: 70px;
}
</style>

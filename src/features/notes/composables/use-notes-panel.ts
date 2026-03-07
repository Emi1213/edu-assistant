import { ref, computed, type Ref } from 'vue'
import { useCreateNote } from './mutations/use-create-note'
import { useUpdateNote } from './mutations/use-update-note'
import { useDeleteNote } from './mutations/use-delete-note'
import { useToast } from 'vue-toastification'
import type { Note } from '../types/notes.types'

export function useNotesPanel(
  pageId: number,
  notes: Ref<Note[] | null | undefined> | Note[] | null | undefined
) {
  const toast = useToast()

  const isCollapsed = ref(true)
  const isCreating = ref(false)
  const editingNoteId = ref<number | null>(null)
  const newNoteContent = ref('')
  const editNoteContent = ref('')
  const showDeleteDialog = ref(false)
  const noteToDelete = ref<number | null>(null)

  const { mutate: createNote, isPending: isCreatingNote } = useCreateNote(pageId)
  const { mutate: updateNote, isPending: isUpdatingNote } = useUpdateNote(pageId)
  const { mutate: deleteNote, isPending: isDeletingNote } = useDeleteNote(pageId)

  const userNotes = computed(() => {
    const notesValue = notes && typeof notes === 'object' && 'value' in notes ? notes.value : notes
    if (!notesValue || !Array.isArray(notesValue)) {
      return []
    }
    return notesValue
  })

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

  const startCreating = () => {
    if (isCollapsed.value) {
      isCollapsed.value = false
    }
    isCreating.value = true
    newNoteContent.value = ''
    setTimeout(() => {
      document.getElementById('new-note-textarea')?.focus()
    }, 100)
  }

  const cancelCreating = () => {
    isCreating.value = false
    newNoteContent.value = ''
  }

  const saveNewNote = () => {
    if (!newNoteContent.value.trim()) {
      toast.warning('La nota no puede estar vacía')
      return
    }

    createNote(
      {
        pageId,
        content: newNoteContent.value.trim(),
      },
      {
        onSuccess: () => {
          toast.success('Nota creada exitosamente')
          cancelCreating()
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Error al crear la nota')
        },
      }
    )
  }

  const startEditing = (note: Note) => {
    editingNoteId.value = note.id
    editNoteContent.value = note.content
    setTimeout(() => {
      document.getElementById(`edit-note-${note.id}`)?.focus()
    }, 100)
  }

  const cancelEditing = () => {
    editingNoteId.value = null
    editNoteContent.value = ''
  }

  const saveEdit = (noteId: number) => {
    if (!editNoteContent.value.trim()) {
      toast.warning('La nota no puede estar vacía')
      return
    }

    updateNote(
      {
        noteId,
        payload: { content: editNoteContent.value.trim() },
      },
      {
        onSuccess: () => {
          toast.success('Nota actualizada exitosamente')
          cancelEditing()
        },
        onError: (error: any) => {
          toast.error(error.message || 'Error al actualizar la nota')
        },
      }
    )
  }

  const openDeleteDialog = (noteId: number) => {
    noteToDelete.value = noteId
    showDeleteDialog.value = true
  }

  const cancelDelete = () => {
    showDeleteDialog.value = false
    noteToDelete.value = null
  }

  const confirmDelete = () => {
    if (noteToDelete.value === null) return

    deleteNote(noteToDelete.value, {
      onSuccess: () => {
        toast.success('Nota eliminada exitosamente')
        cancelDelete()
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al eliminar la nota')
      },
    })
  }

  const formatDate = (date: string | Date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Hace un momento'
    if (minutes < 60) return `Hace ${minutes} min`
    if (hours < 24) return `Hace ${hours}h`
    if (days < 7) return `Hace ${days}d`
    
    return d.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  return {
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
  }
}

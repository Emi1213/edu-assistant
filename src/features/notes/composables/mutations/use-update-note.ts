import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { notesService } from '../../services/notes.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { UpdateNote } from '../../types/notes.types'

export function useUpdateNote(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ noteId, payload }: { noteId: number; payload: UpdateNote }) =>
      notesService.updateNote(noteId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(pageId) })
    },
  })
}

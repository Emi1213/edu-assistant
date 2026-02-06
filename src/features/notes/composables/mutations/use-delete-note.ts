import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { notesService } from '../../services/notes.services'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useDeleteNote(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noteId: number) => notesService.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(pageId) })
    },
  })
}

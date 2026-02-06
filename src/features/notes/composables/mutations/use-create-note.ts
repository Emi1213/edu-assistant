import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { notesService } from '../../services/notes.services'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { CreateNote } from '../../types/notes.types'

export function useCreateNote(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateNote) => notesService.createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(pageId) })
    },
  })
}

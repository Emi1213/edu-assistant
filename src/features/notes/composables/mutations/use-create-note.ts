import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { notesService } from '../../services/notes.service'
import type { CreateNote } from '../../types/notes.types'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useCreateNote(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateNote) => notesService.createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(pageId) })
    },
  })
}

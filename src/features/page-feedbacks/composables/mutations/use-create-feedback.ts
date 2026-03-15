import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { pageFeedbacksService } from '../../services/page-feedbacks.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { CreatePageFeedback } from '../../types/page-feedbacks.types'

export function useCreateFeedback(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePageFeedback) => pageFeedbacksService.createFeedback(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(pageId) })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { pageFeedbacksService } from '../../services/page-feedbacks.services'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useDeleteFeedback(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (feedbackId: number) => pageFeedbacksService.deleteFeedback(feedbackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(pageId) })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { pageFeedbacksService } from '../../services/page-feedbacks.services'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { UpdatePageFeedback } from '../../types/page-feedbacks.types'

export function useUpdateFeedback(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ feedbackId, payload }: { feedbackId: number; payload: UpdatePageFeedback }) =>
      pageFeedbacksService.updateFeedback(feedbackId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(pageId) })
    },
  })
}

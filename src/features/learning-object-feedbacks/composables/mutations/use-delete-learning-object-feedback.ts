import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { learningObjectFeedbacksService } from '../../services/learning-object-feedbacks.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useDeleteLearningObjectFeedback(learningObjectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (feedbackId: number) => learningObjectFeedbacksService.deleteFeedback(feedbackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(learningObjectId) })
    },
  })
}

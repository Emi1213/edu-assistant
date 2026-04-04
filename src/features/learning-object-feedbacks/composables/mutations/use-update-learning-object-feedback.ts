import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { learningObjectFeedbacksService } from '../../services/learning-object-feedbacks.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { UpdateLearningObjectFeedback } from '../../types/learning-object-feedbacks.types'

export function useUpdateLearningObjectFeedback(learningObjectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ feedbackId, payload }: { feedbackId: number; payload: UpdateLearningObjectFeedback }) =>
      learningObjectFeedbacksService.updateFeedback(feedbackId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(learningObjectId) })
    },
  })
}

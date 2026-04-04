import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { learningObjectFeedbacksService } from '../../services/learning-object-feedbacks.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { CreateLearningObjectFeedback } from '../../types/learning-object-feedbacks.types'

export function useCreateLearningObjectFeedback(learningObjectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateLearningObjectFeedback) => learningObjectFeedbacksService.createFeedback(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(learningObjectId) })
    },
  })
}

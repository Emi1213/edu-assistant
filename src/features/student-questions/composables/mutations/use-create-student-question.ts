import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { studentQuestionsService } from '../../services/student-questions.service'
import type { CreateStudentQuestionPayload } from '../../types/student-questions.types'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useCreateStudentQuestion(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateStudentQuestionPayload) =>
      studentQuestionsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(pageId) })
    },
  })
}

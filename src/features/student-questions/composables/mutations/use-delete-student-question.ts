import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { studentQuestionsService } from '../../services/student-questions.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useDeleteStudentQuestion(learningObjectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => studentQuestionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(learningObjectId) })
    },
  })
}

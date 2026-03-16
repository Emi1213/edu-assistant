import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { studentQuestionsService } from '../../services/student-questions.service'
import type { UpdateStudentQuestionPayload } from '../../types/student-questions.types'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useUpdateStudentQuestion(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateStudentQuestionPayload
    }) => studentQuestionsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(pageId) })
    },
  })
}

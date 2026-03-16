import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { questionRepliesService } from '../../services/question-replies.service'
import type { CreateQuestionReplyPayload } from '../../types/student-questions.types'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useCreateQuestionReply(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateQuestionReplyPayload) =>
      questionRepliesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(pageId) })
    },
  })
}

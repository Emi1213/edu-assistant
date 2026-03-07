import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { questionRepliesService } from '../../services/question-replies.service'
import type { UpdateQuestionReplyPayload } from '../../types/pages.types'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useUpdateQuestionReply(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: { id: number; payload: UpdateQuestionReplyPayload }) =>
      questionRepliesService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(pageId) })
    },
  })
}

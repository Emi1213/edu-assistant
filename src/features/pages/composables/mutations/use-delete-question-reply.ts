import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { questionRepliesService } from '../../services/question-replies.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useDeleteQuestionReply(pageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => questionRepliesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(pageId) })
    },
  })
}

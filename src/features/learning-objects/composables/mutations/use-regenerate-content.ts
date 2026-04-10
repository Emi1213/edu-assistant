import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { LearningObjectsDataSource } from '../../services/learning-objects.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const learningObjectsDataSource = new LearningObjectsDataSource()

export function useRegenerateContentMutation(learningObjectId: MaybeRefOrGetter<number>) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: { instructions: string }) =>
      learningObjectsDataSource.regenerateContent(toValue(learningObjectId), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(toValue(learningObjectId)) })
    },
  })

  return mutation
}

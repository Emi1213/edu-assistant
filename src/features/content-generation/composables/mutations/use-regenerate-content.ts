import { type MaybeRefOrGetter, toValue } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ContentGenerationDataSource } from '../../services/content-generation.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { CreateContentGeneration } from '../../types'

const contentGenerationDataSource = new ContentGenerationDataSource()

export function useRegenerateContent(learningObjectId: MaybeRefOrGetter<number>) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: Omit<CreateContentGeneration, 'learningObjectId'>) =>
      contentGenerationDataSource.regenerateContent({
        ...payload,
        learningObjectId: toValue(learningObjectId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(toValue(learningObjectId)) })
    },
  })

  return mutation
}

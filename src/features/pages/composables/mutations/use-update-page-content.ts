import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { LearningObjectsDataSource } from '../../services/pages.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { UpdateLearningObjectContentPayload } from '../../types'

const learningObjectsDataSource = new LearningObjectsDataSource()

export function useUpdateLearningObjectContent(learningObjectId: number) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: UpdateLearningObjectContentPayload) => 
      learningObjectsDataSource.updateContent(learningObjectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(learningObjectId) })
    },
  })

  return mutation
}


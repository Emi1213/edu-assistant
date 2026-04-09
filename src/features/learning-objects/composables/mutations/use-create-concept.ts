import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { LearningObjectsDataSource } from '../../services/learning-objects.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { CreateConceptPayload } from '../../types'

const learningObjectsDataSource = new LearningObjectsDataSource()

export function useCreateConcept(learningObjectId: number) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: CreateConceptPayload) =>
      learningObjectsDataSource.createConcept(learningObjectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(learningObjectId) })
    },
  })

  return mutation
}


import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { LearningObjectsDataSource } from '../../services/pages.service'
import type { CreateLearningObjectPayload } from '../../types'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const learningObjectsDataSource = new LearningObjectsDataSource()

export function useCreateLearningObject(moduleId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateLearningObjectPayload) => learningObjectsDataSource.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECTS({ moduleId }) })
    },
  })
}


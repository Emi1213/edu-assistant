import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { LearningObjectsDataSource } from '../../services/learning-objects.service'
import type { ReorderLearningObjectsPayload } from '../../types'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const learningObjectsDataSource = new LearningObjectsDataSource()

export function useReorderLearningObjects(moduleId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReorderLearningObjectsPayload) => learningObjectsDataSource.reorder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECTS({ moduleId }) })
    },
  })
}

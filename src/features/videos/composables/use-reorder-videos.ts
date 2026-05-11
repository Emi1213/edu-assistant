import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { LearningObjectsDataSource } from '@/features/learning-objects/services/learning-objects.service'
import type { ReorderLearningObjectsPayload } from '@/features/learning-objects/types'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const learningObjectsDataSource = new LearningObjectsDataSource()

export function useReorderVideos(moduleId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReorderLearningObjectsPayload) =>
      learningObjectsDataSource.reorder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['videos', 'module', moduleId],
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.LEARNING_OBJECTS({ moduleId }),
      })
    },
  })
}

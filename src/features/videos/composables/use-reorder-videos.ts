import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { LearningObjectsDataSource } from '@/features/learning-objects/services/learning-objects.service'
import type { ReorderLearningObjectsPayload } from '@/features/learning-objects/types'

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
        queryKey: ['learning-objects', moduleId],
      })
    },
  })
}

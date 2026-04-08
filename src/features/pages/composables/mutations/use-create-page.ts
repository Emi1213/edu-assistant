import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { LearningObjectsDataSource } from '@/features/learning-objects/services/learning-objects.service'
import type { CreateLearningObjectPayload } from '@/features/learning-objects/types/learning-object.types'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const dataSource = new LearningObjectsDataSource()

export function useCreatePage(moduleId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateLearningObjectPayload) => dataSource.create(payload),
    onSuccess: (data) => {
      if (data?.type?.id) {
        queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.LEARNING_OBJECTS(moduleId), data.type.id] })
      }
    },
  })
}

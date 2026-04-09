import { unref, type MaybeRef } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { LearningObjectsDataSource } from '../../services/learning-objects.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { UpdateLearningObjectPayload } from '../../types'

const learningObjectsDataSource = new LearningObjectsDataSource()

export function useUpdateLearningObject(learningObjectIdRef: MaybeRef<number>) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: UpdateLearningObjectPayload) =>
      learningObjectsDataSource.update(unref(learningObjectIdRef), payload),
    onSuccess: () => {
      const id = unref(learningObjectIdRef)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEARNING_OBJECT(id) })
      queryClient.invalidateQueries({ queryKey: ['learning-objects'], exact: false })
    },
  })

  return mutation
}


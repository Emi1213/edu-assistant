import { toValue, type MaybeRefOrGetter } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from '@/shared/composables/use-toast'
import { LearningObjectsDataSource } from '@/features/learning-objects/services/learning-objects.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const learningObjectsDataSource = new LearningObjectsDataSource()

export function useToggleVideoPublish(moduleId: MaybeRefOrGetter<number>) {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (args: { id: number; isPublished: boolean }) =>
      learningObjectsDataSource.update(args.id, { isPublished: args.isPublished }),
    onSuccess: (_data, args) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.VIDEOS_BY_MODULE({ moduleId: toValue(moduleId) }),
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VIDEO_DETAIL(args.id) })
      toast.success(args.isPublished ? 'Video publicado' : 'Video despublicado')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'No se pudo actualizar')
    },
  })
}

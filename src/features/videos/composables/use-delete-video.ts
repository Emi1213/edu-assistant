import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from '@/shared/composables/use-toast'
import { videosDataSource } from '../services/videos.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useDeleteVideo(moduleId: number) {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (id: number) => videosDataSource.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS_BY_MODULE({ moduleId }) })
      toast.success('Video eliminado')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'No se pudo eliminar el video')
    },
  })
}

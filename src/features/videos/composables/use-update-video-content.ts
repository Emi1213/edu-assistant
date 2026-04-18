import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from '@/shared/composables/use-toast'
import { videosDataSource } from '../services/videos.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { UpdateVideoContentPayload } from '../types/video-update.types'

export function useUpdateVideoContent(videoId: number, moduleId: number) {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (payload: UpdateVideoContentPayload) =>
      videosDataSource.updateContent(videoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VIDEO_DETAIL(videoId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VIDEOS_BY_MODULE({ moduleId }) })
      toast.success('Cambios guardados')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'No se pudo guardar')
    },
  })
}

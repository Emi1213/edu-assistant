import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from '@/shared/composables/use-toast'
import { videosDataSource } from '../services/videos.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { CreateVideoFromUrlPayload } from '../types/video-create.types'

export function useCreateVideoFromUrl() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (payload: CreateVideoFromUrlPayload) => videosDataSource.createFromUrl(payload),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.VIDEOS_BY_MODULE({ moduleId: payload.moduleId }),
      })
      toast.success('Video en procesamiento')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'No se pudo crear el video')
    },
  })
}

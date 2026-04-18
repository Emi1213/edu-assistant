import { ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from '@/shared/composables/use-toast'
import { videosDataSource } from '../services/videos.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { UploadVideoFilePayload } from '../types/video-create.types'

export function useUploadVideoFile() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const progress = ref(0)

  const mutation = useMutation({
    mutationFn: (payload: UploadVideoFilePayload) =>
      videosDataSource.uploadFile(payload, (p) => {
        progress.value = p
      }),
    onMutate: () => {
      progress.value = 0
    },
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.VIDEOS_BY_MODULE({ moduleId: payload.moduleId }),
      })
      toast.success('Video en procesamiento')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'No se pudo subir el video')
    },
  })

  return Object.assign(mutation, { progress })
}

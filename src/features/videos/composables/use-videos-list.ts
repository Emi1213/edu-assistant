import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { videosDataSource } from '../services/videos.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { POLLING_INTERVAL_MS } from '../constants/video-processing.constants'
import { isProcessingStatus } from '../constants/video-status.constants'
import type { VideoFiltersDto } from '../types/video.types'

interface UseVideosListParams {
  moduleId: number
  filters?: VideoFiltersDto
}

export function useVideosList(params: Ref<UseVideosListParams>, enabled?: Ref<boolean>) {
  const query = useQuery({
    queryKey: computed(() => QUERY_KEYS.VIDEOS_BY_MODULE(params.value)),
    queryFn: () => videosDataSource.findAllByModule(params.value.moduleId, params.value.filters),
    enabled: enabled ?? computed(() => true),
    refetchInterval: (q) => {
      const data = q.state.data
      if (!data) return false
      const anyProcessing = data.records.some((v) => isProcessingStatus(v.status))
      return anyProcessing ? POLLING_INTERVAL_MS : false
    },
  })

  return {
    videos: computed(() => query.data.value?.records ?? []),
    total: computed(() => query.data.value?.total ?? 0),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

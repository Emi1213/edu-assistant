import { computed, watch, type Ref } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { videosDataSource } from '../services/videos.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { POLLING_INTERVAL_MS } from '../constants/video-processing.constants'
import { isProcessingStatus } from '../constants/video-status.constants'
import { useVideoStatus } from './use-video-status'

export function useVideoDetail(videoId: Ref<number>) {
  const queryClient = useQueryClient()

  const detail = useQuery({
    queryKey: computed(() => QUERY_KEYS.VIDEO_DETAIL(videoId.value)),
    queryFn: () => videosDataSource.findOne(videoId.value),
    refetchInterval: (q) => {
      const s = q.state.data?.status
      return s && isProcessingStatus(s) ? POLLING_INTERVAL_MS : false
    },
  })

  const statusEnabled = computed(() => isProcessingStatus(detail.data.value?.status))
  const statusQuery = useVideoStatus(videoId, statusEnabled)

  watch(
    () => statusQuery.data.value?.status,
    (curr, prev) => {
      if (curr === 'COMPLETED' && prev !== 'COMPLETED') {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VIDEO_DETAIL(videoId.value) })
      }
    },
  )

  return {
    video: detail.data,
    isLoading: detail.isLoading,
    isError: detail.isError,
    error: detail.error,
    status: computed(() => statusQuery.data.value?.status ?? detail.data.value?.status),
    errorMessage: computed(
      () => statusQuery.data.value?.errorMessage ?? detail.data.value?.errorMessage ?? null,
    ),
    refetch: detail.refetch,
  }
}

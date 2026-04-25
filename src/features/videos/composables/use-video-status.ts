import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { videosDataSource } from '../services/videos.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { POLLING_INTERVAL_MS } from '../constants/video-processing.constants'

export function useVideoStatus(videoId: Ref<number>, enabled: Ref<boolean>) {
  return useQuery({
    queryKey: computed(() => QUERY_KEYS.VIDEO_STATUS(videoId.value)),
    queryFn: () => videosDataSource.getStatus(videoId.value),
    enabled,
    refetchInterval: POLLING_INTERVAL_MS,
  })
}

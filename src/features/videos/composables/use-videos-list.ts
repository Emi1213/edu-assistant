import { computed, type Ref, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { videosDataSource } from '../services/videos.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { POLLING_INTERVAL_MS } from '../constants/video-processing.constants'
import { isProcessingStatus } from '../constants/video-status.constants'
import type { VideoFiltersDto, VideoDto } from '../types/video.types'

interface UseVideosListParams {
  moduleId: number
  filters?: VideoFiltersDto
}

export function useVideosList(params: Ref<UseVideosListParams>, enabled?: Ref<boolean>) {
  const currentPage = ref(1)
  const pageSize = ref(10)
  const loadedVideos = ref<VideoDto[]>([])
  const totalItems = ref(0)
  const totalPages = ref(0)

  const queryParams = computed(() => {
    return {
      moduleId: params.value.moduleId,
      filters: {
        ...params.value.filters,
        page: currentPage.value,
        limit: pageSize.value,
      }
    }
  })

  const query = useQuery({
    queryKey: computed(() => QUERY_KEYS.VIDEOS_BY_MODULE(queryParams.value)),
    queryFn: () => videosDataSource.findAllByModule(queryParams.value.moduleId, queryParams.value.filters),
    enabled: enabled ?? computed(() => true),
    refetchInterval: (q) => {
      const data = q.state.data
      if (!data) return false
      const anyProcessing = data.records.some((v) => isProcessingStatus(v.status))
      return anyProcessing ? POLLING_INTERVAL_MS : false
    },
  })

  watch(query.data, (response) => {
    if (response) {
      totalItems.value = response.total
      totalPages.value = response.pages

      if (currentPage.value === 1) {
        loadedVideos.value = [...response.records]
      } else {
        const existingIds = new Set(loadedVideos.value.map(v => v.id))
        const newItems = response.records.filter(v => !existingIds.has(v.id))
        loadedVideos.value = [...loadedVideos.value, ...newItems]
      }
    }
  }, { immediate: true })

  watch([() => params.value.moduleId, () => params.value.filters], () => {
    currentPage.value = 1
    loadedVideos.value = []
    totalItems.value = 0
  }, { deep: true })

  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const isFetchingNextPage = computed(() => query.isFetching.value && currentPage.value > 1)

  const loadMore = () => {
    if (hasNextPage.value && !query.isFetching.value) {
      currentPage.value++
    }
  }

  const reset = () => {
    currentPage.value = 1
    loadedVideos.value = []
    totalItems.value = 0
  }

  const refreshAll = async () => {
    const totalToFetch = loadedVideos.value.length || pageSize.value
    const response = await videosDataSource.findAllByModule(params.value.moduleId, {
      ...params.value.filters,
      page: 1,
      limit: totalToFetch,
    })

    if (response) {
      loadedVideos.value = [...response.records]
      totalItems.value = response.total
      totalPages.value = response.pages
    }
  }

  return {
    videos: computed(() => loadedVideos.value),
    total: totalItems,
    isLoading: query.isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    reset,
    refreshAll,
  }
}

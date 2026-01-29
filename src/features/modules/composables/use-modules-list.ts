import { ref, computed } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { modulesService } from '../services/modules.service'
import { modulesKeys } from './queries/useModuleQueries'
import type { IModuleQueryParams } from '../types/modules.types'

export const useModulesList = () => {
  const searchQuery = ref('')

  const params = computed<IModuleQueryParams>(() => ({
    search: searchQuery.value || undefined,
    limit: 12,
  }))

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [modulesKeys.all, params],
    queryFn: async ({ pageParam = 1 }) => {
      return modulesService.getAllModules({
        ...params.value,
        page: pageParam,
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil((lastPage.total || 0) / (lastPage.limit || 12))
      return allPages.length < totalPages ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
  })

  const modules = computed(() => {
    return data.value?.pages?.flatMap((page) => page.records) || []
  })

  const updateSearch = (query: string) => {
    searchQuery.value = query
  }

  const clearFilters = () => {
    searchQuery.value = ''
  }

  const loadMore = () => {
    fetchNextPage()
  }

  return {
    modules,
    isLoading,
    isFetchingNextPage,
    hasNextPage: computed(() => hasNextPage.value),
    searchQuery,
    updateSearch,
    clearFilters,
    loadMore,
  }
}

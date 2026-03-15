import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { refDebounced } from '@vueuse/core'
import { useAvailableModules } from './queries/use-available-modules'
import type { ModuleQueryParams } from '../types/modules.types'
import type { Module } from '../types/modules.types'

export function useAvailableModulesList() {
  const router = useRouter()
  const route = useRoute()
  const searchQuery = ref<string>((route.query.search as string) || '')
  const debouncedSearchQuery = refDebounced(searchQuery, 300)

  const currentPage = ref(1)
  const pageSize = ref(6)
  const loadedModules = ref<Module[]>([])
  const totalPages = ref(0)

  const queryParams = computed<ModuleQueryParams>(() => {
    const params: ModuleQueryParams = {
      page: currentPage.value,
      limit: pageSize.value,
    }
    
    if (debouncedSearchQuery.value) {
      params.search = debouncedSearchQuery.value
    }
    
    return params
  })

  const { data: paginatedResponse, isLoading, isFetching, error, refetch } = useAvailableModules(queryParams)

  watch(paginatedResponse, (response) => {
    if (response) {
      totalPages.value = response.pages
      
      if (currentPage.value === 1) {
        loadedModules.value = [...response.records]
      } else {
        loadedModules.value = [...loadedModules.value, ...response.records]
      }
    }
  }, { immediate: true })

  const modules = computed(() => loadedModules.value)

  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  const isFetchingNextPage = computed(() => isFetching.value && currentPage.value > 1)

  const updateURL = () => {
    const query: Record<string, string> = {}

    if (searchQuery.value) query.search = searchQuery.value

    router.replace({ query })
  }

  watch([searchQuery], updateURL, {
    deep: true,
  })

  watch(debouncedSearchQuery, () => {
    currentPage.value = 1
    loadedModules.value = []
  })

  const updateSearch = (query: string) => {
    searchQuery.value = query
  }

  const clearFilters = () => {
    searchQuery.value = ''
  }

  const loadMore = () => {
    if (hasNextPage.value && !isFetching.value) {
      currentPage.value++
    }
  }

  return {
    modules,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    searchQuery,
    updateSearch,
    clearFilters,
    loadMore,
    refetch,
    error,
  }
}

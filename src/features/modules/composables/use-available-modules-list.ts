import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { debouncedRef } from '@vueuse/core'
import { useAvailableModules } from './queries/use-available-modules'
import type { ModuleQueryParams } from '../types/modules.types'

export function useAvailableModulesList() {
  const router = useRouter()
  const route = useRoute()
  const searchQuery = ref<string>((route.query.search as string) || '')
  const debouncedSearchQuery = debouncedRef(searchQuery, 300)

  const currentPage = ref(parseInt(route.query.page as string) || 0)
  const pageSize = ref(6)

  const queryParams = computed<ModuleQueryParams>(() => {
    const params: ModuleQueryParams = {
      page: currentPage.value + 1,
      limit: pageSize.value,
    }
    
    if (debouncedSearchQuery.value) {
      params.search = debouncedSearchQuery.value
    }
    
    return params
  })

  const { data: paginatedResponse, isLoading, error, refetch } = useAvailableModules(queryParams)

  const modules = computed(() => paginatedResponse.value?.records || [])
  const totalPages = computed(() => paginatedResponse.value?.pages || 0)

  const updateURL = () => {
    const query: Record<string, string> = {}

    if (searchQuery.value) query.search = searchQuery.value
    if (currentPage.value > 0) query.page = currentPage.value.toString()

    router.replace({ query })
  }

  watch([searchQuery, currentPage], updateURL, {
    deep: true,
  })

  const updateSearch = (query: string) => {
    searchQuery.value = query
    currentPage.value = 0
  }

  const goToPreviousPage = () => {
    if (currentPage.value > 0) {
      currentPage.value--
    }
  }

  const goToNextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
      currentPage.value++
    }
  }

  const clearFilters = () => {
    searchQuery.value = ''
    currentPage.value = 0
  }

  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value - 1
  })

  return {
    modules,
    isLoading,
    error,
    searchQuery,
    currentPage,
    hasNextPage,
    updateSearch,
    clearFilters,
    goToPreviousPage,
    goToNextPage,
    refetch,
  }
}

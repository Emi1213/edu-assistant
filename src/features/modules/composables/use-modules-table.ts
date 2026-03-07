import { computed } from 'vue'
import { useModules } from './queries/use-modules'
import { useModulesFiltersUrl } from './use-modules-filters-url'

export function useModulesTable() {
  const {
    searchQuery,
    currentPage,
    pageSize,
    filters,
    updateSearch,
    updatePage,
    clearFilters,
  } = useModulesFiltersUrl()

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useModules(filters)

  const modules = computed(() => response.value?.records || [])
  const totalRecords = computed(() => response.value?.total || 0)
  const totalPages = computed(() => response.value?.pages || 0)

  return {
    modules,
    isLoading,
    error,
    totalRecords,
    totalPages,
    searchQuery,
    currentPage,
    pageSize,
    updateSearch,
    updatePage,
    clearFilters,
    refetch,
  }
}

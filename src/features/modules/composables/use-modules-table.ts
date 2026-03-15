import { computed, ref, watch } from 'vue'
import type { Module } from '../types/modules.types'
import { useModules } from './queries/use-modules'
import { useModulesFiltersUrl } from './use-modules-filters-url'

export function useModulesTable() {
  const {
    searchQuery,
    debouncedSearchQuery,
    currentPage,
    pageSize,
    filters,
    updateSearch,
    updatePage,
    clearFilters,
  } = useModulesFiltersUrl()

  const loadedModules = ref<Module[]>([])
  const totalPagesRef = ref(0)
  const totalRecordsRef = ref(0)

  const {
    data: response,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useModules(filters)

  watch(
    response,
    (data) => {
      if (!data) return
      totalPagesRef.value = data.pages ?? 0
      totalRecordsRef.value = data.total ?? 0
      if (currentPage.value === 1) {
        loadedModules.value = [...data.records]
      } else {
        loadedModules.value = [...loadedModules.value, ...data.records]
      }
    },
    { immediate: true }
  )

  watch(debouncedSearchQuery, () => {
    loadedModules.value = []
  })

  const modules = computed(() => loadedModules.value)
  const totalRecords = computed(() => totalRecordsRef.value)
  const totalPages = computed(() => totalPagesRef.value)
  const hasNextPage = computed(() => currentPage.value < totalPagesRef.value)
  const isFetchingNextPage = computed(() => isFetching.value && currentPage.value > 1)

  const loadMore = () => {
    if (hasNextPage.value && !isFetching.value) {
      updatePage(currentPage.value + 1)
    }
  }

  return {
    modules,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    totalRecords,
    totalPages,
    searchQuery,
    currentPage,
    pageSize,
    updateSearch,
    updatePage,
    clearFilters,
    loadMore,
    refetch,
  }
}

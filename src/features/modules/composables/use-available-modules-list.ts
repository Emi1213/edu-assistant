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

  const currentPage = ref<number>(Number(route.query.page) || 1)
  const pageSize = ref<number>(6)
  const loadedModules = ref<Module[]>([])
  const totalPages = ref<number>(0)
  const totalItems = ref<number>(0)

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

  watch(
    paginatedResponse,
    (response) => {
      if (response) {
        totalPages.value = response.pages ?? 0
        totalItems.value = response.total ?? 0
        loadedModules.value = response.records ?? []
      }
    },
    { immediate: true }
  )

  const modules = computed(() => loadedModules.value)

  const updateURL = () => {
    const query: Record<string, string> = {}

    if (searchQuery.value) query.search = searchQuery.value
    if (currentPage.value > 1) query.page = String(currentPage.value)

    router.replace({ query })
  }

  watch([searchQuery, currentPage], updateURL, { deep: true })

  watch(debouncedSearchQuery, () => {
    currentPage.value = 1
  })

  const updateSearch = (query: string) => {
    searchQuery.value = query
  }

  const clearFilters = () => {
    searchQuery.value = ''
    currentPage.value = 1
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      goToPage(currentPage.value + 1)
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      goToPage(currentPage.value - 1)
    }
  }

  return {
    modules,
    isLoading,
    isFetching,
    searchQuery,
    updateSearch,
    clearFilters,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    refetch,
    error,
  }
}

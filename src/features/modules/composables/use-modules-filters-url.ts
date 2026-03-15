import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { refDebounced } from '@vueuse/core'
import type { ModuleQueryParams } from '../types/modules.types'

export function useModulesFiltersUrl() {
  const router = useRouter()
  const route = useRoute()
  const searchQuery = ref((route.query.search as string) || '')
  const debouncedSearchQuery = refDebounced(searchQuery, 300)

  const currentPage = ref(1)
  const pageSize = ref(12)

  const filters = computed(
    (): ModuleQueryParams => ({
      page: currentPage.value,
      limit: pageSize.value,
      search: debouncedSearchQuery.value || undefined,
    })
  )

  const updateURL = () => {
    const query: Record<string, string> = {}
    if (searchQuery.value) query.search = searchQuery.value
    router.replace({ query })
  }

  watch(searchQuery, updateURL, { deep: true })

  const updateSearch = (query: string) => {
    searchQuery.value = query
    currentPage.value = 1
  }

  const updatePage = (page: number) => {
    currentPage.value = page
  }

  const clearFilters = () => {
    searchQuery.value = ''
    currentPage.value = 1
  }

  return {
    searchQuery,
    debouncedSearchQuery,
    currentPage,
    pageSize,
    filters,
    updateSearch,
    updatePage,
    clearFilters,
  }
}

import type { MaybeRef } from 'vue'
import { computed, unref } from 'vue'
import { usePages } from './queries/use-pages'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 100

export function usePagesTable(moduleId: MaybeRef<number>) {
  const pageParams = computed(() => ({
    moduleId: unref(moduleId),
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  }))

  const { data: pagesResponse, isLoading: isLoadingPages } = usePages(pageParams)

  const pages = computed(() => pagesResponse.value?.records ?? [])

  return {
    pages,
    isLoadingPages,
    pagesResponse,
  }
}

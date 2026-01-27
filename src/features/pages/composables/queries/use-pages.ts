import type { ComputedRef } from 'vue'
import type { PageQueryParams } from '../../types/pages.types'
import { useQuery } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { PagesDataSource } from '../../services/pages.services'

const pagesDataSource = new PagesDataSource()

export interface PagesQueryParams extends PageQueryParams {
  moduleId: number
}

export function usePages(params: ComputedRef<PagesQueryParams>) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.PAGES, params],
    queryFn: () => {
      const { moduleId, ...queryParams } = params.value
      return pagesDataSource.getByModuleId(moduleId, queryParams)
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
  return query
}

import type { ComputedRef } from 'vue'
import type { PagesQueryParams } from '../../types'
import { useQuery } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { PagesDataSource } from '../../services/pages.service'

const pagesDataSource = new PagesDataSource()

export function usePages(params: ComputedRef<PagesQueryParams>) {
  const query = useQuery({
    queryKey: QUERY_KEYS.PAGES(params.value),
    queryFn: () => {
      const { moduleId, ...queryParams } = params.value
      return pagesDataSource.getByModuleId(moduleId, queryParams)
    },
  })
  return query
}

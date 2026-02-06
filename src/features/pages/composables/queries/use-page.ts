import { useQuery } from '@tanstack/vue-query'
import { PagesDataSource } from '../../services/pages.services'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const pagesDataSource = new PagesDataSource()

export function usePage(id: number) {
  const query = useQuery({
    queryKey: QUERY_KEYS.PAGE(id),
    queryFn: () => pagesDataSource.getById(id),
  })
  return query
}

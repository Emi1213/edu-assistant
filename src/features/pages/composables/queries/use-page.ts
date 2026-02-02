import { useQuery } from '@tanstack/vue-query'
import { PagesDataSource } from '../../services/pages.services'

const pagesDataSource = new PagesDataSource()

export function usePage(id: number) {
  const query = useQuery({
    queryKey: ['pages', String(id)],
    queryFn: () => pagesDataSource.getById(id),
  })
  return query
}

import { useQuery } from '@tanstack/vue-query'
import { PagesDataSource } from '../../services/pages.services'

const pagesDataSource = new PagesDataSource()

export function usePage(id: number) {
  const query = useQuery({
    queryKey: ['page', id],
    queryFn: () => pagesDataSource.getById(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
  return query
}

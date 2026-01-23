import { useQuery } from '@tanstack/vue-query'
import { ModulesDataSource } from '../../services/modules.services'

const modulesDataSource = new ModulesDataSource()

export function useModule(id: number) {
  const query = useQuery({
    queryKey: ['module', id],
    queryFn: () => modulesDataSource.getById(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
  return query
}

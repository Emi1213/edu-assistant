import { useQuery } from '@tanstack/vue-query'
import { ModulesDataSource } from '../../services/modules.services'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const modulesDataSource = new ModulesDataSource()

export function useModule(id: number) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.MODULES, String(id)],
    queryFn: () => modulesDataSource.getById(id),
  })
  return query
}

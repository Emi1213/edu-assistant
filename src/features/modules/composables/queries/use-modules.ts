import type { ComputedRef } from 'vue'
import type { ModuleQueryParams } from '../../types/modules.types'
import { useQuery } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { ModulesDataSource } from '../../services/modules.service'

const modulesDataSource = new ModulesDataSource()

export function useModules(params: ComputedRef<ModuleQueryParams>) {
  const query = useQuery({
    queryKey: QUERY_KEYS.MODULES(params.value),
    queryFn: () => modulesDataSource.getAll(params.value),
  })
  return query
}

import type { ComputedRef } from 'vue'
import type { ModuleQueryParams } from '../../types/modules.types'
import { useQuery } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { ModulesDataSource } from '../../services/modules.services'

const modulesDataSource = new ModulesDataSource()

export function useAvailableModules(params: ComputedRef<ModuleQueryParams>) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.AVAILABLE_MODULES, params],
    queryFn: () => modulesDataSource.getAvailable(params.value),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
  return query
}

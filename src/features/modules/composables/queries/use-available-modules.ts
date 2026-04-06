import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import type { ModuleQueryParams } from '../../types/modules.types'
import { useQuery } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { ModulesDataSource } from '../../services/modules.service'

const modulesDataSource = new ModulesDataSource()

export function useAvailableModules(params: ComputedRef<ModuleQueryParams>) {
  const queryKey = computed(() => QUERY_KEYS.AVAILABLE_MODULES(params.value))
  const query = useQuery({
    queryKey,
    queryFn: () => modulesDataSource.getAvailable(params.value),
  })
  return query
}

import { useQuery } from '@tanstack/vue-query'
import { ModulesDataSource } from '../../services/modules.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { toValue, computed, type MaybeRefOrGetter } from 'vue'

const modulesDataSource = new ModulesDataSource()

export function useModule(id: MaybeRefOrGetter<number>) {
  const query = useQuery({
    queryKey: computed(() => QUERY_KEYS.MODULE(toValue(id))),
    queryFn: () => modulesDataSource.getById(toValue(id)),
  })
  return query
}

import { useQuery } from '@tanstack/vue-query'
import { ActivitiesDataSource } from '../../services/activities.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const dataSource = new ActivitiesDataSource()

export function useActivities(pageId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.ACTIVITIES(pageId),
    queryFn: () => dataSource.getByPageId(pageId),
    enabled: !!pageId,
  })
}

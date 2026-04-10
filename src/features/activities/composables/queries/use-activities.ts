import { useQuery } from '@tanstack/vue-query'
import { ActivitiesDataSource } from '../../services/activities.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const dataSource = new ActivitiesDataSource()

export function useActivities(learningObjectId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.ACTIVITIES(learningObjectId),
    queryFn: () => dataSource.getByLearningObjectId(learningObjectId),
    enabled: !!learningObjectId,
  })
}

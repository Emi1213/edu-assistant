import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ActivitiesDataSource } from '../../services/activities.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const dataSource = new ActivitiesDataSource()

export function useDeleteActivity(pageId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (activityId: number) =>
      dataSource.delete(pageId, activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVITIES(pageId) })
    },
  })
}

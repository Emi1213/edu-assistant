import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ActivitiesDataSource } from '../../services/activities.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { UpdateActivityPayload } from '../../types'

const dataSource = new ActivitiesDataSource()

export function useUpdateActivity(learningObjectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ activityId, payload }: { activityId: number; payload: UpdateActivityPayload }) =>
      dataSource.update(learningObjectId, activityId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVITIES(learningObjectId) })
    },
  })
}

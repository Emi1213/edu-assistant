import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ActivitiesDataSource } from '../../services/activities.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { CreateActivityPayload } from '../../types'

const dataSource = new ActivitiesDataSource()

export function useCreateActivity(learningObjectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateActivityPayload) =>
      dataSource.create(learningObjectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVITIES(learningObjectId) })
    },
  })
}

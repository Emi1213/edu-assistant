import { useMutation } from '@tanstack/vue-query'
import { ActivitiesDataSource } from '../../services/activities.services'
import type { CreateActivityAttemptPayload, ActivityAttemptResponse } from '../../types'

const dataSource = new ActivitiesDataSource()

export function useCreateActivityAttempt() {
  return useMutation({
    mutationFn: ({
      activityId,
      payload,
    }: {
      activityId: number
      payload: CreateActivityAttemptPayload
    }): Promise<ActivityAttemptResponse | null> =>
      dataSource.createAttempt(activityId, payload),
  })
}

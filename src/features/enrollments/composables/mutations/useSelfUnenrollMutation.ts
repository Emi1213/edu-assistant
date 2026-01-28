import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { EnrollmentsDataSource } from '../../services/enrollment.service'

const enrollmentsDataSource = new EnrollmentsDataSource()

export function useSelfUnenrollMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (moduleId: number) => enrollmentsDataSource.selfUnenroll(moduleId),
    onSuccess: (data) => {
      if (data && data.moduleId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MODULE_ENROLLMENTS(data.moduleId),
        })
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() })
    },
  })
}

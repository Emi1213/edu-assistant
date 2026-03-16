import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { EnrollmentsDataSource } from '../../services/enrollment.service'

const enrollmentsDataSource = new EnrollmentsDataSource()

export function useSelfUnenrollMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (moduleId: number) => enrollmentsDataSource.selfUnenroll(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULE_ENROLLMENTS() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AVAILABLE_MODULES() })
    },
  })
}

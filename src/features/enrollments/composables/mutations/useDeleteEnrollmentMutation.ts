import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { EnrollmentsDataSource } from '../../services/enrollment.service'

const enrollmentsDataSource = new EnrollmentsDataSource()

export function useDeleteEnrollmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => enrollmentsDataSource.removeEnrollment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULE_ENROLLMENTS() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() })
    },
  })
}

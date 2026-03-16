import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { EnrollmentsDataSource } from '../../services/enrollment.service'
import type { BulkEnrollStudentsPayload } from '../../types/enrollments.types'

const enrollmentsDataSource = new EnrollmentsDataSource()

export function useBulkEnrollMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BulkEnrollStudentsPayload) =>
      enrollmentsDataSource.bulkEnrollStudents(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULE_ENROLLMENTS() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() })
    },
  })
}

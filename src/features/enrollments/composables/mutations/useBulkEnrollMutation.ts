import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { EnrollmentsDataSource } from '../../services/enrollment.service'
import type { BulkEnrollStudentsPayload } from '../types/enrollments.types'

const enrollmentsDataSource = new EnrollmentsDataSource()

export function useBulkEnrollMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BulkEnrollStudentsPayload) =>
      enrollmentsDataSource.bulkEnrollStudents(payload),
    onSuccess: (data) => {
      if (data && data.length > 0 && data[0].moduleId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MODULE_ENROLLMENTS(data[0].moduleId),
        })
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { EnrollmentsDataSource } from '../../services/enrollment.service'
import type { UpdateEnrollmentPayload } from '../../types/enrollments.types'

const enrollmentsDataSource = new EnrollmentsDataSource()

export function useUpdateEnrollmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateEnrollmentPayload }) =>
      enrollmentsDataSource.updateEnrollment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULE_ENROLLMENTS() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { EnrollmentsDataSource } from '../../services/enrollment.service'

const enrollmentsDataSource = new EnrollmentsDataSource()

export function useSelfUnenrollMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (moduleId: number) => enrollmentsDataSource.selfUnenroll(moduleId),
    onSuccess: async (data) => {
      if (data?.moduleId != null) {
        await Promise.all([
          queryClient.refetchQueries({ queryKey: QUERY_KEYS.MODULE_ENROLLMENTS(data.moduleId) }),
          queryClient.refetchQueries({ queryKey: QUERY_KEYS.MODULE(data.moduleId) }),
        ])
      }
      await Promise.all([
        queryClient.refetchQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() }),
        queryClient.refetchQueries({ queryKey: ['available-modules'] }),
      ])
    },
  })
}

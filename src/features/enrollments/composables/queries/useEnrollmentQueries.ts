import type { Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { EnrollmentsDataSource } from '../../services/enrollment.service'
import type { EnrollmentStudent } from '../types/enrollments.types'

const enrollmentsDataSource = new EnrollmentsDataSource()

export function useGetModuleEnrollments(moduleId: Ref<number>) {
  const query = useQuery<EnrollmentStudent[] | null>({
    queryKey: [QUERY_KEYS.MODULE_ENROLLMENTS(moduleId.value)],
    queryFn: () => enrollmentsDataSource.getModuleEnrollments(moduleId.value),
    enabled: moduleId.value !== null && moduleId.value !== undefined,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
  return query
}

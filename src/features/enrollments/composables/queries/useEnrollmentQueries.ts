import type { Ref } from 'vue'
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { EnrollmentsDataSource } from '../../services/enrollment.service'
import type { Enrollment, EnrollmentStudent } from '../../types/enrollments.types'

const enrollmentsDataSource = new EnrollmentsDataSource()

export function useMyEnrollments() {
  return useQuery<Enrollment[] | null>({
    queryKey: QUERY_KEYS.ENROLLMENTS(),
    queryFn: () => enrollmentsDataSource.getMyEnrollments(),
    staleTime: 1000 * 60 * 2,
  })
}

export function useGetModuleEnrollments(moduleId: Ref<number>) {
  const queryKey = computed(() => QUERY_KEYS.MODULE_ENROLLMENTS(moduleId.value))
  const query = useQuery<EnrollmentStudent[] | null>({
    queryKey,
    queryFn: () => enrollmentsDataSource.getModuleEnrollments(moduleId.value),
    enabled: computed(() => moduleId.value != null && moduleId.value > 0),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
  return query
}

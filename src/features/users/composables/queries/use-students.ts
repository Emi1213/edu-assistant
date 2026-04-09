import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { StudentsQueryParams } from '../../types'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { UsersDataSource } from '../../services/users.service'

const usersDataSource = new UsersDataSource()

export function useStudents(params: ComputedRef<StudentsQueryParams>) {
  const query = useQuery({
    queryKey: QUERY_KEYS.STUDENTS(params.value),
    queryFn: () => usersDataSource.getStudents(params.value!),
    enabled: () => params.value != null,
  })
  return query
}

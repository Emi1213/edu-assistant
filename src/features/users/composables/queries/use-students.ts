import type { Ref } from 'vue'
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { UserProfile } from '@/features/auth/types/auth.types'
import { UsersDataSource } from '../../services/users.services'
import type { StudentsQueryParams } from '../../services/users.services'

const usersDataSource = new UsersDataSource()

export const STUDENTS_QUERY_KEY = ['users', 'students'] as const

export function useStudents(params: Ref<StudentsQueryParams | undefined>) {
  const queryKey = computed(() => {
    const p = params.value
    if (!p) return [STUDENTS_QUERY_KEY, null] as const
    return [STUDENTS_QUERY_KEY, p.page, p.limit, p.search ?? ''] as const
  })

  return useQuery({
    queryKey,
    queryFn: async (): Promise<UserProfile[] | null> => {
      const p = params.value
      if (!p) return null
      return usersDataSource.getStudents(p)
    },
    enabled: computed(() => params.value != null),
    staleTime: 1000 * 60 * 2,
  })
}

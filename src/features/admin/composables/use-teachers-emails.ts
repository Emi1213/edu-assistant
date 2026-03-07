import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { teachersEmailsService } from '../services/teachers-emails.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'

export function useTeachersEmails() {
  const queryClient = useQueryClient()

  const emailsQuery = useQuery({
    queryKey: QUERY_KEYS.TEACHERS_EMAILS(),
    queryFn: () => teachersEmailsService.get(),
  })

  const updateMutation = useMutation({
    mutationFn: (emails: string[]) => teachersEmailsService.update(emails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEACHERS_EMAILS() })
    },
  })

  return {
    emailsQuery,
    updateMutation,
  }
}

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { PagesDataSource } from '../../services/pages.service'
import type { CreatePagePayload } from '../../types'
import { QUERY_KEYS } from '@/shared/composables/query-key'

const pagesDataSource = new PagesDataSource()

export function useCreatePage(moduleId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePagePayload) => pagesDataSource.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGES({ moduleId }) })
    },
  })
}

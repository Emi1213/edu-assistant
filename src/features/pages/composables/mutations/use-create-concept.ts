import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { PagesDataSource } from '../../services/pages.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { CreateConceptPayload } from '../../types'

const pagesDataSource = new PagesDataSource()

export function useCreateConcept(pageId: number) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: CreateConceptPayload) =>
      pagesDataSource.createConcept(pageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(pageId) })
    },
  })

  return mutation
}

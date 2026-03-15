import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { PagesDataSource } from '../../services/pages.service'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { UpdatePageContentPayload } from '../../types'

const pagesDataSource = new PagesDataSource()

export function useUpdatePageContent(pageId: number) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: UpdatePageContentPayload) => 
      pagesDataSource.updateContent(pageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(pageId) })
    },
  })

  return mutation
}

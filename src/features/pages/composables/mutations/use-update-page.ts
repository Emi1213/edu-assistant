import { unref, type MaybeRef } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { PagesDataSource } from '../../services/pages.services'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { UpdatePagePayload } from '../../types/pages.types'

const pagesDataSource = new PagesDataSource()

export function useUpdatePage(pageIdRef: MaybeRef<number>) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: UpdatePagePayload) =>
      pagesDataSource.update(unref(pageIdRef), payload),
    onSuccess: () => {
      const id = unref(pageIdRef)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(id) })
      queryClient.invalidateQueries({ queryKey: ['pages'] })
    },
  })

  return mutation
}

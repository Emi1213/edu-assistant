import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { pagesService } from '../../services/pages.service'
import type { IPage, IUpdatePage } from '../../types/pages.types'
import { pagesKeys } from '../queries/usePageQueries'

export const useUpdatePageMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<
    IPage,
    Error,
    { id: IPage['id']; payload: IUpdatePage }
  >({
    mutationFn: async ({ id, payload }) => {
      return await pagesService.updatePage(id, payload)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.all })
      return data
    },
  })
}

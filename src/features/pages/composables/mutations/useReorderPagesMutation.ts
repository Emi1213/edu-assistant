import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { pagesService } from '../../services/pages.service'
import type { IPage, IReorderPages } from '../../types/pages.types'
import { pagesKeys } from '../queries/usePageQueries'

export const useReorderPagesMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<IPage[], Error, IReorderPages[]>({
    mutationFn: async (pages) => {
      return await pagesService.reorderPages(pages)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.all })
      return data
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { pagesService } from '../../services/pages.service'
import type { ICreatePage, IPage } from '../../types/pages.types'
import { pagesKeys } from '../queries/usePageQueries'

export const useCreatePageMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<IPage, Error, ICreatePage>({
    mutationFn: async (payload) => {
      return await pagesService.createPage(payload)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.all })
      return data
    },
  })
}

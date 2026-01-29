import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { modulesService } from '../../services/modules.service'
import type { IModule, IUpdateModule } from '../../types/modules.types'
import { modulesKeys } from '../queries/useModuleQueries'

export const useUpdateModuleMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<
    IModule,
    Error,
    { id: IModule['id']; payload: IUpdateModule }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await modulesService.updateModule(id, payload)
      return response
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: modulesKeys.all })
      queryClient.invalidateQueries({ queryKey: modulesKeys.moduleDetails(id) })
      return data
    },
  })
}
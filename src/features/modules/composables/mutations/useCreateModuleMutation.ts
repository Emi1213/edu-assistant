import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { modulesService } from '../../services/modules.service'
import type { ICreateModule, IModule } from '../../types/modules.types'
import { modulesKeys } from '../queries/useModuleQueries'

export const useCreateModuleMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<IModule, Error, ICreateModule>({
    mutationFn: async (payload) => {
      const response = await modulesService.createModule(payload)
      return response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: modulesKeys.all })
      return data
    },
  })
}
import { useQuery } from '@tanstack/vue-query'
import { modulesService } from '../../services/modules.service'
import { modulesKeys } from './useModuleQueries'
import type { IModule } from '../../types/modules.types'

export const useModule = (id: IModule['id']) => {
  return useQuery({
    queryKey: modulesKeys.detail(id),
    queryFn: async () => {
      return modulesService.getModuleById(id)
    },
    enabled: !!id,
  })
}

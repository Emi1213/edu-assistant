import { useQuery } from '@tanstack/vue-query'
import { modulesService } from '../../services/modules.service'
import type { IModule, IModuleQueryParams } from '../../types/modules.types'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'

export const modulesKeys = {
  all: ['modules'] as const,
  lists: () => [...modulesKeys.all, 'list'] as const,
  list: (params?: IModuleQueryParams) => [...modulesKeys.lists(), params] as const,
  details: () => [...modulesKeys.all, 'detail'] as const,
  detail: (id: number) => [...modulesKeys.details(), id] as const,
}

export const useModulesQuery = (params?: IModuleQueryParams) =>
  useQuery<IHttpPaginatedResponse<IModule>, Error>({
    queryKey: modulesKeys.list(params),
    queryFn: async () => {
      return modulesService.getAllModules(params)
    },
  })

export const useModuleQuery = (id: IModule['id']) =>
  useQuery<IModule, Error>({
    queryKey: modulesKeys.detail(id),
    queryFn: async () => {
      return modulesService.getModuleById(id)
    },
    enabled: !!id,
  })
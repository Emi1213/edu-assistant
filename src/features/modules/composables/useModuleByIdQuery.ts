import { useQuery } from '@tanstack/vue-query';
import { modulesService } from '../services/modules.service';
import type { IModule } from '../types/IModule';

export const useModuleByIdQuery = (id: number) => {
  return useQuery<IModule>({
    queryKey: ['module', id],
    queryFn: async () => {
      const response = await modulesService.getModuleById(id);
      return response.data as IModule;
    },
    enabled: !!id,
  });
};

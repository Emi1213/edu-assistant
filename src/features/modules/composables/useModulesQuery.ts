import { useQuery } from '@tanstack/vue-query';
import { modulesService } from '../services/modules.service';
import type { IModule } from '../types/IModule';

export const useModulesQuery = (teacherId?: number) => {
  return useQuery<IModule[]>({
    queryKey: ['modules', teacherId],
    queryFn: async () => {
      const response = await modulesService.getModules(teacherId);
      return response.data || [];
    },
  });
};

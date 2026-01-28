import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { modulesService } from '../services/modules.service';
import type { IModule } from '../types/IModule';
import type { ICreateModule } from '../types/ICreateModule';

export const useCreateModuleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IModule, Error, ICreateModule>({
    mutationFn: async (payload: ICreateModule) => {
      const response = await modulesService.createModule(payload);
      if (!response.data) {
        throw new Error('Failed to create module');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
  });
};

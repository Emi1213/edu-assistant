import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { modulesService } from '../services/modules.service';
import type { IModule } from '../types/IModule';
import type { IUpdateModule } from '../types/IUpdateModule';

interface UpdateModuleVariables {
  id: number;
  payload: IUpdateModule;
}

export const useUpdateModuleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IModule, Error, UpdateModuleVariables>({
    mutationFn: async ({ id, payload }: UpdateModuleVariables) => {
      const response = await modulesService.updateModule(id, payload);
      if (!response.data) {
        throw new Error('Failed to update module');
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['module', variables.id] });
    },
  });
};

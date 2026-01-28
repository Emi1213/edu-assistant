import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { modulesService } from '../services/modules.service';

export const useDeleteModuleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<null, Error, number>({
    mutationFn: async (id: number) => {
      const response = await modulesService.deleteModule(id);
      if (!response.data) {
        throw new Error('Failed to delete module');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
  });
};

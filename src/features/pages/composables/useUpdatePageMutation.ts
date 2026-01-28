import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { pagesService } from '../services/pages.service';
import type { IPage } from '../interfaces/IPage';
import type { IUpdatePage } from '../interfaces/IUpdatePage';

interface UpdatePageVariables {
  id: number;
  payload: IUpdatePage;
}

export const useUpdatePageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IPage, Error, UpdatePageVariables>({
    mutationFn: async ({ id, payload }: UpdatePageVariables) => {
      const response = await pagesService.updatePage(id, payload);
      if (!response.data) {
        throw new Error('Failed to update page');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages', data.moduleId] });
    },
  });
};

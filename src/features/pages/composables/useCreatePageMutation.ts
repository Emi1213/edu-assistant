import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { pagesService } from '../services/pages.service';
import type { IPage } from '../interfaces/IPage';
import type { ICreatePage } from '../interfaces/ICreatePage';

export const useCreatePageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IPage, Error, ICreatePage>({
    mutationFn: async (payload: ICreatePage) => {
      const response = await pagesService.createPage(payload);
      if (!response.data) {
        throw new Error('Failed to create page');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages', data.moduleId] });
    },
  });
};

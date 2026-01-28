import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { pagesService } from '../services/pages.service';
import type { IReorderPagePayload } from '../interfaces/IReorderPage';

interface ReorderPagesVariables {
  moduleId: number;
  payload: IReorderPagePayload[];
}

export const useReorderPagesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ReorderPagesVariables>({
    mutationFn: async ({ payload }: ReorderPagesVariables) => {
      await pagesService.reorderPages(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pages', variables.moduleId] });
    },
  });
};

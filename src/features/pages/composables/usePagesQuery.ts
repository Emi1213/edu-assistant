import { useQuery } from '@tanstack/vue-query';
import { pagesService } from '../services/pages.service';
import type { IPage } from '../interfaces/IPage';

export const usePagesQuery = (moduleId: number) => {
  return useQuery<IPage[]>({
    queryKey: ['pages', moduleId],
    queryFn: async () => {
      const response = await pagesService.getPages(moduleId);
      return response.data || [];
    },
    enabled: !!moduleId,
  });
};

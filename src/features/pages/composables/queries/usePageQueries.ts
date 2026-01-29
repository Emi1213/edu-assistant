import { useQuery } from '@tanstack/vue-query'
import { pagesService } from '../../services/pages.service'
import type { IPage, IPageQueryParams } from '../../types/pages.types'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'

export const pagesKeys = {
  all: ['pages'] as const,
  lists: () => [...pagesKeys.all, 'list'] as const,
  list: (params?: IPageQueryParams) => [...pagesKeys.lists(), params] as const,
  details: () => [...pagesKeys.all, 'detail'] as const,
  detail: (id: number) => [...pagesKeys.details(), id] as const,
}

export const usePagesQuery = (params?: IPageQueryParams) =>
  useQuery<IHttpPaginatedResponse<IPage>, Error>({
    queryKey: pagesKeys.list(params),
    queryFn: async () => {
      return pagesService.getAllPages(params)
    },
  })

export const usePageQuery = (id: IPage['id']) =>
  useQuery<IPage, Error>({
    queryKey: pagesKeys.detail(id),
    queryFn: async () => {
      return pagesService.getPageById(id)
    },
    enabled: !!id,
  })

import { httpClient } from '@/core/infraestructure/http'
import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import type { Page, PageQueryParams } from '../types/pages.types'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'
import { API_ROUTES } from '@/core/api/routes/api-routes'

export class PagesDataSource {
  private httpClient: IHttpHandler

  constructor() {
    this.httpClient = httpClient
  }

  async getByModuleId(moduleId: number, query?: Omit<PageQueryParams, 'moduleId'>): Promise<IHttpPaginatedResponse<Page> | null> {
    const response = await this.httpClient.get<IHttpPaginatedResponse<Page>>(
      API_ROUTES.PAGES.GET_BY_MODULE_ID(moduleId),
      {
        params: query,
      }
    )
    return response.data
  }

  async getById(id: number): Promise<Page | null> {
    const response = await this.httpClient.get<Page>(API_ROUTES.PAGES.GET_BY_ID(id))
    return response.data
  }
}

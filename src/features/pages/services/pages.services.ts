import { httpClient } from '@/core/infraestructure/http'
import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import type {
  Page,
  PageQueryParams,
  UpdatePageContentPayload,
  UpdatePagePayload,
  CreatePagePayload,
  CreateConceptPayload,
  PageConcept,
} from '../types/pages.types'
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

  async update(id: number, payload: UpdatePagePayload): Promise<Page | null> {
    const response = await this.httpClient.patch<Page>(API_ROUTES.PAGES.UPDATE(id), payload)
    return response.data
  }

  async updateContent(id: number, payload: UpdatePageContentPayload): Promise<Page | null> {
    const response = await this.httpClient.patch<Page>(API_ROUTES.PAGES.UPDATE_CONTENT(id), payload)
    return response.data
  }

  async create(payload: CreatePagePayload): Promise<Page | null> {
    const response = await this.httpClient.post<Page>(API_ROUTES.PAGES.CREATE, payload)
    return response.data
  }

  async createConcept(pageId: number, payload: CreateConceptPayload): Promise<PageConcept | null> {
    const response = await this.httpClient.post<PageConcept>(
      API_ROUTES.PAGES.CREATE_CONCEPT(pageId),
      payload
    )
    return response.data
  }
}

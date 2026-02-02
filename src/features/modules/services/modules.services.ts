import { httpClient } from '@/core/infraestructure/http'
import type { IHttpHandler, IHttpResponse } from '@/core/interfaces/IHttpHandler'
import type { CreateModule, Module, ModuleQueryParams, UpdateModule } from '../types/modules.types'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'
import { API_ROUTES } from '@/core/api/routes/api-routes'

export class ModulesDataSource {
  private httpClient: IHttpHandler

  constructor() {
    this.httpClient = httpClient
  }

  async getAll(query?: ModuleQueryParams): Promise<IHttpPaginatedResponse<Module> | null> {
    const response = await this.httpClient.get<IHttpPaginatedResponse<Module>>(API_ROUTES.MODULES.GET_ALL, {
      params: query,
    })
    return response.data
  }

  async getAvailable(query?: ModuleQueryParams): Promise<IHttpPaginatedResponse<Module> | null> {
    const response = await this.httpClient.get<IHttpPaginatedResponse<Module>>(API_ROUTES.MODULES.GET_AVAILABLE, {
      params: query,
    })
    return response.data
  }

  async getById(id: number): Promise<Module | null> {
    const response = await this.httpClient.get<Module>(API_ROUTES.MODULES.GET_BY_ID(id))
    return response.data
  }

  async create(payload: CreateModule): Promise<IHttpResponse<Module> | null> {
    const response = await this.httpClient.post<IHttpResponse<Module>>(API_ROUTES.MODULES.CREATE, payload)
    return response.data
  }

  async update(id: number, payload: UpdateModule): Promise<IHttpResponse<Module> | null> {
    const response = await this.httpClient.put<IHttpResponse<Module>>(API_ROUTES.MODULES.UPDATE(id), payload)
    return response.data
  }

  async delete(id: number): Promise<IHttpResponse<void> | null> {
    const response = await this.httpClient.delete<IHttpResponse<void>>(API_ROUTES.MODULES.DELETE(id))
    return response.data
  }
}
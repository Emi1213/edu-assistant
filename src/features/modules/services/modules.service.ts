<<<<<<< HEAD
import { httpClient } from '@/core/infraestructure/http';
import type { IModule } from '../types/IModule';
import type { ICreateModule } from '../types/ICreateModule';
import type { IUpdateModule } from '../types/IUpdateModule';
import type { IHttpResponse } from '@/core/interfaces/IHttpHandler';

const BASE_URL = '/modules';

export const modulesService = {
  async getModules(teacherId?: number): Promise<IHttpResponse<IModule[]>> {
    const params = teacherId ? `?teacherId=${teacherId}` : '';
    return await httpClient.get<IModule[]>(`${BASE_URL}${params}`);
  },
  async getModuleById(id: number): Promise<IHttpResponse<IModule>> {
    return await httpClient.get<IModule>(`${BASE_URL}/${id}`);
  },
  async createModule(payload: ICreateModule): Promise<IHttpResponse<IModule>> {
    return await httpClient.post<IModule>(BASE_URL, payload);
  },
  async updateModule(id: number, payload: IUpdateModule): Promise<IHttpResponse<IModule>> {
    return await httpClient.patch<IModule>(`${BASE_URL}/${id}`, payload);
  },
  async deleteModule(id: number): Promise<IHttpResponse<null>> {
    return await httpClient.delete<null>(`${BASE_URL}/${id}`);
  },
};
=======
// src/features/modules/services/modules.service.ts

import { httpClient } from '@/core/infraestructure/http'
import type {
  ICreateModule,
  IUpdateModule,
  IModule,
  IModuleQueryParams,
} from '../types/modules.types'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'

export const PageStatus = { DRAFT: 'DRAFT', PUBLISHED: 'PUBLISHED' } as const
export type PageStatus = typeof PageStatus[keyof typeof PageStatus]

export interface IPage {
  id: number
  title: string
  content: string
  slug: string
  order: number
  moduleId: number
  status?: PageStatus
  createdAt: string
  updatedAt: string
}

export interface ICreatePage {
  title: string
  content: string
  moduleId: number
  slug?: string
  order?: number
  status?: PageStatus
}

export type IUpdatePage = Partial<ICreatePage>

export interface IReorderPages {
  id: number
  order: number
}

export interface IPageQueryParams {
  page?: number
  limit?: number
  search?: string
  moduleId?: number
}

class ModulesService {
  private readonly API_URL = 'modules'

  async createModule(payload: ICreateModule): Promise<IModule> {
    const response = await httpClient.post<IModule>(`${this.API_URL}`, payload)
    if (!response.data) {
      throw new Error('La creación del módulo falló o devolvió datos vacíos.')
    }
    return response.data
  }

  async updateModule(
    id: IModule['id'],
    payload: IUpdateModule,
  ): Promise<IModule> {
    const response = await httpClient.patch<IModule>(`${this.API_URL}/${id}`, payload)
    if (!response.data) {
      throw new Error('La actualización del módulo falló o devolvió datos vacíos.')
    }
    return response.data
  }

  async getAllModules(
    params?: IModuleQueryParams,
  ): Promise<IHttpPaginatedResponse<IModule>> {
    const response = await httpClient.get<IHttpPaginatedResponse<IModule>>(
      `${this.API_URL}`,
      { params },
    )
    if (!response.data) {
        throw new Error('La obtención de módulos paginados falló o devolvió datos vacíos.')
    }
    if (!response.data.records) {
        throw new Error('La respuesta de módulos paginados no contiene el array de registros.')
    }
    return response.data
  }

  async getModuleById(id: IModule['id']): Promise<IModule> {
    const response = await httpClient.get<IModule>(`${this.API_URL}/${id}`)
    if (!response.data) {
      throw new Error('La obtención del módulo por ID falló o devolvió datos vacíos.')
    }
    return response.data
  }
}

export const modulesService = new ModulesService()
>>>>>>> feature/modules-and-pages-logic

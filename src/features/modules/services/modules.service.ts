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

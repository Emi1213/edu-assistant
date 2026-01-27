import { httpClient } from '@/core/infraestructure/http';
import { IModule } from '../types/IModule';
import { ICreateModule } from '../types/ICreateModule';
import { IUpdateModule } from '../types/IUpdateModule';
import { IHttpResponse } from '@/core/interfaces/IHttpHandler';

const BASE_URL = '/modules';

export const modulesService = {
  /**
   * Obtiene una lista de módulos, opcionalmente filtrados por ID de profesor.
   * @param teacherId El ID del profesor para filtrar los módulos.
   * @returns Una promesa que resuelve con la respuesta de la API que contiene los módulos.
   */
  async getModules(teacherId?: number): Promise<IHttpResponse<IModule[]>> {
    const params = teacherId ? `?teacherId=${teacherId}` : '';
    return await httpClient.get<IModule[]>(`${BASE_URL}${params}`);
  },

  /**
   * Obtiene un módulo por su ID.
   * @param id El ID del módulo a obtener.
   * @returns Una promesa que resuelve con la respuesta de la API que contiene el módulo.
   */
  async getModuleById(id: number): Promise<IHttpResponse<IModule>> {
    return await httpClient.get<IModule>(`${BASE_URL}/${id}`);
  },

  /**
   * Crea un nuevo módulo.
   * @param payload Los datos para crear el módulo.
   * @returns Una promesa que resuelve con la respuesta de la API que contiene el módulo creado.
   */
  async createModule(payload: ICreateModule): Promise<IHttpResponse<IModule>> {
    return await httpClient.post<IModule>(BASE_URL, payload);
  },

  /**
   * Actualiza un módulo existente.
   * @param id El ID del módulo a actualizar.
   * @param payload Los datos para actualizar el módulo.
   * @returns Una promesa que resuelve con la respuesta de la API que contiene el módulo actualizado.
   */
  async updateModule(id: number, payload: IUpdateModule): Promise<IHttpResponse<IModule>> {
    return await httpClient.patch<IModule>(`${BASE_URL}/${id}`, payload);
  },
};

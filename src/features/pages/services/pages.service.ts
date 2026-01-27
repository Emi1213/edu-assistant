import { httpClient } from '@/core/infraestructure/http';
import { IPage } from '../interfaces/IPage';
import { ICreatePage } from '../interfaces/ICreatePage';
import { IUpdatePage } from '../interfaces/IUpdatePage';
import { IReorderPagePayload } from '../interfaces/IReorderPage';
import { IHttpResponse } from '@/core/interfaces/IHttpHandler'; // Corrected import path for IHttpResponse

const BASE_URL = '/pages';

export const pagesService = {
  /**
   * Obtiene una lista de páginas filtradas por ID de módulo.
   * @param moduleId El ID del módulo para filtrar las páginas.
   * @returns Una promesa que resuelve con la respuesta de la API que contiene las páginas.
   */
  async getPages(moduleId: number): Promise<IHttpResponse<IPage[]>> {
    return await httpClient.get<IPage[]>(`${BASE_URL}?moduleId=${moduleId}`);
  },

  /**
   * Crea una nueva página.
   * @param payload Los datos para crear la página.
   * @returns Una promesa que resuelve con la respuesta de la API que contiene la página creada.
   */
  async createPage(payload: ICreatePage): Promise<IHttpResponse<IPage>> {
    return await httpClient.post<IPage>(BASE_URL, payload);
  },

  /**
   * Actualiza una página existente.
   * @param id El ID de la página a actualizar.
   * @param payload Los datos para actualizar la página.
   * @returns Una promesa que resuelve con la respuesta de la API que contiene la página actualizada.
   */
  async updatePage(id: number, payload: IUpdatePage): Promise<IHttpResponse<IPage>> {
    return await httpClient.patch<IPage>(`${BASE_URL}/${id}`, payload);
  },

  /**
   * Reordena las páginas.
   * @param payload Un array de objetos con el ID de la página y su nuevo índice de orden.
   * @returns Una promesa que resuelve con la respuesta de la API.
   */
  async reorderPages(payload: IReorderPagePayload[]): Promise<IHttpResponse<void>> {
    // Assuming the reorder endpoint is a PUT to /pages/reorder that takes an array of { id, orderIndex }
    return await httpClient.put<void>(`${BASE_URL}/reorder`, payload);
  },
};

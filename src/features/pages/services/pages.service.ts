import { httpClient } from '@/core/infraestructure/http'
import type {
  ICreatePage,
  IUpdatePage,
  IPage,
  IPageQueryParams,
  IReorderPages,
} from '../types/pages.types'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'

class PagesService {
  private readonly API_URL = 'pages'

  async createPage(payload: ICreatePage): Promise<IPage> {
    const response = await httpClient.post<IPage>(`${this.API_URL}`, payload)
    if (!response.data) {
      throw new Error('La creación de la página falló o devolvió datos vacíos.')
    }
    return response.data
  }

  async updatePage(
    id: IPage['id'],
    payload: IUpdatePage,
  ): Promise<IPage> {
    const response = await httpClient.patch<IPage>(`${this.API_URL}/${id}`, payload)
    if (!response.data) {
      throw new Error('La actualización de la página falló o devolvió datos vacíos.')
    }
    return response.data
  }

  async getAllPages(
    params?: IPageQueryParams,
  ): Promise<IHttpPaginatedResponse<IPage>> {
    const response = await httpClient.get<IHttpPaginatedResponse<IPage>>(
      `${this.API_URL}`,
      { params },
    )
    if (!response.data) {
      throw new Error('La obtención de páginas paginadas falló o devolvió datos vacíos.')
    }
    if (!response.data.records) {
      throw new Error('La respuesta de páginas paginadas no contiene el array de registros.')
    }
    return response.data
  }

  async getPageById(id: IPage['id']): Promise<IPage> {
    const response = await httpClient.get<IPage>(`${this.API_URL}/${id}`)
    if (!response.data) {
      throw new Error('La obtención de la página por ID falló o devolvió datos vacíos.')
    }
    return response.data
  }

  async reorderPages(pages: IReorderPages[]): Promise<IPage[]> {
    const response = await httpClient.patch<IPage[]>(
      `${this.API_URL}/reorder`,
      pages,
    )
    if (!response.data) {
      throw new Error('El reordenamiento de páginas falló o devolvió datos vacíos.')
    }
    return response.data
  }
}

export const pagesService = new PagesService()

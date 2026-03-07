import { httpClient } from '@/core/infraestructure/http'
import type { IHttpResponse } from '@/core/interfaces/IHttpHandler'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type { TeachersEmailsData } from '../types/admin.types'

export const teachersEmailsService = {
  async get(): Promise<string[]> {
    const response: IHttpResponse<TeachersEmailsData> = await httpClient.get(
      API_ROUTES.AUTH.TEACHERS_EMAILS
    )
    if (!response.data?.emails) {
      return []
    }
    return response.data.emails
  },

  async update(emails: string[]): Promise<string[]> {
    const response: IHttpResponse<TeachersEmailsData> = await httpClient.patch(
      API_ROUTES.AUTH.TEACHERS_EMAILS,
      { emails }
    )
    if (!response.data?.emails) {
      throw new Error('Error al actualizar correos de profesores')
    }
    return response.data.emails
  },
}

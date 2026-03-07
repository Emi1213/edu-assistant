import { httpClient } from '@/core/infraestructure/http'
import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import type { UserProfile } from '@/features/auth/types/auth.types'
import { API_ROUTES } from '@/core/api/routes/api-routes'

export interface StudentsQueryParams {
  page?: number
  limit?: number
  search?: string
}

export class UsersDataSource {
  private httpClient: IHttpHandler

  constructor() {
    this.httpClient = httpClient
  }

  async getStudents(params?: StudentsQueryParams): Promise<UserProfile[] | null> {
    const response = await this.httpClient.get<UserProfile[]>(
      API_ROUTES.USERS.STUDENTS,
      { params }
    )
    return response.data ?? null
  }
}

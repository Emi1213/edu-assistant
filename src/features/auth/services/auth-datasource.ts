import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import { httpClient } from '@/core/infraestructure/http'
import type { UserProfile } from '../types/auth.types'
import { API_ROUTES } from '@/core/api/routes/api-routes'
export class AuthDataSource {
  private httpClient: IHttpHandler
  
  constructor() {
    this.httpClient = httpClient
  }
  
  getMicrosoftLoginUrl(): string {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    return `${apiBaseUrl}/auth/microsoft`
  }

  async getMe(): Promise<UserProfile | null>{
    const response = await this.httpClient.get<UserProfile | null>(API_ROUTES.AUTH.ME)
    return response.data
  }
}

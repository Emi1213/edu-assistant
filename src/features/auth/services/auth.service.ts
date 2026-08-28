import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import { httpClient, publicHttpClient } from '@/core/infraestructure/http'
import type { User } from '../types/auth.types'
import { API_ROUTES } from '@/core/api/routes/api-routes'

type AuthExchangeResponse = {
  accessToken: string
}

export class AuthDataSource {
  private httpClient: IHttpHandler
  private publicHttpClient: IHttpHandler

  constructor(
    authenticatedClient: IHttpHandler = httpClient,
    unauthenticatedClient: IHttpHandler = publicHttpClient,
  ) {
    this.httpClient = authenticatedClient
    this.publicHttpClient = unauthenticatedClient
  }

  getMicrosoftLoginUrl(): string {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    return `${apiBaseUrl}${API_ROUTES.AUTH.MICROSOFT_LOGIN}`
  }

  getGoogleLoginUrl(): string {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    return `${apiBaseUrl}${API_ROUTES.AUTH.GOOGLE_LOGIN}`
  }

  async exchangeGoogleCode(code: string): Promise<string> {
    const response = await this.publicHttpClient.post<AuthExchangeResponse>(
      API_ROUTES.AUTH.EXCHANGE,
      { code },
    )
    const accessToken = response.data?.accessToken

    if (!accessToken) {
      throw new Error('La respuesta de autenticación no contiene un token válido')
    }

    return accessToken
  }

  async getMe(): Promise<User | null> {
    const response = await this.httpClient.get<User | null>(API_ROUTES.AUTH.ME)
    return response.data
  }
}

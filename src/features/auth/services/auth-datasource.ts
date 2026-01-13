import type { IHttpHandler } from "@/core/interfaces/IHttpHandler"

export class AuthDataSource {
    private httpClient: IHttpHandler
  private static instance: AuthDataSource
  constructor() {
    this.httpClient = 
  }

  static getInstance(): AuthDataSource {
    if (!this.instance) {
      this.instance = new AuthDataSource()
    }
    return this.instance
  }

  getMicrosoftLoginUrl(): string {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    return `${apiBaseUrl}/auth/microsoft`
  }


}

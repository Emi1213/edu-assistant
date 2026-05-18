import { HttpClient } from './http-client'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const httpClient = new HttpClient(apiBase)

export const publicHttpClient = new HttpClient(apiBase, undefined, {
  attachAuth: false,
  logoutOn401: false,
})

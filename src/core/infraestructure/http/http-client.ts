/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { IHttpHandler, IHttpResponse } from '@/core/interfaces/IHttpHandler'
import { AuthInterceptor } from './interceptors/auth-interceptor'

export type HttpClientOptions = {
  attachAuth?: boolean
  logoutOn401?: boolean
}

export class HttpClient implements IHttpHandler {
  private instance: AxiosInstance

  constructor(baseURL: string, config?: AxiosRequestConfig, clientOptions?: HttpClientOptions) {
    const { attachAuth = true, logoutOn401 = true } = clientOptions ?? {}

    this.instance = axios.create({
      baseURL,
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    })

    this.setupInterceptors({ attachAuth, logoutOn401 })
  }

  private setupInterceptors(options: { attachAuth: boolean; logoutOn401: boolean }): void {
    if (options.attachAuth) {
      this.instance.interceptors.request.use(AuthInterceptor.onRequest)
    }

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<IHttpResponse<any>>) => {
        const responseData = error.response?.data
        const rawMessage: unknown = responseData?.message

        if (rawMessage != null && typeof rawMessage === 'object' && Array.isArray((rawMessage as { content?: unknown[] }).content)) {
          const content = (rawMessage as { content: unknown[] }).content
          const text = content.filter((m: unknown) => m != null).join(' ').trim()
          error.message = text || 'Ocurrió un error inesperado'
        } else if (typeof rawMessage === 'string' && rawMessage.trim()) {
          error.message = rawMessage
        } else if (typeof error.message === 'string' && error.message.trim()) {
          error.message = error.message
        } else {
          error.message = 'Ocurrió un error inesperado'
        }

        if (options.logoutOn401 && error.response?.status === 401) {
          import('@/features/auth/context/auth-store').then(({ useAuthStore }) => {
            useAuthStore().logout()
          })
        }

        return Promise.reject(error)
      },
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<IHttpResponse<T>> {
    const { data } = await this.instance.get<IHttpResponse<T>>(url, config)
    return data
  }

  async post<T>(url: string, payload: any, config?: AxiosRequestConfig): Promise<IHttpResponse<T>> {
    const { data } = await this.instance.post<IHttpResponse<T>>(url, payload, config)
    return data
  }

  async put<T>(url: string, payload: any, config?: AxiosRequestConfig): Promise<IHttpResponse<T>> {
    const { data } = await this.instance.put<IHttpResponse<T>>(url, payload, config)
    return data
  }

  async patch<T>(
    url: string,
    payload?: any,
    config?: AxiosRequestConfig,
  ): Promise<IHttpResponse<T>> {
    const { data } = await this.instance.patch<IHttpResponse<T>>(url, payload, config)
    return data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<IHttpResponse<T>> {
    const { data } = await this.instance.delete<IHttpResponse<T>>(url, config)
    return data
  }
}

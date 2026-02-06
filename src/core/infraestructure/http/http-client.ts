/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { IHttpHandler, IHttpResponse } from '@/core/interfaces/IHttpHandler'
import { AuthInterceptor } from './interceptors/auth-interceptor'

export class HttpClient implements IHttpHandler {
  private instance: AxiosInstance

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.instance = axios.create({
      baseURL,
      timeout: 120000, 
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(AuthInterceptor.onRequest)

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<IHttpResponse<any>>) => {
        const responseData = error.response?.data

        if (responseData?.message?.displayable && Array.isArray(responseData.message.content)) {
          error.message = responseData.message.content.join(', ')
        } else if (responseData?.message && typeof responseData.message === 'string') {
          error.message = responseData.message
        } else if (error.response?.data?.message) {
          error.message = String(error.response.data.message)
        } else if (error.message) {
          error.message = error.message
        } else {
          error.message = 'Ocurrió un error inesperado'
        }

        if (error.response?.status === 401) {
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

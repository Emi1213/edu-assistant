/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IHttpHandler {
  get<T>(url: string, config?: any): Promise<IHttpResponse<T>>;
  post<T>(url: string, data: any, config?: any): Promise<IHttpResponse<T>>;
  put<T>(url: string, data: any, config?: any): Promise<IHttpResponse<T>>;
  patch<T>(url: string, data?: any, config?: any): Promise<IHttpResponse<T>>;
  delete<T>(url: string, config?: any): Promise<IHttpResponse<T>>;
}

export interface IHttpResponse<T> {
  success: boolean
  message: IHttpMessage
  data: T | null
}

export interface IHttpMessage {
  content: string[]
  displayable: boolean
}


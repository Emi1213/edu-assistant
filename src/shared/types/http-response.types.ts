export interface IHttpPaginatedResponse<T> {
    records: T[]
    total: number
    page: number
    limit: number
    pages: number
  }
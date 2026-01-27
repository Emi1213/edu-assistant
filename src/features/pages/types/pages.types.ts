export interface Page {
  id: number
  moduleId: number
  title: string
  content: string
  orderIndex: number
  keywords: string[]
  isPublished: boolean
  lastProcessedAt: string | null
  processingVersion: number
  createdAt: string
  updatedAt: string
}

export interface PageQueryParams {
  page?: number
  limit?: number
  search?: string
}

import { httpClient } from '@/core/infraestructure/http'
import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import { API_ROUTES } from '@/core/api/routes/api-routes'

export interface MarkLoVisitedPayload {
  learningObjectId: number
  isCompleted?: boolean
}

export interface LoProgress {
  id: number
  learningObjectId: number
  userId: number
  isCompleted: boolean
  completedAt?: string | null
  lastVisitedAt: string
  createdAt: string
  updatedAt: string
}

export class LoProgressDataSource {
  private httpClient: IHttpHandler

  constructor() {
    this.httpClient = httpClient
  }

  async markVisited(payload: MarkLoVisitedPayload): Promise<LoProgress | null> {
    const response = await this.httpClient.post<LoProgress>(
      API_ROUTES.LO_PROGRESS.MARK_VISITED,
      payload
    )
    return response.data ?? null
  }

  async getProgress(learningObjectId: number): Promise<LoProgress | null> {
    const response = await this.httpClient.get<LoProgress>(
      API_ROUTES.LO_PROGRESS.GET_BY_LO_ID(learningObjectId)
    )
    return response.data ?? null
  }
}

export const loProgressService = new LoProgressDataSource()

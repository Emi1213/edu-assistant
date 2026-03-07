import { httpClient as http } from '@/core/infraestructure/http'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type { IHttpResponse } from '@/core/interfaces/IHttpHandler'
import type { PageFeedback, CreatePageFeedback, UpdatePageFeedback } from '../types/page-feedbacks.types'

class PageFeedbacksService {
  async createFeedback(payload: CreatePageFeedback): Promise<PageFeedback> {
    const response: IHttpResponse<PageFeedback> = await http.post(
      API_ROUTES.PAGES.FEEDBACKS.CREATE,
      payload
    )
    
    if (!response.data) {
      throw new Error('Failed to create feedback')
    }
    
    return response.data
  }

  async updateFeedback(feedbackId: number, payload: UpdatePageFeedback): Promise<PageFeedback> {
    const response: IHttpResponse<PageFeedback> = await http.patch(
      API_ROUTES.PAGES.FEEDBACKS.UPDATE(feedbackId),
      payload
    )
    
    if (!response.data) {
      throw new Error('Failed to update feedback')
    }
    
    return response.data
  }

  async deleteFeedback(feedbackId: number): Promise<void> {
    await http.delete(API_ROUTES.PAGES.FEEDBACKS.DELETE(feedbackId))
  }
}

export const pageFeedbacksService = new PageFeedbacksService()

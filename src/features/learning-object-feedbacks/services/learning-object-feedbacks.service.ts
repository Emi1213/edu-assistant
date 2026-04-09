import { httpClient as http } from '@/core/infraestructure/http'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type { IHttpResponse } from '@/core/interfaces/IHttpHandler'
import type { LearningObjectFeedback, CreateLearningObjectFeedback, UpdateLearningObjectFeedback } from '../types/learning-object-feedbacks.types'

class LearningObjectFeedbacksService {
  async createFeedback(payload: CreateLearningObjectFeedback): Promise<LearningObjectFeedback> {
    const response: IHttpResponse<LearningObjectFeedback> = await http.post(
      API_ROUTES.LEARNING_OBJECTS.FEEDBACKS.CREATE,
      payload
    )
    
    if (!response.data) {
      throw new Error('Failed to create feedback')
    }
    
    return response.data
  }

  async updateFeedback(feedbackId: number, payload: UpdateLearningObjectFeedback): Promise<LearningObjectFeedback> {
    const response: IHttpResponse<LearningObjectFeedback> = await http.patch(
      API_ROUTES.LEARNING_OBJECTS.FEEDBACKS.UPDATE(feedbackId),
      payload
    )
    
    if (!response.data) {
      throw new Error('Failed to update feedback')
    }
    
    return response.data
  }

  async deleteFeedback(feedbackId: number): Promise<void> {
    await http.delete(API_ROUTES.LEARNING_OBJECTS.FEEDBACKS.DELETE(feedbackId))
  }
}

export const learningObjectFeedbacksService = new LearningObjectFeedbacksService()

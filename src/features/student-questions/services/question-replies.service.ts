import { httpClient } from '@/core/infraestructure/http'
import type { IHttpResponse } from '@/core/interfaces/IHttpHandler'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type {
  QuestionReply,
  CreateQuestionReplyPayload,
  UpdateQuestionReplyPayload,
} from '../types'

class QuestionRepliesService {
  async create(payload: CreateQuestionReplyPayload): Promise<QuestionReply> {
    const response: IHttpResponse<QuestionReply> = await httpClient.post(
      API_ROUTES.LEARNING_OBJECTS.QUESTION_REPLIES.CREATE,
      payload
    )
    if (!response.data) {
      throw new Error('Error al crear la respuesta')
    }
    return response.data
  }

  async update(id: number, payload: UpdateQuestionReplyPayload): Promise<QuestionReply> {
    const response: IHttpResponse<QuestionReply> = await httpClient.patch(
      API_ROUTES.LEARNING_OBJECTS.QUESTION_REPLIES.UPDATE(id),
      payload
    )
    if (!response.data) {
      throw new Error('Error al actualizar la respuesta')
    }
    return response.data
  }

  async delete(id: number): Promise<void> {
    await httpClient.delete(API_ROUTES.LEARNING_OBJECTS.QUESTION_REPLIES.DELETE(id))
  }
}

export const questionRepliesService = new QuestionRepliesService()

import { httpClient } from '@/core/infraestructure/http'
import type { IHttpResponse } from '@/core/interfaces/IHttpHandler'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type {
  StudentQuestion,
  CreateStudentQuestionPayload,
  UpdateStudentQuestionPayload,
} from '../types'

class StudentQuestionsService {
  async create(payload: CreateStudentQuestionPayload): Promise<StudentQuestion> {
    const response: IHttpResponse<StudentQuestion> = await httpClient.post(
      API_ROUTES.PAGES.STUDENT_QUESTIONS.CREATE,
      payload
    )
    if (!response.data) {
      throw new Error('Error al crear la pregunta')
    }
    return response.data
  }

  async update(id: number, payload: UpdateStudentQuestionPayload): Promise<StudentQuestion> {
    const response: IHttpResponse<StudentQuestion> = await httpClient.patch(
      API_ROUTES.PAGES.STUDENT_QUESTIONS.UPDATE(id),
      payload
    )
    if (!response.data) {
      throw new Error('Error al actualizar la pregunta')
    }
    return response.data
  }

  async delete(id: number): Promise<void> {
    await httpClient.delete(API_ROUTES.PAGES.STUDENT_QUESTIONS.DELETE(id))
  }
}

export const studentQuestionsService = new StudentQuestionsService()

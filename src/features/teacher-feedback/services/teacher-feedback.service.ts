import { httpClient } from '@/core/infraestructure/http'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'
import type { 
  TeacherFeedback, 
  ListTeacherFeedbackParams 
} from '../types/teacher-feedback.types'

class TeacherFeedbackService {
  async listByModule(moduleId: number, params?: ListTeacherFeedbackParams): Promise<TeacherFeedback[]> {
    const response = await httpClient.get<IHttpPaginatedResponse<TeacherFeedback>>(
      API_ROUTES.TEACHER_FEEDBACK.LIST(moduleId),
      { params }
    )
    return response?.data?.records ?? []
  }

  async getById(moduleId: number, id: number): Promise<TeacherFeedback | null> {
    const response = await httpClient.get<TeacherFeedback>(
      API_ROUTES.TEACHER_FEEDBACK.GET_BY_ID(moduleId, id)
    )
    return response?.data ?? null
  }

  async generate(moduleId: number): Promise<{ message: string }> {
    const response = await httpClient.post<{ message: string }>(
      API_ROUTES.TEACHER_FEEDBACK.GENERATE(moduleId),
      {}
    )
    // httpClient.post retorna la IHttpResponse completa según su implementación
    return response?.data ?? { message: 'Generación de feedback iniciada' }
  }
}

export const teacherFeedbackService = new TeacherFeedbackService()

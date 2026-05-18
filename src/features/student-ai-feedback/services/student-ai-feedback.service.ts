import { httpClient } from '@/core/infraestructure/http'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'
import type { 
  StudentFeedback, 
  ListStudentFeedbackParams 
} from '../types/student-ai-feedback.types'

class StudentAiFeedbackService {
  async listByModule(moduleId: number, params?: ListStudentFeedbackParams): Promise<StudentFeedback[]> {
    const response = await httpClient.get<IHttpPaginatedResponse<StudentFeedback>>(
      API_ROUTES.STUDENT_FEEDBACK.LIST(moduleId),
      { params }
    )
    return response?.data?.records ?? []
  }

  async getById(moduleId: number, id: number): Promise<StudentFeedback | null> {
    const response = await httpClient.get<StudentFeedback>(
      API_ROUTES.STUDENT_FEEDBACK.GET_BY_ID(moduleId, id)
    )
    return response?.data ?? null
  }


  async generate(moduleId: number): Promise<{ message: string }> {
    const response = await httpClient.post<{ message: string }>(
      API_ROUTES.STUDENT_FEEDBACK.GENERATE(moduleId),
      {}
    )
    return response?.data ?? { message: 'Generación de feedback iniciada' }
  }
}

export const studentAiFeedbackService = new StudentAiFeedbackService()

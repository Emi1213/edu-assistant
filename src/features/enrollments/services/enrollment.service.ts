import { httpClient } from '@/core/infraestructure/http'
import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type {
  Enrollment,
  CreateEnrollmentPayload,
  BulkEnrollStudentsPayload,
  UpdateEnrollmentPayload,
  EnrollmentStudent,
} from '../types/enrollments.types'

export class EnrollmentsDataSource {
  private httpClient: IHttpHandler

  constructor() {
    this.httpClient = httpClient
  }

  async selfEnroll(payload: CreateEnrollmentPayload): Promise<Enrollment | null> {
    const response = await this.httpClient.post<Enrollment>(API_ROUTES.ENROLLMENTS.SELF_ENROLL, payload)
    return response.data
  }

  async bulkEnrollStudents(payload: BulkEnrollStudentsPayload): Promise<Enrollment[] | null> {
    const response = await this.httpClient.post<Enrollment[]>(API_ROUTES.ENROLLMENTS.BULK_ENROLL, payload)
    return response.data
  }

  async getMyEnrollments(): Promise<Enrollment[] | null> {
    const response = await this.httpClient.get<Enrollment[]>(API_ROUTES.ENROLLMENTS.LIST)
    return response.data ?? null
  }

  async getModuleEnrollments(moduleId: number): Promise<EnrollmentStudent[] | null> {
    const response = await this.httpClient.get<EnrollmentStudent[]>(
      API_ROUTES.ENROLLMENTS.GET_MODULE_ENROLLMENTS(moduleId)
    )
    return response.data ?? null
  }

  async updateEnrollment(
    id: number,
    payload: UpdateEnrollmentPayload
  ): Promise<Enrollment | null> {
    const response = await this.httpClient.patch<Enrollment>(API_ROUTES.ENROLLMENTS.UPDATE(id), payload)
    return response.data
  }

  async selfUnenroll(moduleId: number): Promise<Enrollment | null> {
    const response = await this.httpClient.delete<Enrollment>(API_ROUTES.ENROLLMENTS.SELF_UNENROLL(moduleId))
    return response.data
  }

  async removeEnrollment(id: number): Promise<Enrollment | null> {
    const response = await this.httpClient.delete<Enrollment>(API_ROUTES.ENROLLMENTS.REMOVE(id))
    return response.data
  }
}

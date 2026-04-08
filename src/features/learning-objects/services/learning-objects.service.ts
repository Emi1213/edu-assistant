import { httpClient } from '@/core/infraestructure/http'
import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import type { LearningObject, CreateLearningObjectPayload } from '../types/learning-object.types'
import type { LearningObjectType } from '../types/learning-object-type.types'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'
import { API_ROUTES } from '@/core/api/routes/api-routes'

export class LearningObjectsDataSource {
  private httpClient: IHttpHandler

  constructor() {
    this.httpClient = httpClient
  }

  async getTypes(): Promise<LearningObjectType[] | null> {
    const response = await this.httpClient.get<LearningObjectType[]>(
      API_ROUTES.LEARNING_OBJECT_TYPES.GET_ALL
    )
    return response.data
  }

  async getByModuleId(moduleId: number, typeId: number): Promise<IHttpPaginatedResponse<LearningObject> | null> {
    const response = await this.httpClient.get<IHttpPaginatedResponse<LearningObject>>(
      API_ROUTES.PAGES.GET_BY_MODULE_ID(moduleId),
      { params: { typeId } }
    )
    return response.data
  }

  async create(payload: CreateLearningObjectPayload): Promise<LearningObject | null> {
    const response = await this.httpClient.post<LearningObject>(
      API_ROUTES.PAGES.CREATE,
      payload
    )
    return response.data
  }
}

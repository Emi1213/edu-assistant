import { httpClient } from '@/core/infraestructure/http'
import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import type {
  LearningObject,
  LearningObjectQueryParams,
  LearningObjectType,
  UpdateLearningObjectContentPayload,
  UpdateLearningObjectPayload,
  CreateLearningObjectPayload,
  CreateConceptPayload,
  Concept,
} from '../types'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'
import { API_ROUTES } from '@/core/api/routes/api-routes'

export class LearningObjectsDataSource {
  private httpClient: IHttpHandler

  constructor() {
    this.httpClient = httpClient
  }

  async getByModuleId(moduleId: number, query?: Omit<LearningObjectQueryParams, 'moduleId'>): Promise<IHttpPaginatedResponse<LearningObject> | null> {
    const response = await this.httpClient.get<IHttpPaginatedResponse<LearningObject>>(
      API_ROUTES.LEARNING_OBJECTS.GET_BY_MODULE_ID(moduleId),
      {
        params: query,
      }
    )
    return response.data
  }

  async getById(id: number): Promise<LearningObject | null> {
    const response = await this.httpClient.get<LearningObject>(API_ROUTES.LEARNING_OBJECTS.GET_BY_ID(id))
    return response.data
  }

  async update(id: number, payload: UpdateLearningObjectPayload): Promise<LearningObject | null> {
    const response = await this.httpClient.patch<LearningObject>(API_ROUTES.LEARNING_OBJECTS.UPDATE(id), payload)
    return response.data
  }

  async updateContent(id: number, payload: UpdateLearningObjectContentPayload): Promise<LearningObject | null> {
    const response = await this.httpClient.patch<LearningObject>(API_ROUTES.LEARNING_OBJECTS.UPDATE_CONTENT(id), payload)
    return response.data
  }

  async create(payload: CreateLearningObjectPayload): Promise<LearningObject | null> {
    const response = await this.httpClient.post<LearningObject>(API_ROUTES.LEARNING_OBJECTS.CREATE, payload)
    return response.data
  }

  async createConcept(learningObjectId: number, payload: CreateConceptPayload): Promise<Concept | null> {
    const response = await this.httpClient.post<Concept>(
      API_ROUTES.LEARNING_OBJECTS.CREATE_CONCEPT(learningObjectId),
      payload
    )
    return response.data
  }

  async getTypes(): Promise<LearningObjectType[]> {
    const response = await this.httpClient.get<LearningObjectType[]>(
      API_ROUTES.LEARNING_OBJECT_TYPES.GET_ALL
    )
    return response.data ?? []
  }
}

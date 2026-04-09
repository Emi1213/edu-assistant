import { httpClient } from '@/core/infraestructure/http'
import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type {
  Activity,
  CreateActivityPayload,
  UpdateActivityPayload,
  CreateActivityAttemptPayload,
  ActivityAttemptResponse,
} from '../types'

export class ActivitiesDataSource {
  private httpClient: IHttpHandler

  constructor() {
    this.httpClient = httpClient
  }

  async getByLearningObjectId(learningObjectId: number): Promise<Activity[] | null> {
    const response = await this.httpClient.get<Activity[]>(
      API_ROUTES.LEARNING_OBJECTS.ACTIVITIES.LIST(learningObjectId)
    )
    return response.data ?? null
  }

  async create(learningObjectId: number, payload: CreateActivityPayload): Promise<Activity | null> {
    const response = await this.httpClient.post<Activity>(
      API_ROUTES.LEARNING_OBJECTS.ACTIVITIES.CREATE(learningObjectId),
      payload
    )
    return response.data ?? null
  }

  async update(
    learningObjectId: number,
    activityId: number,
    payload: UpdateActivityPayload
  ): Promise<Activity | null> {
    const response = await this.httpClient.patch<Activity>(
      API_ROUTES.LEARNING_OBJECTS.ACTIVITIES.BY_ID(learningObjectId, activityId),
      payload
    )
    return response.data ?? null
  }

  async delete(learningObjectId: number, activityId: number): Promise<void> {
    await this.httpClient.delete(API_ROUTES.LEARNING_OBJECTS.ACTIVITIES.BY_ID(learningObjectId, activityId))
  }

  async createAttempt(
    activityId: number,
    payload: CreateActivityAttemptPayload
  ): Promise<ActivityAttemptResponse | null> {
    const response = await this.httpClient.post<ActivityAttemptResponse>(
      API_ROUTES.ACTIVITIES.ATTEMPTS(activityId),
      payload
    )
    return response.data ?? null
  }
}

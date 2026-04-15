import { httpClient } from '@/core/infraestructure/http'
import type { IHttpHandler } from '@/core/interfaces/IHttpHandler'
import { API_ROUTES } from '@/core/api/routes/api-routes'
import type {
  Session,
  CreateOrGetSessionPayload,
  Message,
  SendMessagePayload,
  ChatMessageCreatedResponse,
} from '../types'
import type { IHttpPaginatedResponse } from '@/shared/types/http-response.types'

export class ChatDataSource {
  private httpClient: IHttpHandler

  constructor() {
    this.httpClient = httpClient
  }

  async createOrGetSession(
    learningObjectId: number,
    payload: CreateOrGetSessionPayload
  ): Promise<Session | null> {
    const response = await this.httpClient.post<Session>(
      API_ROUTES.LEARNING_OBJECTS.SESSIONS.CREATE_OR_GET(learningObjectId),
      payload
    )
    return response.data
  }

  async listMessages(
    sessionId: number,
    params?: { page?: number; limit?: number }
  ): Promise<IHttpPaginatedResponse<Message> | null> {
    const response = await this.httpClient.get<IHttpPaginatedResponse<Message>>(
      API_ROUTES.CHAT.SESSIONS.LIST_MESSAGES(sessionId),
      { params }
    )
    return response.data
  }

  async sendMessage(
    sessionId: number,
    payload: SendMessagePayload
  ): Promise<ChatMessageCreatedResponse | null> {
    const response = await this.httpClient.post<ChatMessageCreatedResponse>(
      API_ROUTES.CHAT.SESSIONS.SEND_MESSAGE(sessionId),
      payload
    )
    return response.data
  }
}

export const chatService = new ChatDataSource()

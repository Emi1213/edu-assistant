export type MessageRole = 'user' | 'assistant' | 'system'

export interface Session {
  id: number
  learningObjectId: number
  userId: number
  title: string
  startedAt: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrGetSessionPayload {
  title?: string
}

export interface Message {
  id: number
  sessionId: number
  role: MessageRole
  content: string
  metadata: string | null
  createdAt: string
}

export interface SendMessagePayload {
  message: string
}

export interface ChatMessageCreatedResponse {
  assistantMessage: Message
  responseId: string
}

import type { ActivityOptionsByType, ActivityType } from './activity-options.types'

export interface Activity {
  id: number
  learningObjectId: number
  type: ActivityType
  question: string
  options: Record<string, unknown> | ActivityOptionsByType
  selectedOption?: number
  explanation: Record<string, unknown> | string
  difficulty: number
  orderIndex: number
  isApprovedByTeacher: boolean
  usedAsExample: boolean
  generatedFromId: number | null
  createdAt: string
  updatedAt: string
}

export type CreateActivityPayload = {
  type: ActivityType
  options: ActivityOptionsByType & { question: string; explanation?: string }
  difficulty?: number
  isApprovedByTeacher?: boolean
}

export type CorrectAnswerPayload =
  | number
  | boolean
  | string
  | string[]
  | [number, number][]
  | Record<string, unknown>

export type UpdateActivityPayload = {
  type?: ActivityType
  options?: Record<string, unknown>
  difficulty?: number
  isApprovedByTeacher?: boolean
  usedAsExample?: boolean
}

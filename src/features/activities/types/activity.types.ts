import type { ActivityOptionsByType, ActivityType } from './activity-options.types'

export interface Activity {
  id: number
  pageId: number
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

export type CreateActivityPayload = Pick<Activity, 'type' | 'question' | 'difficulty'> & {
  options?: ActivityOptionsByType
  explanation?: string
  isApprovedByTeacher?: boolean
}

export type CorrectAnswerPayload =
  | number
  | boolean
  | string
  | string[]
  | [number, number][]
  | Record<string, unknown>

export type UpdateActivityPayload = Partial<
  Pick<Activity, 'type' | 'question' | 'difficulty' | 'isApprovedByTeacher'>
> & {
  options?: Record<string, unknown>
  correctAnswer?: CorrectAnswerPayload
  explanation?: string
  usedAsExample?: boolean
}

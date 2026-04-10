import type { ActivityOptionsByType, ActivityType } from './activity-options.types'
import type {
  CreateActivityOptionsDto,
  CreateActivityMultipleChoiceDto,
  CreateActivityTrueFalseDto,
  CreateActivityFillBlankDto,
  CreateActivityMatchDto,
  CreateActivityMatchPairDto,
} from './activity-create-dto.types'

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
  options: CreateActivityOptionsDto
  difficulty?: number
  isApprovedByTeacher?: boolean
}

export type {
  CreateActivityOptionsDto,
  CreateActivityMultipleChoiceDto,
  CreateActivityTrueFalseDto,
  CreateActivityFillBlankDto,
  CreateActivityMatchDto,
  CreateActivityMatchPairDto,
}

export type CorrectAnswerPayload =
  | number
  | boolean
  | string
  | string[]
  | [number, number][]
  | Record<string, unknown>

export type UpdateActivityPayload = Partial<
  Pick<Activity, 'type' | 'difficulty' | 'isApprovedByTeacher' | 'usedAsExample'>
> & {
  options?: CreateActivityOptionsDto
}

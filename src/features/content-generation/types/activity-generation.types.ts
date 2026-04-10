import type {
  ActivityType as PageActivityType,
  ActivityOptionsByType,
  CreateActivityMultipleChoiceDto,
  CreateActivityTrueFalseDto,
  CreateActivityFillBlankDto,
  CreateActivityMatchDto,
  CreateActivityMatchPairDto,
} from "@/features/activities/types"

export type ActivityType = PageActivityType

export interface GenerateActivityPayload {
  learningObjectId: number
  type: ActivityType
  language: string
  difficulty: number
  instructions?: string
}


export interface GeneratedActivity {
  type?: ActivityType
  question?: string
  options?: ActivityOptionsByType | Record<string, unknown>
  explanation?: string
  difficulty?: number
  isApprovedByTeacher?: boolean
  [key: string]: unknown
}

export type AiGeneratedMultipleChoiceActivity = CreateActivityMultipleChoiceDto
export type AiGeneratedTrueFalseActivity = CreateActivityTrueFalseDto
export type AiGeneratedFillBlankActivity = CreateActivityFillBlankDto
export type AiGeneratedMatchPair = CreateActivityMatchPairDto
export type AiGeneratedMatchActivity = CreateActivityMatchDto

export interface GenerateActivityResponse {
  activity: GeneratedActivity | GeneratedActivity[]
}

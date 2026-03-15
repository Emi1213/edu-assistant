import type {
  ActivityType as PageActivityType,
  ActivityOptionsByType,
} from "@/features/activities/types"

export type ActivityType = PageActivityType

export interface GenerateActivityPayload {
  pageId: number
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

export interface AiGeneratedMultipleChoiceActivity {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface AiGeneratedTrueFalseActivity {
  statement: string
  correctAnswer: boolean
  explanation?: string
}

export interface AiGeneratedFillBlankActivity {
  sentence: string
  correctAnswer: string
  acceptableAnswers: string[]
  explanation?: string
}

export interface AiGeneratedMatchPair {
  left: string
  right: string
}

export interface AiGeneratedMatchActivity {
  instructions: string
  pairs: AiGeneratedMatchPair[]
  explanation?: string
}

export interface GenerateActivityResponse {
  activity: GeneratedActivity | GeneratedActivity[]
}

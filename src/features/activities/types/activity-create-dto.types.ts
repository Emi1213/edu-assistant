export interface CreateActivityMultipleChoiceDto {
  question: string
  options: [string, string, string, string]
  correctAnswer: number
  explanation: string
}

export interface CreateActivityTrueFalseDto {
  statement: string
  correctAnswer: boolean
  explanation: string
}

export interface CreateActivityFillBlankDto {
  sentence: string
  correctAnswer: string
  acceptableAnswers: string[]
  explanation: string
}

export interface CreateActivityMatchPairDto {
  left: string
  right: string
}

export interface CreateActivityMatchDto {
  instructions: string
  pairs: CreateActivityMatchPairDto[]
  explanation?: string
}

export type CreateActivityOptionsDto =
  | CreateActivityMultipleChoiceDto
  | CreateActivityTrueFalseDto
  | CreateActivityFillBlankDto
  | CreateActivityMatchDto

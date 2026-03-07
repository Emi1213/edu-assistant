export type ActivityType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'MATCH'

export interface MultipleChoiceActivityOptions {
  options: string[]
  correctAnswer: number
}

export interface TrueFalseActivityOptions {
  correctAnswer: boolean
}

export interface FillBlankActivityOptions {
  blanks?: string[]
  correctAnswers?: string[]
}

export interface MatchActivityOptions {
  leftItems?: string[]
  rightItems?: string[]
  correctPairs?: [number, number][]
}

export type ActivityOptionsByType =
  | MultipleChoiceActivityOptions
  | TrueFalseActivityOptions
  | FillBlankActivityOptions
  | MatchActivityOptions

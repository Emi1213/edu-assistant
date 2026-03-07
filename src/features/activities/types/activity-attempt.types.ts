export interface MultipleChoiceAttempt {
  selectedOption: number
}

export interface TrueFalseAttempt {
  answer: boolean
}

export interface FillBlankAttempt {
  answer: string | string[]
}

export interface MatchAttempt {
  matches: [number, number][] | Array<{ leftIndex: number; rightIndex: number }>
}

export type ActivityAttemptAnswer =
  | MultipleChoiceAttempt
  | TrueFalseAttempt
  | FillBlankAttempt
  | MatchAttempt

export interface CreateActivityAttemptPayload {
  studentAnswer: ActivityAttemptAnswer
}

export interface ActivityAttemptResponse {
  id: number
  activityId: number
  userId: number
  isCorrect: boolean
  attemptNumber: number
  createdAt: string
}

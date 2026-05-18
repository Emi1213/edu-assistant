export const TeacherFeedbackScope = {
  LEARNING_OBJECT: 'LEARNING_OBJECT',
  MODULE: 'MODULE',
} as const

export type TeacherFeedbackScope = typeof TeacherFeedbackScope[keyof typeof TeacherFeedbackScope]

export interface AiFeedbackItem {
  topic: string
  detail: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface AiFeedbackContent {
  summary: string
  strengths: AiFeedbackItem[]
  improvements: AiFeedbackItem[]
  recommendations: AiFeedbackItem[]
}

export interface TeacherFeedback {
  id: number
  scope: TeacherFeedbackScope
  moduleId: number
  learningObjectId: number | null
  content: AiFeedbackContent
  createdAt: string
}

export interface ListTeacherFeedbackParams {
  scope?: TeacherFeedbackScope
}

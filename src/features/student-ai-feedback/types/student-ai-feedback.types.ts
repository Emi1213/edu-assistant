export interface StudentAiFeedbackItem {
  topic: string
  detail: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface StudentAiFeedbackContent {
  summary: string
  strengths: StudentAiFeedbackItem[]
  improvements: StudentAiFeedbackItem[]
  recommendations: StudentAiFeedbackItem[]
}

export interface StudentFeedback {
  id: number
  scope: string
  moduleId: number
  content: StudentAiFeedbackContent
  createdAt: string
}

export interface ListStudentFeedbackParams {
  page?: number
  limit?: number
}

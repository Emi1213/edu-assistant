import type { User } from '@/features/auth/types/auth.types'

export interface LearningObjectFeedback {
  id: number
  user: User
  feedback: string
  createdAt: string
  updatedAt: string
}

export interface CreateLearningObjectFeedback {
  learningObjectId: number
  feedback: string
}

export interface UpdateLearningObjectFeedback {
  feedback: string
}

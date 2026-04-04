import type { User } from '@/features/auth/types/auth.types'

export interface PageFeedback {
  id: number
  user: User
  feedback: string
  createdAt: string
  updatedAt: string
}

export interface CreatePageFeedback extends Pick<PageFeedback, 'feedback'> {
  learningObjectId: number
}

export type UpdatePageFeedback = Pick<PageFeedback, 'feedback'>


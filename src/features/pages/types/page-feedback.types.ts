import type { User } from '@/features/auth/types/auth.types'

export interface PageFeedback {
  id: number
  user: User
  feedback: string
  createdAt: string
  updatedAt: string
}

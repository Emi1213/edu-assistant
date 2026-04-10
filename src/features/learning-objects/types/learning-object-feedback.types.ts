import type { User } from '@/features/auth/types/auth.types'

export interface LOFeedback {
  id: number
  user: User
  feedback: string
  createdAt: string
  updatedAt: string
}

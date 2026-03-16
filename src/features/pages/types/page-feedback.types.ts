import type { User } from "./user.types"

export interface PageFeedback {
  id: number
  user: User
  feedback: string
  createdAt: string
  updatedAt: string
}

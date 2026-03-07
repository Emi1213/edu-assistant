import type { User } from '@/features/pages/types/pages.types'

export interface PageFeedback {
  id: number
  user: User
  feedback: string
  createdAt: string
  updatedAt: string
}

export interface CreatePageFeedback extends Pick<PageFeedback, 'feedback'> {
  pageId: number
}

export interface UpdatePageFeedback extends Pick<PageFeedback, 'feedback'> {}

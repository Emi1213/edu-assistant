import type { StudentQuestion } from "@/features/student-questions/types/student-questions.types"
import type { PageContentBlock } from "./page-content.types"
import type { PageFeedback } from "./page-feedback.types"

export interface Note {
  id: number
  pageId: number
  userId: number
  content: string
  createdAt: string
}

export interface Page {
  id: number
  moduleId: number
  title: string
  content?: string
  orderIndex: number
  keywords: string[]
  isPublished: boolean
  lastProcessedAt?: string | null
  processingVersion?: number
  createdAt: string
  updatedAt: string
  studentQuestions?: StudentQuestion[]
  pageFeedbacks?: PageFeedback[] | null
  notes?: Note[] | null
  blocks?: PageContentBlock[]
}

export interface PageQueryParams {
  page?: number
  limit?: number
  search?: string
}

export interface PagesQueryParams extends PageQueryParams {
  moduleId: number
}

export type UpdatePagePayload = Partial<
  Pick<Page, "title" | "keywords" | "isPublished">
> & {
  hasManualEdits?: boolean
}

export type CreatePagePayload = Pick<Page, "moduleId" | "title" | "isPublished">

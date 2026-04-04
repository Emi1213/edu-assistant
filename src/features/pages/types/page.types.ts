import type { StudentQuestion } from "@/features/student-questions/types/student-questions.types"
import type { LOContentBlock } from "./page-content.types"
import type { LOFeedback } from "./page-feedback.types"

export interface Note {
  id: number
  learningObjectId: number
  userId: number
  content: string
  createdAt: string
}

export interface LearningObject {
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
  loFeedbacks?: LOFeedback[] | null
  notes?: Note[] | null
  blocks?: LOContentBlock[]
}

export interface LearningObjectQueryParams {
  page?: number
  limit?: number
  search?: string
}

export interface LearningObjectsQueryParams extends LearningObjectQueryParams {
  moduleId: number
}

export type UpdateLearningObjectPayload = Partial<
  Pick<LearningObject, "title" | "keywords" | "isPublished">
> & {
  hasManualEdits?: boolean
}

export type CreateLearningObjectPayload = Pick<LearningObject, "moduleId" | "title" | "isPublished">

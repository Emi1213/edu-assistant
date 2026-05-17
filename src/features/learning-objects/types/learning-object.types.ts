import type { StudentQuestion } from "@/features/student-questions/types/student-questions.types"
import type { LOContentBlock } from "./learning-object-content.types"
import type { LOFeedback } from "./learning-object-feedback.types"
import type { Note } from "@/features/notes"

export interface LoProgress {
  id: number
  learningObjectId: number
  userId: number
  isCompleted: boolean
  completedAt?: string | null
  lastVisitedAt: string
  createdAt: string
  updatedAt: string
}

export interface MarkLoVisitedPayload {
  learningObjectId: number
  isCompleted?: boolean
}

export interface LearningObject {
  id: number
  moduleId: number
  title: string
  content?: string | Record<string, unknown>
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
  chatSessionId: number | null
  previousLoId: number | null
  nextLoId: number | null
  progress?: LoProgress | null
}

export interface LearningObjectQueryParams {
  page?: number
  limit?: number
  search?: string
  typeId?: number
}

export interface LearningObjectsQueryParams extends LearningObjectQueryParams {
  moduleId: number
}

export type UpdateLearningObjectPayload = Partial<
  Pick<LearningObject, "title" | "keywords" | "isPublished">
> & {
  hasManualEdits?: boolean
}

export type CreateLearningObjectPayload = Pick<LearningObject, "moduleId" | "title" | "isPublished"> & {
  typeId: number
}

export interface ReorderLearningObjectItem {
  id: number
  orderIndex: number
}

export type ReorderLearningObjectsPayload = ReorderLearningObjectItem

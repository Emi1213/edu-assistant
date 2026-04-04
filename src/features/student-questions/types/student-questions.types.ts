import type { User } from "@/features/auth/types/auth.types"

export interface QuestionReply {
  id: number
  questionId: number
  user: User
  replyText: string
  isFromTeacher: boolean
  createdAt: string
  updatedAt?: string
}

export interface StudentQuestion {
  id: number
  user: User
  learningObjectId: number
  question: string
  isPublic: boolean
  upvotes: number
  createdAt: string
  updatedAt: string
  replies?: QuestionReply[]
}

export type CreateStudentQuestionPayload = Pick<
  StudentQuestion,
  "learningObjectId" | "question" | "isPublic"
>


export type UpdateStudentQuestionPayload = Partial<
  Pick<StudentQuestion, "question" | "isPublic">
>

export type CreateQuestionReplyPayload = {
  questionId: number
  replyText: string
}

export type UpdateQuestionReplyPayload = {
  replyText: string
}

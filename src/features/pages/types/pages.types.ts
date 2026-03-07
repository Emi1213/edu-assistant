export interface User {
  id: number
  email: string
  role: string
  name: string
  lastName: string
  isActive: boolean
  microsoftId: string
  displayName: string
  profilePicture: string | null
  lastLoginAt: string
  createdAt: string
  updatedAt: string
}

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
  pageId: number
  question: string
  isPublic: boolean
  upvotes: number
  createdAt: string
  updatedAt: string
  replies?: QuestionReply[]
}

export type CreateStudentQuestionPayload = Pick<StudentQuestion, 'pageId' | 'question' | 'isPublic'>

export type UpdateStudentQuestionPayload = Partial<Pick<StudentQuestion, 'question' | 'isPublic'>>

export type CreateQuestionReplyPayload = { questionId: number; replyText: string }
export type UpdateQuestionReplyPayload = { replyText: string }

export interface PageFeedback {
  id: number
  user: User
  feedback: string
  createdAt: string
  updatedAt: string
}

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

/** Campos actualizables de la página (metadata) */
export type UpdatePagePayload = Partial<Pick<Page, 'title' | 'keywords' | 'isPublished'>> & {
  hasManualEdits?: boolean
}

export interface PageContentBlock {
  id?: number
  type: 'TEXT' | 'CODE' | 'IMAGE' | 'IMAGE_SUGGESTION'
  content: PageBlockContent
  tipTapContent?: TipTapDocument
}

export interface TipTapDocument {
  type: string
  content?: any[]
}

export interface ImageBlockContent {
  src: string
  alt?: string
}

export type PageBlockContent = TextBlockContent | CodeBlockContent | ImageSuggestionContent | ImageBlockContent

export interface TextBlockContent {
  text?: string
  markdown?: string
}

export interface CodeBlockContent {
  code: string
  language: string
}

export interface ImageSuggestionContent {
  prompt: string
  reason: string
}

export interface UpdatePageContentPayload {
  blocks: PageContentBlock[]
}

/** Payload para crear página (solo campos enviados al backend) */
export type CreatePagePayload = Pick<Page, 'moduleId' | 'title' | 'isPublished'>

export interface CreateConceptPayload {
  term: string
  definition: string
}

export interface PageConcept {
  id: number
  pageId: number
  term: string
  definition: string
  createdAt: string
  updatedAt: string
}


export type {
  ActivityType,
  ActivityOptionsByType,
  MultipleChoiceActivityOptions,
  TrueFalseActivityOptions,
  FillBlankActivityOptions,
  MatchActivityOptions,
  Activity,
  CreateActivityPayload,
  UpdateActivityPayload,
  CreateActivityAttemptPayload,
  ActivityAttemptResponse,
} from '@/features/activities/types'

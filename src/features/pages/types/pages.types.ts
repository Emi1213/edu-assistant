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

export interface StudentQuestion {
  id: number
  user: User
  pageId: number
  question: string
  isPublic: boolean
  upvotes: number
  createdAt: string
  updatedAt: string
}

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

export type PageBlockContent = TextBlockContent | CodeBlockContent | ImageSuggestionContent

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

export interface CreatePagePayload {
  moduleId: number
  title: string
  isPublished: boolean
}

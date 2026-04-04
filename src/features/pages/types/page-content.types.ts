export interface TipTapDocument {
  type: string
  content?: unknown[]
}

export interface ImageBlockContent {
  src: string
  alt?: string
}

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

export type LOBlockContent =
  | TextBlockContent
  | CodeBlockContent
  | ImageSuggestionContent
  | ImageBlockContent

export interface LOContentBlock {
  id?: number
  orderIndex: number
  type: "TEXT" | "CODE" | "IMAGE" | "IMAGE_SUGGESTION"
  content: LOBlockContent
  tipTapContent?: TipTapDocument
}

export interface UpdateLearningObjectContentPayload {
  blocks: LOContentBlock[]
}


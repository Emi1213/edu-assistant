export interface TipTapDocument {
  type: string
  content?: any[]
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

export type LOContentBlockType = "TEXT" | "CODE" | "IMAGE" | "IMAGE_SUGGESTION"

export interface LOContentBlock {
  id?: number
  orderIndex: number
  type: LOContentBlockType
  content: LOBlockContent
  tipTapContent?: TipTapDocument
}

export type LOContentBlockUpdate = Partial<LOContentBlock> & { id: number }
export type LOContentBlockCreate = Omit<LOContentBlock, "id">

export interface UpdateLearningObjectContentPayload {
  blocks: (LOContentBlockCreate | LOContentBlockUpdate)[]
}

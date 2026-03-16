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

export type PageBlockContent =
  | TextBlockContent
  | CodeBlockContent
  | ImageSuggestionContent
  | ImageBlockContent

export interface PageContentBlock {
  id?: number
  type: "TEXT" | "CODE" | "IMAGE" | "IMAGE_SUGGESTION"
  content: PageBlockContent
  tipTapContent?: TipTapDocument
}

export interface UpdatePageContentPayload {
  blocks: PageContentBlock[]
}

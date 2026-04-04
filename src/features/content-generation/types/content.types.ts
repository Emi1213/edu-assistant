import type {
  Audience,
  ContentLength,
  TargetLevel,
  Tone,
} from "@/features/modules/types/ai-configuration.types"

export interface ContentGeneration {
  title: string
  keywords: string[]
  blocks: ContentGenerationBlock[]
}

export interface ContentGenerationResponse {
  content: ContentGeneration
  responseId: string
}

export interface CreateContentGeneration {
  learningObjectId: number
  instructions: string
  language?: string
  targetLevel?: TargetLevel
  audience?: Audience
  contentLength?: ContentLength
  tone?: Tone
}


export interface ContentGenerationBlock {
  type: ContentGenerationBlockType
  content: ContentGenerationBlockContent
}

export type ContentGenerationBlockType =
  | "TEXT"
  | "CODE"
  | "IMAGE"
  | "IMAGE_SUGGESTION"

export type ContentGenerationBlockContent =
  | TextBlock
  | CodeBlock
  | ImageSuggestionBlock

export interface TextBlock {
  markdown: string
}

export interface CodeBlock {
  code: string
  language: string
}

export interface ImageSuggestionBlock {
  prompt: string
  reason: string
}

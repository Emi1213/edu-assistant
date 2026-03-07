import type { Audience, ContentLength, TargetLevel, Tone } from "@/features/modules/types/ai-configuration.types"

export interface ContentGeneration {
    title: string
    keywords: string[]
    blocks: ContentGenerationBlock[]
}

export interface ContentGenerationResponse {
    content: ContentGeneration
    responseId: string
}

export interface CreateContentGeneration{
    pageId: number
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

export type ContentGenerationBlockType = 'TEXT' | 'CODE' | 'IMAGE' | 'IMAGE_SUGGESTION'
export type ContentGenerationBlockContent = TextBlock | CodeBlock | ImageSuggestionBlock


export interface TextBlock{
    markdown: string
}

export interface CodeBlock{
    code: string
    language: string
}


export interface ImageSuggestionBlock{
    prompt: string
    reason: string
}

export interface GenerateImagePayload {
    prompt: string
}

export interface GenerateImageResponse {
    base64: string
}

export interface ExtractConceptsTerm {
    term: string
    definition: string
}

export interface ExtractConceptsPayload {
    pageId: number
}

export interface ExtractConceptsResponse {
    terms: ExtractConceptsTerm[]
}

export interface ExtractRelationsRelation {
    targetPageId: number
    mentionText: string
}

export interface ExtractRelationsPayload {
    pageId: number
}

export interface ExtractRelationsResponse {
    relations: ExtractRelationsRelation[]
}

import type { ActivityType as PageActivityType, ActivityOptionsByType } from '@/features/activities/types'

export type ActivityType = PageActivityType

export interface GenerateActivityPayload {
    pageId: number
    type: ActivityType
    language: string
    difficulty: number
    instructions?: string
}
export interface GeneratedActivity {
    type?: ActivityType
    question?: string
    options?: ActivityOptionsByType | Record<string, unknown>
    explanation?: string
    difficulty?: number
    isApprovedByTeacher?: boolean
    [key: string]: unknown
}

export interface AiGeneratedMultipleChoiceActivity {
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
}

export interface AiGeneratedTrueFalseActivity {
    statement: string
    correctAnswer: boolean
    explanation?: string
}

export interface AiGeneratedFillBlankActivity {
    sentence: string
    correctAnswer: string
    acceptableAnswers: string[]
    explanation?: string
}
export interface AiGeneratedMatchPair {
    left: string
    right: string
}

export interface AiGeneratedMatchActivity {
    instructions: string
    pairs: AiGeneratedMatchPair[]
    explanation?: string
}

export interface GenerateActivityResponse {
    activity: GeneratedActivity | GeneratedActivity[]
}
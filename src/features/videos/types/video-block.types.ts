export type VideoBlockType = 'SUMMARY' | 'FLASHCARDS' | 'QUIZ' | 'GLOSSARY'

export interface SummaryBlockContent {
  title: string
  summary: string
  examples: string[]
  keyConcepts: string[]
  whatYouLearn: string[]
}

export interface FlashcardItem {
  front: string
  back: string
}

export interface FlashcardsBlockContent {
  items: FlashcardItem[]
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface QuizBlockContent {
  questions: QuizQuestion[]
}

export interface GlossaryTerm {
  term: string
  definition: string
}

export interface GlossaryBlockContent {
  terms: GlossaryTerm[]
}

export type VideoBlockContent =
  | SummaryBlockContent
  | FlashcardsBlockContent
  | QuizBlockContent
  | GlossaryBlockContent

export interface VideoBlockBase<TType extends VideoBlockType, TContent> {
  id: number
  orderIndex: number
  type: TType
  content: TContent
  tipTapContent: null
}

export type SummaryBlock = VideoBlockBase<'SUMMARY', SummaryBlockContent>
export type FlashcardsBlock = VideoBlockBase<'FLASHCARDS', FlashcardsBlockContent>
export type QuizBlock = VideoBlockBase<'QUIZ', QuizBlockContent>
export type GlossaryBlock = VideoBlockBase<'GLOSSARY', GlossaryBlockContent>

export type VideoBlock = SummaryBlock | FlashcardsBlock | QuizBlock | GlossaryBlock

export const isSummaryBlock = (b: VideoBlock): b is SummaryBlock => b.type === 'SUMMARY'
export const isFlashcardsBlock = (b: VideoBlock): b is FlashcardsBlock => b.type === 'FLASHCARDS'
export const isQuizBlock = (b: VideoBlock): b is QuizBlock => b.type === 'QUIZ'
export const isGlossaryBlock = (b: VideoBlock): b is GlossaryBlock => b.type === 'GLOSSARY'

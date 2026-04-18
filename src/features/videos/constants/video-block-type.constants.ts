import type { VideoBlockType } from '../types/video-block.types'

export const VIDEO_BLOCK_TYPES: readonly VideoBlockType[] = [
  'SUMMARY',
  'FLASHCARDS',
  'QUIZ',
  'GLOSSARY',
] as const

import type { IngestionStatus, SourceKind, OutputLanguage } from '../types/video.types'
import type { VideoBlockType } from '../types/video-block.types'

export const STATUS_LABELS: Record<IngestionStatus, string> = {
  PENDING: 'En cola',
  EXTRACTING: 'Extrayendo',
  GENERATING: 'Generando contenido',
  COMPLETED: 'Completado',
  FAILED: 'Falló',
}

export const SOURCE_LABELS: Record<SourceKind, string> = {
  YOUTUBE_URL: 'YouTube',
  VIDEO_FILE: 'Archivo',
}

export const LANGUAGE_LABELS: Record<OutputLanguage, string> = {
  auto: 'Auto',
  es: 'Español',
  en: 'English',
}

export const BLOCK_TAB_LABELS: Record<VideoBlockType, string> = {
  SUMMARY: 'Resumen',
  FLASHCARDS: 'Flashcards',
  QUIZ: 'Quiz',
  GLOSSARY: 'Glosario',
}

import type { VideoBlock } from './video-block.types'
import type { LoProgress } from '@/features/learning-objects/types'

export type IngestionStatus = 'PENDING' | 'EXTRACTING' | 'GENERATING' | 'COMPLETED' | 'FAILED'
export type SourceKind = 'YOUTUBE_URL' | 'VIDEO_FILE'
export type OutputLanguage = 'auto' | 'es' | 'en'

export interface VideoDto {
  id: number
  moduleId: number
  title: string
  sourceKind: SourceKind
  sourceUrl: string
  status: IngestionStatus
  outputLanguage: OutputLanguage
  durationSeconds: number | null
  isPublished: boolean
  hasManualEdits: boolean
  errorMessage: string | null
  orderIndex: number
  createdAt: string
  progress?: LoProgress | null
}

export interface FullVideoDto extends VideoDto {
  detectedLanguage: string | null
  metadata: Record<string, unknown> | null
  blocks: VideoBlock[]
  progress?: LoProgress | null
}

export interface VideoStatusDto {
  id: number
  status: IngestionStatus
  errorMessage?: string | null
  startedAt?: string | null
  completedAt?: string | null
}

export interface VideoFiltersDto {
  status?: IngestionStatus
  page?: number
  limit?: number
  search?: string
}

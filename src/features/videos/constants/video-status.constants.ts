import type { IngestionStatus } from '../types/video.types'

export const PROCESSING_STATUSES: readonly IngestionStatus[] = [
  'PENDING',
  'EXTRACTING',
  'GENERATING',
] as const

export const TERMINAL_STATUSES: readonly IngestionStatus[] = ['COMPLETED', 'FAILED'] as const

export const isProcessingStatus = (s: IngestionStatus | undefined): boolean =>
  s === 'PENDING' || s === 'EXTRACTING' || s === 'GENERATING'

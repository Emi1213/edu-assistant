import type { OutputLanguage } from './video.types'

export interface CreateVideoFromUrlPayload {
  moduleId: number
  title: string
  url: string
  outputLanguage?: OutputLanguage
}

export interface UploadVideoFilePayload {
  moduleId: number
  title: string
  outputLanguage?: OutputLanguage
  file: File
}

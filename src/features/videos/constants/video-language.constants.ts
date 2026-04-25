import type { OutputLanguage } from '../types/video.types'

export interface OutputLanguageOption {
  value: OutputLanguage
  label: string
}

export const OUTPUT_LANGUAGE_OPTIONS: readonly OutputLanguageOption[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
] as const

export const DEFAULT_OUTPUT_LANGUAGE: OutputLanguage = 'auto'

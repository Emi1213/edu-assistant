import type { CreateAiConfiguration } from "../types/ai-configuration.types"

export const TargetLevel = {
    BASIC: 'BASIC',
    INTERMEDIATE: 'INTERMEDIATE',
    ADVANCED: 'ADVANCED',
} as const

export const Audience = {
    UNIVERSITY: 'UNIVERSITY',
    HIGH_SCHOOL: 'HIGH_SCHOOL',
    PROFESSIONAL: 'PROFESSIONAL',
} as const

export const ContentLength = {
    SHORT: 'SHORT',
    MEDIUM: 'MEDIUM',
    LONG: 'LONG',
} as const

export const Tone = {
    EDUCATIONAL: 'EDUCATIONAL',
    FORMAL: 'FORMAL',
    CASUAL: 'CASUAL',
} as const

export const TargetLevelLabels: Record<keyof typeof TargetLevel, string> = {
    BASIC: 'Principiante',
    INTERMEDIATE: 'Intermedio',
    ADVANCED: 'Avanzado',
}

export const AudienceLabels: Record<keyof typeof Audience, string> = {
    UNIVERSITY: 'Universidad',
    HIGH_SCHOOL: 'Secundaria',
    PROFESSIONAL: 'Profesional'
}

export const ContentLengthLabels: Record<keyof typeof ContentLength, string> = {
    SHORT: 'Corto',
    MEDIUM: 'Medio',
    LONG: 'Largo',
}

export const ToneLabels: Record<keyof typeof Tone, string> = {
    EDUCATIONAL: 'Educativo',
    FORMAL: 'Formal',
    CASUAL: 'Casual',
}

export const LANGUAGE_OPTIONS: { value: string; label: string }[] = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
]

export const defaultAiConfiguration: CreateAiConfiguration = {
    language: 'es',
    targetLevel: 'BASIC',
    audience: 'UNIVERSITY',
    contentLength: 'MEDIUM',
    tone: 'EDUCATIONAL',
}

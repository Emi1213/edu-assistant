export const AiTargetLevel = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT',
} as const
export type AiTargetLevel = typeof AiTargetLevel[keyof typeof AiTargetLevel]

export const AiAudience = {
  HIGH_SCHOOL: 'HIGH_SCHOOL',
  UNIVERSITY: 'UNIVERSITY',
  PROFESSIONAL: 'PROFESSIONAL',
  GENERAL: 'GENERAL',
} as const
export type AiAudience = typeof AiAudience[keyof typeof AiAudience]

export const AiLength = {
  SHORT: 'SHORT',
  MEDIUM: 'MEDIUM',
  LONG: 'LONG',
} as const
export type AiLength = typeof AiLength[keyof typeof AiLength]

export const AiTone = {
  FORMAL: 'FORMAL',
  INFORMAL: 'INFORMAL',
  EDUCATIONAL: 'EDUCATIONAL',
  HUMOROUS: 'HUMOROUS',
  TECHNICAL: 'TECHNICAL',
  FRIENDLY: 'FRIENDLY',
} as const
export type AiTone = typeof AiTone[keyof typeof AiTone]

export interface ICreateAiConfiguration {
  language?: string
  contextPrompt?: string | null
  targetLevel?: AiTargetLevel
  audience?: AiAudience
  learningObjectives?: string[]
  contentLength?: AiLength
  tone?: AiTone
}

export interface IUpdateAiConfiguration {
  language?: string
  contextPrompt?: string | null
  targetLevel?: AiTargetLevel
  audience?: AiAudience
  learningObjectives?: string[]
  contentLength?: AiLength
  tone?: AiTone
}

export interface IModuleAiConfiguration {
  id: number
  moduleId: number
  language: string
  contextPrompt: string | null
  createdAt: Date
  updatedAt: Date
  targetLevel?: AiTargetLevel
  audience?: AiAudience
  learningObjectives?: string[]
  contentLength?: AiLength
  tone?: AiTone
}

export interface ICreateModule {
  title: string
  description?: string | null
  isPublic?: boolean
  allowSelfEnroll?: boolean
  allowSelfUnenroll?: boolean
  logoUrl?: string | null
  aiConfiguration?: ICreateAiConfiguration
}

export interface IUpdateModule {
  title?: string
  description?: string | null
  isPublic?: boolean
  allowSelfEnroll?: boolean
  allowSelfUnenroll?: boolean
  logoUrl?: string | null
  isActive?: boolean
  aiConfiguration?: IUpdateAiConfiguration
}

export interface IModule {
  id: number
  title: string
  description: string | null
  teacherId: number
  isPublic: boolean
  allowSelfEnroll: boolean
  allowSelfUnenroll: boolean
  logoUrl: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  aiConfiguration?: IModuleAiConfiguration | null
}

export interface IModuleQueryParams {
  page?: number
  limit?: number
  search?: string
  isPublic?: boolean
  allowSelfEnroll?: boolean
  allowSelfUnenroll?: boolean
  isActive?: boolean
  teacherId?: number
}
export interface AiConfiguration {
  id: number
  moduleId: number
  language: string
  targetLevel: TargetLevel
  audience: Audience
  contentLength: ContentLength
  tone: Tone
  createdAt: Date
  updatedAt: Date
}

export type CreateAiConfiguration = Omit<AiConfiguration, 'id' | 'moduleId' | 'createdAt' | 'updatedAt'>

export type UpdateAiConfiguration = Partial<CreateAiConfiguration>


export type TargetLevel = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'

export type Audience = 'UNIVERSITY' | 'HIGH_SCHOOL' | 'PROFESSIONAL'

export type ContentLength = 'SHORT' | 'MEDIUM' | 'LONG'

export type Tone = 'EDUCATIONAL'| 'FORMAL' | 'CASUAL'
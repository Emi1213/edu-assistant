import type { AiConfiguration, CreateAiConfiguration } from './ai-configuration.types'

export interface Module {
  id: number
  title: string
  description: string | null
  teacherId: number
  isPublic: boolean
  allowSelfEnroll: boolean
  logoUrl: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  aiConfiguration?: AiConfiguration | null
}

export interface ModuleQueryParams {
    page?: number
    limit?: number
    search?: string
    isPublic?: boolean
}

export interface CreateModule extends Omit<Module, 'id' | 'createdAt' | 'updatedAt' | 'aiConfiguration'> {
  aiConfiguration: CreateAiConfiguration
}

export interface UpdateModule extends Partial<CreateModule> {}
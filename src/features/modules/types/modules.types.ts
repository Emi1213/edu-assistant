import type { AiConfiguration } from './ai-configuration.types'

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

export interface ICreateModule {
  title: string
  description: string | null
  teacherId: number
  isPublic: boolean
  allowSelfEnroll: boolean
  logoUrl: string | null
  restrictions: string[] // Placeholder for restrictions
  aiConfiguration?: AiConfiguration | null
}

export interface IUpdateModule {
  id: number
  title?: string
  description?: string | null
  teacherId?: number
  isPublic?: boolean
  allowSelfEnroll?: boolean
  logoUrl?: string | null
  isActive?: boolean
  restrictions?: string[] // Placeholder for restrictions
  aiConfiguration?: AiConfiguration | null
}
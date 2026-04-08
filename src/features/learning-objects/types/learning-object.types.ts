import type { LearningObjectType } from './learning-object-type.types'

export interface LearningObject {
  id: number
  moduleId: number
  title: string
  type: LearningObjectType
  orderIndex: number
  keywords: string[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateLearningObjectPayload {
  moduleId: number
  title: string
  typeId: number
  isPublished: boolean
}

import type { UserProfile } from '@/features/auth/types/auth.types'

export interface CreateEnrollmentPayload {
  moduleId: number
}

export interface BulkEnrollStudentsPayload {
  moduleId: number
  studentIds: number[]
}

export interface UpdateEnrollmentPayload {
  isActive?: boolean
}

export interface Enrollment {
  id: number
  userId: number
  moduleId: number
  enrolledAt: Date
  completedAt: Date | null
  isActive: boolean
}

export interface EnrollmentStudent {
  id: number
  user: UserProfile
  enrolledAt: Date
  completedAt: Date | null
  isActive: boolean
}

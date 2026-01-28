import type { UserProfile } from '../../auth/types/auth.types'
import type { Role } from '../../auth/types/roles.enum'

export interface CreateEnrollmentPayload {
  moduleId: number
}

export interface BulkEnrollStudentsPayload {
  moduleId: number
  studentIds: number[]
}

export interface UpdateEnrollmentPayload {
  isActive?: boolean
  completedAt?: Date | null
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

import type { UserProfile } from '../../auth/types/auth.types'
import type { Role } from '../../auth/types/roles.enum'

// Interfaces for Request Payloads
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

// Interfaces for Responses
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
  user: UserProfile // Assuming UserProfile is sufficient, otherwise create a more specific type
  enrolledAt: Date
  completedAt: Date | null
  isActive: boolean
}

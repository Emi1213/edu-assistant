import type { Role } from './roles.enum'

export interface UserProfile {
  id: number
  email: string
  role: Role
  name: string
  lastName: string
  isActive: boolean
  microsoftId: string
  displayName: string
  profilePicture: string | null
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
}
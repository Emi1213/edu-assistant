import type { Role } from './roles.enum'

export interface User {
  id: number
  email: string
  role: Role
  name: string
  lastName: string
  isActive: boolean
  microsoftId: string | null
  displayName: string
  profilePicture: string | null
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
}

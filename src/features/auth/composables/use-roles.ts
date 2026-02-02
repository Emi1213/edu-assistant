import { computed } from 'vue'
import { useAuthStore } from '../context/auth-store'
import type { Role } from '../types/roles.enum'

export function useRoles() {
  const authStore = useAuthStore()

  const currentRole = computed<Role | null>(() => {
    return authStore.user?.role || null
  })

  function hasRole(role: Role): boolean {
    return currentRole.value === role
  }

  function hasAnyRole(roles: Role[]): boolean {
    if (!currentRole.value) return false
    return roles.includes(currentRole.value)
  }

  function hasAllRoles(roles: Role[]): boolean {
    if (!currentRole.value) return false
    return roles.every(role => currentRole.value === role)
  }

  function canAccess(allowedRoles?: Role[]): boolean {
    if (!allowedRoles || allowedRoles.length === 0) {
      return true 
    }
    return hasAnyRole(allowedRoles)
  }

  return {
    currentRole,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccess,
  }
}

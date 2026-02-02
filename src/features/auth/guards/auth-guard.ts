import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../context/auth-store'
import type { Role } from '../types/roles.enum'

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth === true
  const isAuthenticated = authStore.isAuthenticated
  const allowedRoles = to.meta.roles as Role[] | undefined

  if (requiresAuth && !isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
    return
  }


  if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  if (requiresAuth && isAuthenticated && allowedRoles && allowedRoles.length > 0) {
    const userRole = authStore.user?.role
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      next({ name: 'dashboard' })
      return
    }
  }

  next()
}

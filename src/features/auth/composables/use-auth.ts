import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthDataSource } from '../services/auth.service'
import { useAuthStore } from '../context/auth-store'
import { useToast } from '@/shared/composables/use-toast'
import type { UserProfile } from '../types/auth.types'
import type { Role } from '../types/roles.enum'

export function useAuth() {
  const router = useRouter()
  const toast = useToast()
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const authDataSource = new AuthDataSource()

  async function initialize(): Promise<void> {
    if (!authStore.token) {
      return
    }

    try {
      loading.value = true
      error.value = null

      const userProfile = await authDataSource.getMe()
      if (userProfile) {
        authStore.login(userProfile, authStore.token)
      } else {
        await logout()
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Token inválido o expirado'
      error.value = errorMsg
      await logout()
    } finally {
      loading.value = false
    }
  }

  function login(): void {
    const loginUrl = authDataSource.getMicrosoftLoginUrl()
    window.location.href = loginUrl
  }

  async function handleCallback(tokenParam: string | null): Promise<void> {
    if (!tokenParam) {
      toast.error('No se recibió token de autenticación')
      error.value = 'No se recibió token de autenticación'
      return
    }

    try {
      loading.value = true
      error.value = null

      authStore.setToken(tokenParam)
      
      const userProfile = await authDataSource.getMe()
      
      if (!userProfile) {
        throw new Error('No se pudo obtener el perfil del usuario')
      }

      authStore.login(userProfile, tokenParam)
      
      toast.success('Sesión iniciada correctamente')
      
      const redirect = router.currentRoute.value.query.redirect as string | undefined
      await router.replace(redirect || { name: 'modules' })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al iniciar sesión'
      error.value = errorMsg
      toast.error(errorMsg)
      await logout()
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    authStore.logout()
    error.value = null
    await router.push({ name: 'login' })
  }

  async function loginWithToken(token: string, role: Role): Promise<void> {
    if (!token || !role) {
      toast.error('Token y rol son requeridos')
      error.value = 'Token y rol son requeridos'
      return
    }

    try {
      loading.value = true
      error.value = null

      // Crear un perfil de usuario mock con el rol especificado
      const mockUser: UserProfile = {
        id: 1,
        email: role === 'TEACHER' ? 'profesor@uta.edu.ec' : 'estudiante@uta.edu.ec',
        role: role,
        name: role === 'TEACHER' ? 'Profesor' : 'Estudiante',
        lastName: 'Test',
        isActive: true,
        microsoftId: 'mock-microsoft-id',
        displayName: role === 'TEACHER' ? 'Profesor Test' : 'Estudiante Test',
        profilePicture: null,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      authStore.login(mockUser, token)
      
      toast.success(`Sesión iniciada como ${role}`)
      
      await router.replace({ name: 'modules' })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al iniciar sesión'
      error.value = errorMsg
      toast.error(errorMsg)
    } finally {
      loading.value = false
    }
  }

  return {
    login,
    handleCallback,
    logout,
    initialize,
    loginWithToken,
    loading,
    error,
  }
}

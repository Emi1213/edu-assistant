import { ref } from 'vue'
import router from '@/router'
import { AuthDataSource } from '../services/auth.service'
import { useAuthStore } from '../context/auth-store'
import { useToast } from '@/shared/composables/use-toast'

export function useAuth() {
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
    const toast = useToast()
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
      
      toast.success(`Bienvenido a Nous AI, ${userProfile.displayName || 'usuario'}`)
      const redirect = router.currentRoute.value.query.redirect as string | undefined
      const defaultRoute =
        userProfile.role === 'ADMIN' ? { name: 'admin' as const } : { name: 'modules' as const }
      await router.replace(redirect ? { path: redirect } : defaultRoute)
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

  return {
    login,
    handleCallback,
    logout,
    initialize,
    loading,
    error,
  }
}

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthDataSource } from '../services/auth-datasource'
import { useAuthStore } from '../context/auth-store'
import { useToast } from '@/shared/composables/use-toast'

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
      await router.push(redirect || '/dashboard')
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

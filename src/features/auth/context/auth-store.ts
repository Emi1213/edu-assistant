import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile } from '../types/auth.types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<UserProfile | null>(null)
    const token = ref<string>('')

    const isAuthenticated = computed(() => !!token.value)

    function setToken(newToken: string) {
      token.value = newToken
    }

    function login(userData: UserProfile | null, authToken: string) {
      user.value = userData
      token.value = authToken
    }

    function logout() {
      user.value = null
      token.value = ''
    }

    return { user, token, isAuthenticated, login, logout, setToken }
  },
  {
    persist: {
      key: 'auth',
      storage: localStorage,
      pick: ['user', 'token'],
    },
  },
)

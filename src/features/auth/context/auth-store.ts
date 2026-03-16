import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/auth.types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const token = ref<string>('')

    const isAuthenticated = computed(() => !!token.value)

    function setToken(newToken: string) {
      token.value = newToken
    }

    function login(userData: User | null, authToken: string) {
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

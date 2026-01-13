<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-8">
    <div class="max-w-md w-full text-center space-y-4">
      <div v-if="loading" class="space-y-4">
        <div class="flex justify-center">
          <svg
            class="animate-spin h-12 w-12 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <p class="text-muted-foreground">Completando autenticación...</p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div
          class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md"
        >
          {{ error }}
        </div>
        <button
          @click="goToLogin"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Volver al login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/use-auth'

const route = useRoute()
const router = useRouter()
const { handleCallback, loading, error } = useAuth()

onMounted(async () => {
  const token = route.query.token as string | null

  if (token) {
    await handleCallback(token)
  } else {
    // No token received, redirect to login
    router.push({
      name: 'login',
      query: { error: 'No se recibió token de autenticación' },
    })
  }
})

function goToLogin() {
  router.push({ name: 'login' })
}
</script>

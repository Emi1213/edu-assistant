<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/use-auth'
import { useToast } from '@/shared/composables/use-toast'
import { messageForOAuthCallbackQuery } from '../../utils/oauth-callback-errors'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { handleCallback, loading, error } = useAuth()

onMounted(async () => {
  const oauthErr = route.query.error as string | undefined
  const oauthErrDesc = route.query.error_description as string | undefined
  if (oauthErr || oauthErrDesc) {
    toast.error(messageForOAuthCallbackQuery(oauthErr, oauthErrDesc))
    await router.replace({ name: 'login' })
    return
  }

  const token = route.query.token as string | undefined

  if (!token) {
    toast.error('No se recibió la confirmación de inicio de sesión. Vuelve a intentarlo.')
    await router.replace({ name: 'login' })
    return
  }

  await handleCallback(token)
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-muted-foreground">Processing authentication...</p>
    </div>
    <div v-else-if="error" class="text-center">
      <p class="text-destructive">{{ error }}</p>
      <button
        @click="router.push({ name: 'login' })"
        class="mt-4 text-primary hover:underline"
      >
        Return to login
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AuthDataSource } from '../../services/auth.service'
import { useAuth } from '../../composables/use-auth'
import { classifyGoogleExchangeFailure, isValidGoogleExchangeCode } from '../../utils/google-auth'

type ExchangeState = 'loading' | 'terminal' | 'retryable'

const route = useRoute()
const router = useRouter()
const authDataSource = new AuthDataSource()
const { handleCallback } = useAuth()
const state = ref<ExchangeState>('loading')
let exchangeCode: string | null = null
let exchangeInProgress = false
let automaticExchangeStarted = false

async function exchange(): Promise<void> {
  if (!exchangeCode || exchangeInProgress) return

  exchangeInProgress = true
  state.value = 'loading'

  try {
    const accessToken = await authDataSource.exchangeGoogleCode(exchangeCode)
    exchangeCode = null
    await handleCallback(accessToken)
  } catch (error: unknown) {
    const failure = classifyGoogleExchangeFailure(error)
    state.value = failure
    if (failure === 'terminal') exchangeCode = null
  } finally {
    exchangeInProgress = false
  }
}

function startFreshGoogleLogin(): void {
  exchangeCode = null
  window.location.href = authDataSource.getGoogleLoginUrl()
}

onMounted(async () => {
  if (automaticExchangeStarted) return
  automaticExchangeStarted = true

  const code = route.query.code
  await router.replace({ name: 'google-auth-callback' })

  if (!isValidGoogleExchangeCode(code)) {
    state.value = 'terminal'
    return
  }

  exchangeCode = code
  await exchange()
})
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
    <section
      class="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 text-center shadow-xl border border-slate-200 dark:border-gray-700"
    >
      <template v-if="state === 'loading'">
        <div
          class="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#4285f4]"
          aria-hidden="true"
        ></div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Completando el acceso</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Estamos verificando tu cuenta de Google.
        </p>
      </template>

      <template v-else-if="state === 'retryable'">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Problema temporal</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          No pudimos conectar con el servicio de autenticación. Puedes reintentar sin salir de esta
          pantalla.
        </p>
        <button
          type="button"
          class="mt-6 w-full rounded-lg bg-[#233a83] px-4 py-3 font-semibold text-white hover:bg-[#1c2f6b]"
          @click="exchange"
        >
          Reintentar
        </button>
      </template>

      <template v-else>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">No pudimos iniciar sesión</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          La confirmación no es válida o ya expiró. Inicia un acceso nuevo con Google.
        </p>
        <button
          type="button"
          class="mt-6 w-full rounded-lg bg-[#4285f4] px-4 py-3 font-semibold text-white hover:bg-[#3367d6]"
          @click="startFreshGoogleLogin"
        >
          Volver a intentar con Google
        </button>
        <button
          type="button"
          class="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold text-gray-700 hover:bg-slate-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          @click="router.push({ name: 'login' })"
        >
          Volver al inicio de sesión
        </button>
      </template>
    </section>
  </main>
</template>

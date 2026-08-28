<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/use-auth'
import { resolveAuthErrorViewState } from '../../utils/oauth-callback-errors'

const route = useRoute()
const router = useRouter()
const { login, loginWithGoogle } = useAuth()
const errorState = computed(() =>
  resolveAuthErrorViewState(route.query.reason, route.query.suggested_provider),
)
const providerLabel = computed(() =>
  errorState.value.suggestedProvider === 'microsoft' ? 'Microsoft' : 'Google',
)

function startSuggestedLogin(): void {
  if (errorState.value.suggestedProvider === 'microsoft') {
    login()
    return
  }
  loginWithGoogle()
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
    <section
      class="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 text-center shadow-xl border border-slate-200 dark:border-gray-700"
    >
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">No pudimos iniciar sesión</h1>
      <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">{{ errorState.message }}</p>
      <button
        type="button"
        data-testid="suggested-provider-action"
        class="mt-6 w-full rounded-lg bg-[#4285f4] px-4 py-3 font-semibold text-white hover:bg-[#3367d6]"
        @click="startSuggestedLogin"
      >
        Continuar con {{ providerLabel }}
      </button>
      <button
        type="button"
        class="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold text-gray-700 hover:bg-slate-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        @click="router.push({ name: 'login' })"
      >
        Volver al inicio de sesión
      </button>
    </section>
  </main>
</template>

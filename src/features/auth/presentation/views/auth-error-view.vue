<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AuthDataSource } from '../../services/auth.service'
import { messageForGoogleOAuthFailure } from '../../utils/google-auth'

const route = useRoute()
const router = useRouter()
const authDataSource = new AuthDataSource()
const message = computed(() => messageForGoogleOAuthFailure(route.query.reason))

function startGoogleLogin(): void {
  window.location.href = authDataSource.getGoogleLoginUrl()
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
    <section
      class="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 text-center shadow-xl border border-slate-200 dark:border-gray-700"
    >
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">No pudimos iniciar sesión</h1>
      <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">{{ message }}</p>
      <button
        type="button"
        class="mt-6 w-full rounded-lg bg-[#4285f4] px-4 py-3 font-semibold text-white hover:bg-[#3367d6]"
        @click="startGoogleLogin"
      >
        Intentar de nuevo con Google
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

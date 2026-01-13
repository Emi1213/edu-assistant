<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-6">
    <div class="w-full max-w-md space-y-8">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-semibold text-foreground">
          Iniciar sesión
        </h1>
        <p class="text-sm text-muted-foreground">
          Accede con tu cuenta institucional
        </p>
      </div>

      <!-- Card -->
      <div class="bg-card border rounded-lg p-8 space-y-6 shadow-sm">
        <!-- Microsoft Login -->
        <button
          @click="handleMicrosoftLogin"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-foreground"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 23 23"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0" y="0" width="11" height="11" fill="#F25022" />
            <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
            <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
            <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
          </svg>

          <span v-if="!loading">Iniciar sesión con Microsoft</span>
          <span v-else>Redirigiendo…</span>
        </button>

        <!-- Info -->
        <p class="text-xs text-muted-foreground text-center">
          Solo se permiten cuentas con dominio institucional
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "../../composables/use-auth"

const { login, loading } = useAuth()

function handleMicrosoftLogin() {
  login()
}
</script>

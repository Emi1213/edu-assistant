<template>
  <div class="min-h-screen flex flex-col relative login-background login-font">
    <!-- Overlay for background image -->
    <div class="absolute inset-0 bg-black opacity-30"></div>

    <div class="flex-1 flex items-center justify-center p-4 relative z-10">
      <div
        class="relative flex flex-col w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl md:flex-row md:space-y-0 overflow-hidden"
      >
        <!-- Left Side -->
        <div class="relative w-full md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
            alt="img"
            class="w-full h-full hidden md:block object-cover"
          />
          <!-- Text on image -->
          <div
            class="absolute hidden md:flex flex-col top-0 left-0 w-full h-full bg-[#C8102E] bg-opacity-90 text-white p-10 justify-center space-y-6"
          >
            <img
              src="/images/logo.jpg"
              alt="Logo"
              class="w-32 h-32 mx-auto rounded-full object-cover"
            />
            <div class="space-y-4 text-center">
              <h2 class="text-4xl font-extrabold leading-tight">
                Sistema de Asistencia Educativa
              </h2>
            </div>
          </div>
        </div>

        <!-- Right Side -->
        <div class="w-full md:w-1/2 p-8 sm:p-12 flex items-center">
          <div class="w-full">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Bienvenido</h2>
              <p class="text-gray-500 dark:text-gray-400">
                Ingresa con tu cuenta institucional
              </p>
            </div>

            <!-- Microsoft Login Button -->
            <button
              @click="handleMicrosoftLogin"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-[#C8102E] dark:hover:border-[#C8102E] hover:bg-red-50 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-wait shadow-md hover:shadow-lg group"
            >
              <svg class="h-7 w-7" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="11" height="11" fill="#F25022" />
                <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
                <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
                <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
              </svg>
              <div class="text-left">
                <span
                  class="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-[#C8102E] dark:group-hover:text-white transition-colors duration-300"
                >
                  <span v-if="!loading">Ingresar con Microsoft 365</span>
                  <span v-else class="flex items-center gap-2">
                    <svg
                      class="animate-spin h-5 w-5"
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
                    Redirigiendo...
                  </span>
                </span>
                <p class="text-xs text-gray-500 dark:text-gray-400">Cuenta Institucional</p>
              </div>
            </button>

        
            <div
              class="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div class="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <svg
                  class="h-6 w-6 text-[#C8102E] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewbox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p class="leading-relaxed">
                  Utiliza tu cuenta institucional con dominio
                  <span class="font-semibold text-[#C8102E]">@uta.edu.ec</span> para acceder a la
                  plataforma.
                </p>
              </div>
            </div>

            <div class="mt-6 text-center text-xs text-gray-400">
              <p>© {{ new Date().getFullYear() }} Universidad Técnica de Ambato</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../../composables/use-auth'

const { login, loading } = useAuth()

function handleMicrosoftLogin() {
  login()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.login-font {
  font-family: 'Roboto', sans-serif;
}

.login-background {
  background-image: url('/images/login-hero.jpg');
  background-size: cover;
  background-position: center;
}
</style>


<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header Institucional -->
    <header class="bg-[#C8102E] text-white shadow-md">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span class="text-[#C8102E] font-bold text-xl">UTA</span>
            </div>
            <div>
              <h1 class="text-lg font-bold leading-tight">UNIVERSIDAD TÉCNICA DE AMBATO</h1>
              <p class="text-xs opacity-90">Sistema de Asistencia Educativa</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
      <!-- Patrón de fondo sutil -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(200, 16, 46, 0.1) 35px, rgba(200, 16, 46, 0.1) 70px);"></div>
      </div>

      <div class="relative z-10 w-full max-w-md">
        <!-- Tarjeta de Login -->
        <div class="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <!-- Encabezado de la tarjeta -->
          <div class="bg-gradient-to-r from-[#C8102E] to-[#E63946] px-6 py-4">
            <h2 class="text-xl font-bold text-white text-center">
              Plataforma Educativa Institucional
            </h2>
            <p class="text-sm text-white/90 text-center mt-1">
              Facultad de Ingeniería en Sistemas, Electrónica e Industrial
            </p>
          </div>

          <!-- Contenido del formulario -->
          <div class="p-8 space-y-6">
            <div class="text-center space-y-2">
              <p class="text-gray-600 font-medium">Ingresar con</p>
            </div>

            <!-- Botón Microsoft Office 365 -->
            <button
              @click="handleMicrosoftLogin"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-4 px-6 py-4 bg-white border-2 border-gray-300 rounded-lg hover:border-[#C8102E] hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md group"
            >
              <svg
                class="h-8 w-8"
                viewBox="0 0 23 23"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0" y="0" width="11" height="11" fill="#F25022" />
                <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
                <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
                <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
              </svg>
              <div class="flex flex-col items-start">
                <span class="font-semibold text-gray-800 group-hover:text-[#C8102E] transition-colors">
                  <span v-if="!loading">Microsoft Office 365</span>
                  <span v-else class="flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirigiendo…
                  </span>
                </span>
                <span class="text-xs text-gray-500">Cuenta institucional</span>
              </div>
            </button>

            <!-- Información adicional -->
            <div class="pt-4 border-t border-gray-200">
              <div class="flex items-start gap-2 text-xs text-gray-600">
                <svg class="h-4 w-4 text-[#C8102E] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="leading-relaxed">
                  Solo se permiten cuentas con dominio <span class="font-semibold text-[#C8102E]">@uta.edu.ec</span>. 
                  Utiliza tus credenciales institucionales para acceder.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer informativo -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            © {{ new Date().getFullYear() }} Universidad Técnica de Ambato - Todos los derechos reservados
          </p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-4">
      <div class="container mx-auto px-4 text-center">
        <p class="text-sm text-gray-300">
          Sistema Integrado de Información - UTA
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "../../composables/use-auth"

const { login, loading } = useAuth()

function handleMicrosoftLogin() {
  login()
}
</script>

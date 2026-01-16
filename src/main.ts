import './index.css'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { useAuth } from './features/auth/composables/use-auth'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { vueQueryClient } from './core/infraestructure/vue-query/query-client.'

function initTheme() {
  const stored = localStorage.getItem('theme')
  const theme = stored && ['light', 'dark', 'system'].includes(stored) ? stored : 'system'

  const root = document.documentElement
  const actualTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  if (actualTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

initTheme()

const toastOptions = {
  position: 'top-right',
  timeout: 4000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
}

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(VueQueryPlugin, {
  queryClient: vueQueryClient,
})
app.use(router)
app.use(Toast, toastOptions)

const { initialize } = useAuth()
initialize().then(() => {
  app.mount('#app')
})

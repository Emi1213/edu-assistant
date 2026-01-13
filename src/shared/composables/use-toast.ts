import { useToast as useVueToast } from 'vue-toastification'

type ToastOptions = Record<string, unknown>

export function useToast() {
  const toast = useVueToast()

  const normalizeMessage = (message?: string) =>
    message && message.trim().length > 0
      ? message
      : 'Ocurrió un error'

  return {
    success(message: string, options?: ToastOptions) {
      toast.success(normalizeMessage(message), {
        timeout: 3000,
        ...options,
      })
    },

    error(message: string, options?: ToastOptions) {
      toast.error(normalizeMessage(message), {
        timeout: 4000,
        ...options,
      })
    },

    info(message: string, options?: ToastOptions) {
      toast.info(normalizeMessage(message), {
        timeout: 3000,
        ...options,
      })
    },

    warning(message: string, options?: ToastOptions) {
      toast.warning(normalizeMessage(message), {
        timeout: 3000,
        ...options,
      })
    },
  }
}

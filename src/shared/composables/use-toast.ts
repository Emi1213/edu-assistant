import { useToast as useVueToast } from 'vue-toastification'

type ToastOptions = Record<string, unknown>

export function useToast() {
  const toast = useVueToast()

  const normalizeMessage = (message?: string | unknown): string => {
    if (message == null) return 'Ocurrió un error'
    if (typeof message === 'string') {
      return message.trim().length > 0 ? message : 'Ocurrió un error'
    }
    if (typeof message === 'object' && message !== null && 'content' in message && Array.isArray((message as { content: unknown[] }).content)) {
      const text = (message as { content: unknown[] }).content.filter((m) => m != null).join(' ').trim()
      return text || 'Ocurrió un error'
    }
    if (typeof message === 'object' && message !== null && 'message' in message && typeof (message as { message: unknown }).message === 'string') {
      return ((message as { message: string }).message as string).trim() || 'Ocurrió un error'
    }
    return 'Ocurrió un error'
  }

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

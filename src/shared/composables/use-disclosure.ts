import { ref } from 'vue'

/**
 * A standard composable for managing open/close states (dialogs, drawers, etc.).
 * @param initialState - The initial state of the disclosure (default: false).
 * @param onOpen - Optional callback to execute when opening.
 * @param onClose - Optional callback to execute when closing.
 */
export function useDisclosure(
  initialState = false,
  callbacks?: {
    onOpen?: () => void
    onClose?: () => void
  }
) {
  const isOpen = ref(initialState)

  const open = () => {
    isOpen.value = true
    callbacks?.onOpen?.()
  }

  const close = () => {
    isOpen.value = false
    callbacks?.onClose?.()
  }

  const toggle = () => {
    if (isOpen.value) close()
    else open()
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

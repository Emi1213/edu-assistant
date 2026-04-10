
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = (error as { message: unknown }).message
    if (typeof msg === 'string' && msg.trim()) return msg
  }
  if (typeof error === 'string' && error.trim()) return error
  return fallback
}

import axios from 'axios'

export type GoogleExchangeFailure = 'terminal' | 'retryable'

const SAFE_GOOGLE_OAUTH_FAILURE_MESSAGE =
  'No se pudo completar el inicio de sesión con Google. Vuelve a intentarlo.'

export function isValidGoogleExchangeCode(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value)
}

export function classifyGoogleExchangeFailure(error: unknown): GoogleExchangeFailure {
  if (!axios.isAxiosError(error)) return 'terminal'

  const status = error.response?.status
  return status === 503 || status == null ? 'retryable' : 'terminal'
}

export function messageForGoogleOAuthFailure(reason: unknown): string {
  if (reason === 'oauth_failed') return SAFE_GOOGLE_OAUTH_FAILURE_MESSAGE

  return SAFE_GOOGLE_OAUTH_FAILURE_MESSAGE
}

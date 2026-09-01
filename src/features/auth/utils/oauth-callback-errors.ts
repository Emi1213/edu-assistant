export function messageForOAuthCallbackQuery(
  error: string | undefined,
  errorDescription: string | undefined,
): string {
  const code = (error ?? '').toLowerCase().trim()
  const desc = (errorDescription ?? '').trim()

  if (code === 'access_denied' || /cancel|denied/i.test(desc)) {
    return 'Inicio de sesión cancelado. Puedes intentar de nuevo cuando quieras.'
  }

  if (code === 'interaction_required' || code === 'consent_required') {
    return 'Microsoft necesita que completes un paso extra en tu cuenta. Intenta de nuevo y acepta los permisos.'
  }

  if (code === 'invalid_grant' || code === 'invalid_request') {
    return 'El enlace de inicio de sesión expiró o no es válido. Vuelve a pulsar «Ingresar con Microsoft».'
  }

  if (
    code === 'server_error' ||
    code === 'temporarily_unavailable' ||
    /internal|500|servidor/i.test(desc)
  ) {
    return 'No pudimos completar el inicio de sesión por un problema del servidor. Intenta más tarde o contacta soporte si continúa.'
  }

  if (desc && desc.length < 200 && !/[{}[\]"]/.test(desc)) {
    return desc
  }

  return 'No se pudo completar el inicio de sesión. Intenta de nuevo o contacta soporte si el problema continúa.'
}

export type OAuthProvider = 'google' | 'microsoft'

export type AuthErrorViewState = {
  message: string
  suggestedProvider: OAuthProvider | null
}

const GENERIC_OAUTH_FAILURE_MESSAGE =
  'No se pudo completar el inicio de sesión. Vuelve a intentarlo.'

export function resolveAuthErrorViewState(
  reason: unknown,
  suggestedProvider: unknown,
): AuthErrorViewState {
  if (
    reason === 'account_link_required' &&
    (suggestedProvider === 'google' || suggestedProvider === 'microsoft')
  ) {
    const providerName = suggestedProvider === 'google' ? 'Google' : 'Microsoft'
    return {
      message: `Este correo ya está asociado con otro método de inicio de sesión. Intenta continuar con ${providerName}.`,
      suggestedProvider,
    }
  }

  return {
    message: GENERIC_OAUTH_FAILURE_MESSAGE,
    suggestedProvider: null,
  }
}

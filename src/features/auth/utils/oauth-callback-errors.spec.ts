import { describe, expect, it } from 'vitest'
import { messageForOAuthCallbackQuery, resolveAuthErrorViewState } from './oauth-callback-errors'

describe('Microsoft OAuth callback errors', () => {
  it('preserves the Microsoft-specific access denied message', () => {
    expect(messageForOAuthCallbackQuery('access_denied', undefined)).toContain(
      'Inicio de sesión cancelado',
    )
  })

  it('preserves the safe generic fallback for unsafe descriptions', () => {
    expect(messageForOAuthCallbackQuery('unknown', '{"secret":"value"}')).toBe(
      'No se pudo completar el inicio de sesión. Intenta de nuevo o contacta soporte si el problema continúa.',
    )
  })
})

describe('auth error route query', () => {
  it.each([
    ['google', 'Google'],
    ['microsoft', 'Microsoft'],
  ] as const)('allowlists the %s provider suggestion', (provider, label) => {
    expect(resolveAuthErrorViewState('account_link_required', provider)).toEqual({
      message: `Este correo ya está asociado con otro método de inicio de sesión. Intenta continuar con ${label}.`,
      suggestedProvider: provider,
    })
  })

  it.each([
    ['unknown', 'google'],
    ['account_link_required', 'github'],
    [['account_link_required'], 'microsoft'],
    ['account_link_required', ['google']],
  ])('falls back safely for tampered query values', (reason, provider) => {
    const result = resolveAuthErrorViewState(reason, provider)

    expect(result.suggestedProvider).toBeNull()
    expect(result.message).toBe('No se pudo completar el inicio de sesión. Vuelve a intentarlo.')
    expect(result.message).not.toContain(String(reason))
    expect(result.message).not.toContain(String(provider))
  })
})

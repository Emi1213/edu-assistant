import { describe, expect, it } from 'vitest'
import { messageForOAuthCallbackQuery } from './oauth-callback-errors'

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

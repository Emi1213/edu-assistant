import { AxiosError } from 'axios'
import { describe, expect, it } from 'vitest'
import {
  classifyGoogleExchangeFailure,
  isValidGoogleExchangeCode,
  messageForGoogleOAuthFailure,
} from './google-auth'

describe('Google authentication utilities', () => {
  it('accepts only scalar 43-character base64url codes', () => {
    expect(isValidGoogleExchangeCode('aB0_-'.repeat(8) + 'abc')).toBe(true)
    expect(isValidGoogleExchangeCode(['a'.repeat(43)])).toBe(false)
    expect(isValidGoogleExchangeCode('a'.repeat(42))).toBe(false)
    expect(isValidGoogleExchangeCode(`${'a'.repeat(42)}+`)).toBe(false)
  })

  it.each([400, 401])('classifies status %s as terminal', (status) => {
    const error = new AxiosError('exchange failed', undefined, undefined, undefined, {
      status,
    } as never)
    expect(classifyGoogleExchangeFailure(error)).toBe('terminal')
  })

  it('classifies 503 and network failures as retryable', () => {
    const unavailable = new AxiosError('unavailable', undefined, undefined, undefined, {
      status: 503,
    } as never)
    expect(classifyGoogleExchangeFailure(unavailable)).toBe('retryable')
    expect(classifyGoogleExchangeFailure(new AxiosError('Network Error'))).toBe('retryable')
  })

  it('never reflects an OAuth failure reason', () => {
    const expected = messageForGoogleOAuthFailure('oauth_failed')
    expect(messageForGoogleOAuthFailure('<script>alert(1)</script>')).toBe(expected)
    expect(expected).not.toContain('oauth_failed')
  })
})

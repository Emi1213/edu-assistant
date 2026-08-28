import { describe, expect, it, vi } from 'vitest'
import type { IHttpHandler, IHttpResponse } from '@/core/interfaces/IHttpHandler'
import { AuthDataSource } from './auth.service'

function createHttpClient(): IHttpHandler {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}

describe('AuthDataSource', () => {
  it('exchanges a Google code through the unauthenticated client', async () => {
    const authenticatedClient = createHttpClient()
    const unauthenticatedClient = createHttpClient()
    const response: IHttpResponse<{ accessToken: string }> = {
      success: true,
      message: { content: [], displayable: false },
      data: { accessToken: 'access-token' },
    }
    vi.mocked(unauthenticatedClient.post).mockResolvedValue(response)
    const service = new AuthDataSource(authenticatedClient, unauthenticatedClient)

    await expect(service.exchangeGoogleCode('a'.repeat(43))).resolves.toBe('access-token')
    expect(unauthenticatedClient.post).toHaveBeenCalledOnce()
    expect(unauthenticatedClient.post).toHaveBeenCalledWith('/auth/exchange', {
      code: 'a'.repeat(43),
    })
    expect(authenticatedClient.post).not.toHaveBeenCalled()
  })
})

import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AuthSuccessView from './auth-success-view.vue'

const mocks = vi.hoisted(() => ({
  route: { query: {} as Record<string, unknown> },
  replace: vi.fn(),
  push: vi.fn(),
  handleCallback: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => mocks.route,
  useRouter: () => ({ replace: mocks.replace, push: mocks.push }),
}))

vi.mock('../../composables/use-auth', () => ({
  useAuth: () => ({
    handleCallback: mocks.handleCallback,
    loading: false,
    error: null,
  }),
}))

vi.mock('@/shared/composables/use-toast', () => ({
  useToast: () => ({ error: mocks.toastError }),
}))

describe('AuthSuccessView Microsoft callback', () => {
  beforeEach(() => {
    mocks.route.query = {}
    mocks.replace.mockReset()
    mocks.push.mockReset()
    mocks.handleCallback.mockReset()
    mocks.toastError.mockReset()
  })

  it('continues passing the Microsoft token to the existing callback handler', async () => {
    mocks.route.query = { token: 'microsoft-token' }

    mount(AuthSuccessView)
    await flushPromises()

    expect(mocks.handleCallback).toHaveBeenCalledOnce()
    expect(mocks.handleCallback).toHaveBeenCalledWith('microsoft-token')
    expect(mocks.replace).not.toHaveBeenCalled()
  })

  it('preserves Microsoft query-error handling', async () => {
    mocks.route.query = { error: 'access_denied' }

    mount(AuthSuccessView)
    await flushPromises()

    expect(mocks.toastError).toHaveBeenCalledWith(
      'Inicio de sesión cancelado. Puedes intentar de nuevo cuando quieras.',
    )
    expect(mocks.replace).toHaveBeenCalledWith({ name: 'login' })
    expect(mocks.handleCallback).not.toHaveBeenCalled()
  })
})

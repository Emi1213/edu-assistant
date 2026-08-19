import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AuthErrorView from './auth-error-view.vue'

const mocks = vi.hoisted(() => ({
  route: { query: {} as Record<string, unknown> },
  push: vi.fn(),
  login: vi.fn(),
  loginWithGoogle: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => mocks.route,
  useRouter: () => ({ push: mocks.push }),
}))

vi.mock('../../composables/use-auth', () => ({
  useAuth: () => ({
    login: mocks.login,
    loginWithGoogle: mocks.loginWithGoogle,
  }),
}))

describe('AuthErrorView', () => {
  beforeEach(() => {
    mocks.route.query = {}
    vi.clearAllMocks()
  })

  it.each([
    ['google', 'Google'],
    ['microsoft', 'Microsoft'],
  ] as const)('offers the suggested %s provider action', async (provider, label) => {
    mocks.route.query = {
      reason: 'account_link_required',
      suggested_provider: provider,
    }
    const wrapper = mount(AuthErrorView)

    expect(wrapper.text()).toContain(`Intenta continuar con ${label}.`)
    await wrapper.get('[data-testid="suggested-provider-action"]').trigger('click')

    if (provider === 'google') {
      expect(mocks.loginWithGoogle).toHaveBeenCalledOnce()
      expect(mocks.login).not.toHaveBeenCalled()
    } else {
      expect(mocks.login).toHaveBeenCalledOnce()
      expect(mocks.loginWithGoogle).not.toHaveBeenCalled()
    }
  })

  it('ignores a tampered provider and keeps the safe login fallback', async () => {
    mocks.route.query = {
      reason: 'account_link_required',
      suggested_provider: 'github',
    }
    const wrapper = mount(AuthErrorView)

    expect(wrapper.text()).toContain(
      'No se pudo completar el inicio de sesión. Vuelve a intentarlo.',
    )
    expect(wrapper.text()).not.toContain('github')
    await wrapper.get('[data-testid="suggested-provider-action"]').trigger('click')
    expect(mocks.loginWithGoogle).toHaveBeenCalledOnce()
    expect(mocks.login).not.toHaveBeenCalled()
  })

  it('returns safely to the login route', async () => {
    const wrapper = mount(AuthErrorView)

    await wrapper.get('button:last-of-type').trigger('click')
    expect(mocks.push).toHaveBeenCalledWith({ name: 'login' })
  })
})

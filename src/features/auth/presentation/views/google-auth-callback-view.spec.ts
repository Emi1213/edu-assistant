import { flushPromises, mount } from '@vue/test-utils'
import { AxiosError } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import GoogleAuthCallbackView from './google-auth-callback-view.vue'

const mocks = vi.hoisted(() => ({
  route: { query: {} as Record<string, unknown> },
  replace: vi.fn(),
  push: vi.fn(),
  exchangeGoogleCode: vi.fn(),
  handleCallback: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => mocks.route,
  useRouter: () => ({ replace: mocks.replace, push: mocks.push }),
}))

vi.mock('../../services/auth.service', () => ({
  AuthDataSource: class {
    exchangeGoogleCode = mocks.exchangeGoogleCode
    getGoogleLoginUrl = () => 'https://api.example.test/auth/google'
  },
}))

vi.mock('../../composables/use-auth', () => ({
  useAuth: () => ({ handleCallback: mocks.handleCallback }),
}))

describe('GoogleAuthCallbackView', () => {
  beforeEach(() => {
    mocks.route.query = {}
    mocks.replace.mockReset().mockImplementation(async () => {
      mocks.route.query = {}
    })
    mocks.push.mockReset()
    mocks.exchangeGoogleCode.mockReset()
    mocks.handleCallback.mockReset()
  })

  it('cleans the URL before one automatic exchange', async () => {
    const code = 'a'.repeat(43)
    mocks.route.query = { code }
    mocks.exchangeGoogleCode.mockResolvedValue('access-token')

    mount(GoogleAuthCallbackView)
    await flushPromises()

    expect(mocks.replace).toHaveBeenCalledOnce()
    expect(mocks.replace).toHaveBeenCalledWith({ name: 'google-auth-callback' })
    expect(mocks.replace.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.exchangeGoogleCode.mock.invocationCallOrder[0]!,
    )
    expect(mocks.exchangeGoogleCode).toHaveBeenCalledOnce()
    expect(mocks.exchangeGoogleCode).toHaveBeenCalledWith(code)
    expect(mocks.handleCallback).toHaveBeenCalledWith('access-token')
  })

  it('does not exchange an invalid or repeated query code', async () => {
    mocks.route.query = { code: ['a'.repeat(43)] }
    const wrapper = mount(GoogleAuthCallbackView)
    await flushPromises()

    expect(mocks.replace).toHaveBeenCalledOnce()
    expect(mocks.exchangeGoogleCode).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('La confirmación no es válida o ya expiró')
  })

  it('does not retry a terminal exchange failure with the same code', async () => {
    mocks.route.query = { code: 'a'.repeat(43) }
    mocks.exchangeGoogleCode.mockRejectedValue(
      new AxiosError('invalid', undefined, undefined, undefined, { status: 401 } as never),
    )
    const wrapper = mount(GoogleAuthCallbackView)
    await flushPromises()

    expect(wrapper.text()).toContain('Inicia un acceso nuevo con Google')
    expect(wrapper.findAll('button').map((button) => button.text())).not.toContain('Reintentar')
    expect(mocks.exchangeGoogleCode).toHaveBeenCalledOnce()
  })

  it('allows one explicit same-code retry after a temporary failure', async () => {
    mocks.route.query = { code: 'a'.repeat(43) }
    mocks.exchangeGoogleCode
      .mockRejectedValueOnce(new AxiosError('Network Error'))
      .mockResolvedValueOnce('access-token')
    const wrapper = mount(GoogleAuthCallbackView)
    await flushPromises()

    expect(mocks.exchangeGoogleCode).toHaveBeenCalledOnce()
    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(mocks.exchangeGoogleCode).toHaveBeenCalledTimes(2)
    expect(mocks.exchangeGoogleCode).toHaveBeenNthCalledWith(2, 'a'.repeat(43))
    expect(mocks.handleCallback).toHaveBeenCalledWith('access-token')
  })
})

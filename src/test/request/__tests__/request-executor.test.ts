import { vi } from 'vitest'
import nock from 'nock'
import { getRequestExecutor } from '../../../lib/request/request-executor.js'

describe('getRequestExecutor operationMiddlewares', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  afterAll(() => {
    nock.cleanAll()
  })

  it('should execute operation middlewares in declaration order', async () => {
    const order: string[] = []

    const requestExecutor = getRequestExecutor({
      timeoutMs: 1000,
      retry: {
        delayMs: 0,
        maxRetries: 0,
        jitter: false,
      },
      operationMiddlewares: [
        async (next, requestConfig): Promise<any> => {
          order.push('m1-before')
          const result = await next(requestConfig)
          order.push('m1-after')
          return result
        },
        async (next, requestConfig): Promise<any> => {
          order.push('m2-before')
          const result = await next(requestConfig)
          order.push('m2-after')
          return result
        },
      ],
    })

    const scope = nock('https://localhost')
      .get('/test')
      .matchHeader('X-From-Middleware', 'yes')
      .reply(200, { success: true })

    const response = await requestExecutor({
      url: 'https://localhost/test',
      method: 'GET',
      headers: {
        'X-From-Middleware': 'yes',
      },
    })

    expect(response).toEqual({ success: true })
    expect(scope.isDone()).toBe(true)
    expect(order).toEqual(['m1-before', 'm2-before', 'm2-after', 'm1-after'])
  })

  it('should allow short-circuiting without making an HTTP call', async () => {
    const requestExecutor = getRequestExecutor({
      retry: {
        delayMs: 0,
        maxRetries: 0,
        jitter: false,
      },
      operationMiddlewares: [
        async (): Promise<any> => {
          return { shortCircuited: true }
        },
      ],
    })

    const result = await requestExecutor({
      url: 'https://localhost/test',
      method: 'GET',
      headers: {},
    })

    expect(result).toEqual({ shortCircuited: true })
    expect(nock.pendingMocks()).toEqual([])
  })

  it('should allow middleware to override request data before execution', async () => {
    const requestExecutor = getRequestExecutor({
      retry: {
        delayMs: 0,
        maxRetries: 0,
        jitter: false,
      },
      operationMiddlewares: [
        async (next, requestConfig): Promise<any> => {
          return next({
            ...requestConfig,
            headers: {
              ...requestConfig.headers,
              Authorization: 'Bearer middleware-token',
            },
          })
        },
      ],
    })

    const scope = nock('https://localhost')
      .get('/test')
      .matchHeader('Authorization', 'Bearer middleware-token')
      .reply(200, { success: true })

    const response = await requestExecutor({
      url: 'https://localhost/test',
      method: 'GET',
      headers: {},
    })

    expect(response).toEqual({ success: true })
    expect(scope.isDone()).toBe(true)
  })

  it('should propagate middleware errors', async () => {
    const expectedError = new Error('middleware failed')

    const requestExecutor = getRequestExecutor({
      operationMiddlewares: [
        async (): Promise<any> => {
          throw expectedError
        },
      ],
    })

    await expect(
      requestExecutor({
        url: 'https://localhost/test',
        method: 'GET',
        headers: {},
      }),
    ).rejects.toBe(expectedError)
  })

  it('should include middleware-modified request in onBeforeRequest callback', async () => {
    const onBeforeRequest = vi.fn().mockImplementation((config: any) => config)

    const requestExecutor = getRequestExecutor({
      retry: {
        delayMs: 0,
        maxRetries: 0,
        jitter: false,
      },
      onBeforeRequest,
      operationMiddlewares: [
        async (next, requestConfig): Promise<any> => {
          return next({
            ...requestConfig,
            headers: {
              ...requestConfig.headers,
              'X-From-Operation-Middleware': '1',
            },
          })
        },
      ],
    })

    const scope = nock('https://localhost')
      .get('/test')
      .matchHeader('X-From-Operation-Middleware', '1')
      .reply(200, { success: true })

    await requestExecutor({
      url: 'https://localhost/test',
      method: 'GET',
      headers: {},
    })

    expect(scope.isDone()).toBe(true)
    expect(onBeforeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-From-Operation-Middleware': '1',
        }),
      }),
    )
  })
})

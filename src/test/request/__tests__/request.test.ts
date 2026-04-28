import { beforeEach, vi } from 'vitest'
import { setTimeout as sleep } from 'node:timers/promises'
import nock from 'nock'
import { request, RequestOptions } from '../../../lib/request/index.js'
import axios from 'axios'

describe('request', () => {
  function getRequestConfig(): RequestOptions {
    return {
      request: {
        url: 'https://localhost/test',
        method: 'GET',
        headers: {},
        params: {},
      },
      retry: {
        delayMs: 0,
        maxRetries: 0,
        jitter: false,
      },
      axiosInstance: axios.create(),
    }
  }

  beforeEach(() => {
    nock.cleanAll()
  })

  afterAll(() => {
    nock.cleanAll()
  })

  describe('HTTP verbs', function () {
    it('should make a GET request when the config specifies a GET request', async () => {
      const scope = nock('https://localhost').get('/test').reply(200, { success: true })

      const result = await request(getRequestConfig())

      scope.isDone()
      expect(result).toEqual({ success: true })
    })

    it('should make a POST request when the config specifies a POST request', async () => {
      const scope = nock('https://localhost').post('/test').reply(200, { success: true })
      const requestConfig = getRequestConfig()
      requestConfig.request.method = 'POST'

      const result = await request(requestConfig)

      scope.isDone()
      expect(result).toEqual({ success: true })
    })

    it('should make a DELETE request when the config specifies a DELETE request', async () => {
      const scope = nock('https://localhost').delete('/test').reply(200, { success: true })
      const requestConfig = getRequestConfig()
      requestConfig.request.method = 'DELETE'

      const result = await request(requestConfig)

      scope.isDone()
      expect(result).toEqual({ success: true })
    })
  })

  describe('Headers and parameters', function () {
    it('should send all specified HTTP headers when making a request', async () => {
      const scope = nock('https://localhost')
        .matchHeader('User-Agent', 'test-user-agent')
        .matchHeader('Authorization', 'Bearer test-access-token')
        .get('/test')
        .reply(200, { success: true })
      const requestConfig = getRequestConfig()
      requestConfig.request.headers = {
        'User-agent': 'test-user-agent',
        Authorization: 'Bearer test-access-token',
      }

      const result = await request(requestConfig)

      scope.isDone()
      expect(result).toEqual({ success: true })
    })

    it('should send all specified params when making a request', async () => {
      const scope = nock('https://localhost')
        .get('/test')
        .query({ age: 1234, name: 'Fred' })
        .reply(200, { success: true })
      const requestConfig = getRequestConfig()
      requestConfig.request.params = { age: 1234, name: 'Fred' }

      const result = await request(requestConfig)

      scope.isDone()
      expect(result).toEqual({ success: true })
    })
  })

  describe('Timeout', () => {
    it('should timeout after the default timeout period', async () => {
      const scope = nock('https://localhost').get('/test').delay(500).reply(200, { success: true })
      const requestConfig = getRequestConfig()
      requestConfig.timeoutMs = 11

      await expect(request(requestConfig)).rejects.toThrowError('timeout of 11ms exceeded')

      scope.isDone()
    })
  })

  describe('Aggregate timeout', () => {
    it('should throw an aggregate timeout error after exceeding the aggregate timeout limit', async () => {
      const scope1 = nock('https://localhost').get('/test').delay(600).reply(500, { success: true })
      const scope2 = nock('https://localhost').get('/test').delay(600).reply(200, { success: true })
      const requestConfig = getRequestConfig()
      requestConfig.retry = {
        maxRetries: 3,
        delayMs: 10,
        jitter: false,
      }
      requestConfig.timeoutMs = 800
      requestConfig.aggregateTimeoutMs = 1000

      await expect(request(requestConfig)).rejects.toThrowError('Request aborted due to aggregate timeout')

      scope1.isDone()
      scope2.isDone()
    })
  })

  describe('Abort controller', () => {
    it('should throw an error indicating that the request was cancelled', async () => {
      const scope1 = nock('https://localhost').get('/test').delay(1000).reply(500, { success: true })

      const abortController = new AbortController()
      const requestConfig = getRequestConfig()
      requestConfig.timeoutMs = 2000
      requestConfig.aggregateTimeoutMs = 4000
      requestConfig.abortController = abortController

      const promise = request(requestConfig)
      await sleep(100)
      abortController.abort('Manual abort')

      await expect(() => promise).rejects.toThrowError('Request aborted')
      scope1.isDone()
    })
  })

  describe('Retry mechanism', () => {
    describe('with 500 status code response', () => {
      it('should not retry when no retry configuration is passed in to the constructor or method call', async () => {
        const scope = nock('https://localhost').get('/test').reply(500, {})

        await expect(request(getRequestConfig())).rejects.toThrowError('Request failed with status code 500')

        expect(scope.isDone())
      })

      it('should make 2 calls when maxRetries is set to 1 and the first call fails', async () => {
        const scope1 = nock('https://localhost').get('/test').reply(500, { success: false })
        const scope2 = nock('https://localhost').get('/test').reply(200, { success: true })
        const requestConfig = getRequestConfig()
        requestConfig.retry.maxRetries = 1

        const result = await request(requestConfig)

        expect(scope1.isDone())
        expect(scope2.isDone())
        expect(result).toEqual({ success: true })
      })

      it('should include an X-Retry-Count header indicating the retry attempt being made', async () => {
        const scope1 = nock('https://localhost').get('/test').reply(500, { success: false })
        const scope2 = nock('https://localhost')
          .matchHeader('X-Retry-Count', '1')
          .get('/test')
          .reply(500, { success: false })
        const scope3 = nock('https://localhost')
          .matchHeader('X-Retry-Count', '2')
          .get('/test')
          .reply(200, { success: true })
        const requestConfig = getRequestConfig()
        requestConfig.retry.maxRetries = 2

        const result = await request(requestConfig)

        expect(scope1.isDone())
        expect(scope2.isDone())
        expect(scope3.isDone())
        expect(result).toEqual({ success: true })
      })

      it('should delay by a well defined amount when the jitter retry mechanism is not enabled', async () => {
        const scope1 = nock('https://localhost').get('/test').reply(500, { success: false })
        const scope2 = nock('https://localhost').get('/test').reply(500, { success: false })
        const scope3 = nock('https://localhost').get('/test').reply(500, { success: false })
        const scope4 = nock('https://localhost').get('/test').reply(200, { success: true })
        const requestConfig = getRequestConfig()
        requestConfig.retry.maxRetries = 3
        requestConfig.retry.delayMs = 20

        const startTime = Date.now()
        const result = await request(requestConfig)
        const duration = Date.now() - startTime

        expect(scope1.isDone())
        expect(scope2.isDone())
        expect(scope3.isDone())
        expect(scope4.isDone())
        expect(result).toEqual({ success: true })
        expect(duration).toBeGreaterThanOrEqual(140)
      })

      it('should only retry once if the first retry request succeeds, even when the retry config allows for more retries', async () => {
        const scope1 = nock('https://localhost').get('/test').reply(500, { success: false })
        const scope2 = nock('https://localhost').get('/test').reply(200, { success: true })
        const scope3 = nock('https://localhost').get('/test').reply(200, { success: true })
        const requestConfig = getRequestConfig()
        requestConfig.retry.maxRetries = 5

        const result = await request(requestConfig)

        expect(scope1.isDone())
        expect(scope2.isDone())
        expect(!scope3.isDone())
        expect(result).toEqual({ success: true })
      })

      it('should throw an error if a successful response is not received after all retries have failed', async () => {
        const scope1 = nock('https://localhost').get('/test').reply(500, { success: false })
        const scope2 = nock('https://localhost').get('/test').reply(500, { success: false })
        const scope3 = nock('https://localhost').get('/test').reply(500, { success: false })
        const requestConfig = getRequestConfig()
        requestConfig.retry.maxRetries = 2

        await expect(request(requestConfig)).rejects.toThrow('Request failed with status code 500')

        expect(scope1.isDone())
        expect(scope2.isDone())
        expect(scope3.isDone())
      })

      describe('onBeforeRequest', function () {
        it('should be called when passed in', async () => {
          const scope = nock('https://localhost')
            .get('/test')
            .query({
              name: 'Fred',
              age: 123,
            })
            .reply(200, { success: true })
          const mockOnBeforeRequest = vi.fn().mockResolvedValue(null)
          const requestConfig = getRequestConfig()
          requestConfig.onBeforeRequest = mockOnBeforeRequest
          requestConfig.request.params = {
            name: 'Fred',
            age: 123,
          }

          const result = await request(requestConfig)

          expect(result).toEqual({ success: true })
          expect(scope.isDone()).toBe(true)
          expect(mockOnBeforeRequest).toHaveBeenCalledWith({
            data: undefined,
            headers: {
              'User-Agent': '@gradientedge/commercetools-utils',
            },
            method: 'GET',
            params: {
              name: 'Fred',
              age: 123,
            },
            url: 'https://localhost/test',
          })
        })

        it('should have the additional header that we return from it synchronously, sent on the request', async () => {
          const scope = nock('https://localhost')
            .get('/test')
            .matchHeader('X-Test-Header', 'my-test-header-value')
            .query({
              name: 'Fred',
              age: 123,
            })
            .reply(200, { success: true })
          const mockOnBeforeRequest = vi.fn().mockImplementation((config: any) => {
            config.headers['X-Test-Header'] = 'my-test-header-value'
            return config
          })
          const requestConfig = getRequestConfig()
          requestConfig.onBeforeRequest = mockOnBeforeRequest
          requestConfig.request.params = {
            name: 'Fred',
            age: 123,
          }

          const result = await request(requestConfig)

          expect(result).toEqual({ success: true })
          expect(scope.isDone()).toBe(true)
          expect(mockOnBeforeRequest).toHaveBeenCalledWith({
            data: undefined,
            headers: {
              'User-Agent': '@gradientedge/commercetools-utils',
              'X-Test-Header': 'my-test-header-value',
            },
            method: 'GET',
            params: {
              name: 'Fred',
              age: 123,
            },
            url: 'https://localhost/test',
          })
        })

        it('should have the additional header that we return from it asynchronously, sent on the request', async () => {
          const scope = nock('https://localhost')
            .get('/test')
            .matchHeader('X-Test-Header', 'my-test-header-value')
            .query({
              name: 'Fred',
              age: 123,
            })
            .reply(200, { success: true })
          const mockOnBeforeRequest = vi.fn().mockImplementation((config: any) => {
            return new Promise((resolve) => {
              config.headers['X-Test-Header'] = 'my-test-header-value'
              resolve(config)
            })
          })
          const requestConfig = getRequestConfig()
          requestConfig.onBeforeRequest = mockOnBeforeRequest
          requestConfig.request.params = {
            name: 'Fred',
            age: 123,
          }

          const result = await request(requestConfig)

          expect(result).toEqual({ success: true })
          expect(scope.isDone()).toBe(true)
          expect(mockOnBeforeRequest).toHaveBeenCalledWith({
            data: undefined,
            headers: {
              'User-Agent': '@gradientedge/commercetools-utils',
              'X-Test-Header': 'my-test-header-value',
            },
            method: 'GET',
            params: {
              name: 'Fred',
              age: 123,
            },
            url: 'https://localhost/test',
          })
        })

        describe('onAfterResponse', function () {
          it('should be called on a successful response when passed in', async () => {
            const scope = nock('https://localhost')
              .get('/test')
              .query({ name: 'Fred', age: 123 })
              .reply(200, { success: true })
            const mockOnAfterResponse = vi.fn()
            const requestConfig = getRequestConfig()
            requestConfig.onAfterResponse = mockOnAfterResponse
            requestConfig.request.params = { name: 'Fred', age: 123 }

            const result = await request(requestConfig)

            expect(result).toEqual({ success: true })
            expect(scope.isDone()).toBe(true)
            expect(mockOnAfterResponse).toHaveBeenCalledWith({
              request: {
                headers: {
                  accept: 'application/json, text/plain, */*',
                  'accept-encoding': 'gzip, compress, deflate, br',
                  'user-agent': '@gradientedge/commercetools-utils',
                },
                method: 'get',
                params: {
                  age: 123,
                  name: 'Fred',
                },
                url: 'https://localhost/test',
              },
              response: {
                data: {
                  success: true,
                },
                headers: {
                  'content-type': 'application/json',
                },
                status: 200,
                tlsVersion: expect.any(String),
              },
              stats: {
                durationMs: expect.any(Number),
                accumulativeDurationMs: expect.any(Number),
                activeSockets: expect.any(Number),
                freeSocketCount: expect.any(Number),
                queuedRequests: expect.any(Number),
                clientStartTime: expect.any(Number),
                clientEndTime: expect.any(Number),
                retries: 0,
              },
            })
          })

          it('should be called on an unsuccessful response and again for a successful response', async () => {
            const scope1 = nock('https://localhost')
              .get('/test')
              .query({ name: 'Fred', age: 123 })
              .reply(500, { success: false })
            const scope2 = nock('https://localhost')
              .get('/test')
              .query({ name: 'Fred', age: 123 })
              .reply(200, { success: true })
            const mockOnAfterResponse = vi.fn()
            const requestConfig = getRequestConfig()
            requestConfig.onAfterResponse = mockOnAfterResponse
            requestConfig.request.params = { name: 'Fred', age: 123 }
            requestConfig.retry.maxRetries = 1

            const result = await request(requestConfig)

            expect(result).toEqual({ success: true })
            expect(scope1.isDone()).toBe(true)
            expect(scope2.isDone()).toBe(true)
            expect(mockOnAfterResponse).toHaveBeenNthCalledWith(1, {
              request: {
                headers: {
                  accept: 'application/json, text/plain, */*',
                  'accept-encoding': 'gzip, compress, deflate, br',
                  'user-agent': '@gradientedge/commercetools-utils',
                },
                method: 'get',
                params: {
                  age: 123,
                  name: 'Fred',
                },
                url: 'https://localhost/test',
              },
              response: {
                code: 'ERR_BAD_RESPONSE',
                data: {
                  success: false,
                },
                headers: {
                  'content-type': 'application/json',
                },
                status: 500,
                tlsVersion: expect.any(String),
              },
              stats: {
                durationMs: expect.any(Number),
                retries: 0,
                accumulativeDurationMs: expect.any(Number),
                activeSockets: expect.any(Number),
                freeSocketCount: expect.any(Number),
                queuedRequests: expect.any(Number),
                clientStartTime: expect.any(Number),
                clientEndTime: expect.any(Number),
              },
            })
            expect(mockOnAfterResponse).toHaveBeenNthCalledWith(2, {
              request: {
                headers: {
                  accept: 'application/json, text/plain, */*',
                  'accept-encoding': 'gzip, compress, deflate, br',
                  'user-agent': '@gradientedge/commercetools-utils',
                  'x-retry-count': '1',
                },
                method: 'get',
                params: {
                  age: 123,
                  name: 'Fred',
                },
                url: 'https://localhost/test',
              },
              response: {
                data: {
                  success: true,
                },
                headers: {
                  'content-type': 'application/json',
                },
                status: 200,
                tlsVersion: expect.any(String),
              },
              stats: {
                durationMs: expect.any(Number),
                accumulativeDurationMs: expect.any(Number),
                activeSockets: expect.any(Number),
                freeSocketCount: expect.any(Number),
                queuedRequests: expect.any(Number),
                clientStartTime: expect.any(Number),
                clientEndTime: expect.any(Number),
                retries: 1,
              },
            })
          })

          it('should be called on an unsuccessful response when passed in', async () => {
            const scope = nock('https://localhost')
              .get('/test')
              .query({ name: 'Fred', age: 123 })
              .reply(500, { success: false })
            const mockOnAfterResponse = vi.fn()
            const requestConfig = getRequestConfig()
            requestConfig.onAfterResponse = mockOnAfterResponse
            requestConfig.request.params = { name: 'Fred', age: 123 }

            await expect(request(requestConfig)).rejects.toThrow('Request failed with status code 500')

            expect(scope.isDone()).toBe(true)
            expect(mockOnAfterResponse).toHaveBeenCalledWith({
              request: {
                headers: {
                  accept: 'application/json, text/plain, */*',
                  'accept-encoding': 'gzip, compress, deflate, br',
                  'user-agent': '@gradientedge/commercetools-utils',
                },
                method: 'get',
                params: {
                  age: 123,
                  name: 'Fred',
                },
                url: 'https://localhost/test',
              },
              response: {
                code: 'ERR_BAD_RESPONSE',
                data: {
                  success: false,
                },
                headers: {
                  'content-type': 'application/json',
                },
                status: 500,
                tlsVersion: expect.any(String),
              },
              stats: {
                durationMs: expect.any(Number),
                accumulativeDurationMs: expect.any(Number),
                activeSockets: expect.any(Number),
                freeSocketCount: expect.any(Number),
                queuedRequests: expect.any(Number),
                clientStartTime: expect.any(Number),
                clientEndTime: expect.any(Number),
                retries: 0,
              },
            })
          })

          it('should be called on a network error when passed in', async () => {
            const scope = nock('https://localhost')
              .get('/test')
              .query({ name: 'Fred', age: 123 })
              .delay(500)
              .reply(500, { success: false })
            const mockOnAfterResponse = vi.fn()
            const requestConfig = getRequestConfig()
            requestConfig.onAfterResponse = mockOnAfterResponse
            requestConfig.timeoutMs = 500
            requestConfig.request.params = { name: 'Fred', age: 123 }

            await expect(request(requestConfig)).rejects.toThrow('timeout of 500ms exceeded')

            expect(scope.isDone()).toBe(true)
            expect(mockOnAfterResponse).toHaveBeenCalledWith({
              request: {
                headers: {
                  accept: 'application/json, text/plain, */*',
                  'accept-encoding': 'gzip, compress, deflate, br',
                  'user-agent': '@gradientedge/commercetools-utils',
                },
                method: 'get',
                params: {
                  age: 123,
                  name: 'Fred',
                },
                url: 'https://localhost/test',
              },
              response: {
                code: 'ECONNABORTED',
                message: 'timeout of 500ms exceeded',
                tlsVersion: expect.any(String),
              },
              stats: {
                durationMs: expect.any(Number),
                accumulativeDurationMs: expect.any(Number),
                activeSockets: expect.any(Number),
                freeSocketCount: expect.any(Number),
                queuedRequests: expect.any(Number),
                clientStartTime: expect.any(Number),
                clientEndTime: expect.any(Number),
                retries: 0,
              },
            })
          })
        })
      })
    })
  })

  describe('In-flight GET request deduplication', function () {
    it('should share the same promise for two concurrent identical GET requests', async () => {
      const scope = nock('https://localhost').get('/test').query({ a: '1', b: '2' }).reply(200, { success: true })
      const config1 = getRequestConfig()
      config1.request.params = { a: '1', b: '2' }
      const config2 = getRequestConfig()
      config2.request.params = { a: '1', b: '2' }

      const [result1, result2] = await Promise.all([request(config1), request(config2)])

      expect(result1).toEqual({ success: true })
      expect(result2).toEqual({ success: true })
      expect(scope.isDone()).toBe(true)
      // nock would still have pending interceptors if a second HTTP call had been made
      expect(nock.pendingMocks()).toEqual([])
    })

    it('should share the promise regardless of the order of params properties', async () => {
      const scope = nock('https://localhost').get('/test').query({ a: '1', b: '2' }).reply(200, { success: true })
      const config1 = getRequestConfig()
      config1.request.params = { a: '1', b: '2' }
      const config2 = getRequestConfig()
      config2.request.params = { b: '2', a: '1' }

      const [result1, result2] = await Promise.all([request(config1), request(config2)])

      expect(result1).toEqual({ success: true })
      expect(result2).toEqual({ success: true })
      expect(scope.isDone()).toBe(true)
      expect(nock.pendingMocks()).toEqual([])
    })

    it('should make two separate requests when querystrings differ', async () => {
      const scope1 = nock('https://localhost').get('/test').query({ a: '1' }).reply(200, { which: 1 })
      const scope2 = nock('https://localhost').get('/test').query({ a: '2' }).reply(200, { which: 2 })
      const config1 = getRequestConfig()
      config1.request.params = { a: '1' }
      const config2 = getRequestConfig()
      config2.request.params = { a: '2' }

      const [result1, result2] = await Promise.all([request(config1), request(config2)])

      expect(result1).toEqual({ which: 1 })
      expect(result2).toEqual({ which: 2 })
      expect(scope1.isDone()).toBe(true)
      expect(scope2.isDone()).toBe(true)
    })

    it('should make two separate requests when URLs differ', async () => {
      const scope1 = nock('https://localhost').get('/test-a').reply(200, { which: 'a' })
      const scope2 = nock('https://localhost').get('/test-b').reply(200, { which: 'b' })
      const config1 = getRequestConfig()
      config1.request.url = 'https://localhost/test-a'
      const config2 = getRequestConfig()
      config2.request.url = 'https://localhost/test-b'

      const [result1, result2] = await Promise.all([request(config1), request(config2)])

      expect(result1).toEqual({ which: 'a' })
      expect(result2).toEqual({ which: 'b' })
      expect(scope1.isDone()).toBe(true)
      expect(scope2.isDone()).toBe(true)
    })

    it('should not deduplicate non-GET requests with the same URL and params', async () => {
      const scope = nock('https://localhost').post('/test').query({ a: '1' }).twice().reply(200, { success: true })
      const config1 = getRequestConfig()
      config1.request.method = 'POST'
      config1.request.params = { a: '1' }
      const config2 = getRequestConfig()
      config2.request.method = 'POST'
      config2.request.params = { a: '1' }

      const [result1, result2] = await Promise.all([request(config1), request(config2)])

      expect(result1).toEqual({ success: true })
      expect(result2).toEqual({ success: true })
      expect(scope.isDone()).toBe(true)
    })

    it('should share rejection with concurrent callers when the in-flight request fails', async () => {
      const scope = nock('https://localhost').get('/test').query({ a: '1' }).reply(400, { error: 'bad' })
      const config1 = getRequestConfig()
      config1.request.params = { a: '1' }
      const config2 = getRequestConfig()
      config2.request.params = { a: '1' }

      const results = await Promise.allSettled([request(config1), request(config2)])

      expect(results[0].status).toBe('rejected')
      expect(results[1].status).toBe('rejected')
      expect(scope.isDone()).toBe(true)
      expect(nock.pendingMocks()).toEqual([])
    })

    it('should not share the promise once the previous request has settled', async () => {
      const scope1 = nock('https://localhost').get('/test').query({ a: '1' }).reply(200, { call: 1 })
      const config1 = getRequestConfig()
      config1.request.params = { a: '1' }
      const result1 = await request(config1)
      expect(result1).toEqual({ call: 1 })
      expect(scope1.isDone()).toBe(true)

      const scope2 = nock('https://localhost').get('/test').query({ a: '1' }).reply(200, { call: 2 })
      const config2 = getRequestConfig()
      config2.request.params = { a: '1' }
      const result2 = await request(config2)
      expect(result2).toEqual({ call: 2 })
      expect(scope2.isDone()).toBe(true)
    })
  })

  describe('clientStartTime and clientEndTime stats', function () {
    it('should set both to timestamps close to Date.now() on a successful response', async () => {
      nock('https://localhost').get('/test').reply(200, { success: true })
      const mockOnAfterResponse = vi.fn()
      const requestConfig = getRequestConfig()
      requestConfig.onAfterResponse = mockOnAfterResponse

      const before = Date.now()
      await request(requestConfig)
      const after = Date.now()

      const stats = (mockOnAfterResponse.mock.calls[0][0] as any).stats
      expect(stats.clientStartTime).toBeGreaterThanOrEqual(before)
      expect(stats.clientStartTime).toBeLessThanOrEqual(after)
      expect(stats.clientEndTime).toBeGreaterThanOrEqual(stats.clientStartTime)
      expect(stats.clientEndTime).toBeLessThanOrEqual(after)
    })

    it('should have clientEndTime - clientStartTime approximately equal to durationMs', async () => {
      nock('https://localhost').get('/test').delay(50).reply(200, { success: true })
      const mockOnAfterResponse = vi.fn()
      const requestConfig = getRequestConfig()
      requestConfig.onAfterResponse = mockOnAfterResponse

      await request(requestConfig)

      const stats = (mockOnAfterResponse.mock.calls[0][0] as any).stats
      expect(stats.clientEndTime - stats.clientStartTime).toBe(stats.durationMs)
    })

    it('should populate clientStartTime and clientEndTime on an unsuccessful response', async () => {
      nock('https://localhost').get('/test').reply(500, { success: false })
      const mockOnAfterResponse = vi.fn()
      const requestConfig = getRequestConfig()
      requestConfig.onAfterResponse = mockOnAfterResponse

      const before = Date.now()
      await expect(request(requestConfig)).rejects.toThrow()
      const after = Date.now()

      const stats = (mockOnAfterResponse.mock.calls[0][0] as any).stats
      expect(stats.clientStartTime).toBeGreaterThanOrEqual(before)
      expect(stats.clientStartTime).toBeLessThanOrEqual(after)
      expect(stats.clientEndTime).toBeGreaterThanOrEqual(stats.clientStartTime)
      expect(stats.clientEndTime).toBeLessThanOrEqual(after)
    })

    it('should populate clientStartTime and clientEndTime on a network timeout error', async () => {
      nock('https://localhost').get('/test').delay(500).reply(200, { success: true })
      const mockOnAfterResponse = vi.fn()
      const requestConfig = getRequestConfig()
      requestConfig.onAfterResponse = mockOnAfterResponse
      requestConfig.timeoutMs = 100

      const before = Date.now()
      await expect(request(requestConfig)).rejects.toThrow('timeout of 100ms exceeded')
      const after = Date.now()

      const stats = (mockOnAfterResponse.mock.calls[0][0] as any).stats
      expect(stats.clientStartTime).toBeGreaterThanOrEqual(before)
      expect(stats.clientStartTime).toBeLessThanOrEqual(after)
      expect(stats.clientEndTime).toBeGreaterThanOrEqual(stats.clientStartTime)
      expect(stats.clientEndTime).toBeLessThanOrEqual(after)
    })

    it("should have each retry attempt's clientStartTime after the previous attempt's clientEndTime", async () => {
      nock('https://localhost').get('/test').reply(500, { success: false })
      nock('https://localhost').get('/test').reply(200, { success: true })
      const mockOnAfterResponse = vi.fn()
      const requestConfig = getRequestConfig()
      requestConfig.onAfterResponse = mockOnAfterResponse
      requestConfig.retry.maxRetries = 1
      requestConfig.retry.delayMs = 10

      await request(requestConfig)

      expect(mockOnAfterResponse).toHaveBeenCalledTimes(2)
      const firstStats = (mockOnAfterResponse.mock.calls[0][0] as any).stats
      const secondStats = (mockOnAfterResponse.mock.calls[1][0] as any).stats

      expect(firstStats.clientEndTime).toBeGreaterThanOrEqual(firstStats.clientStartTime)
      expect(secondStats.clientStartTime).toBeGreaterThanOrEqual(firstStats.clientEndTime)
      expect(secondStats.clientEndTime).toBeGreaterThanOrEqual(secondStats.clientStartTime)
    })

    it('should still reject when onBeforeRequest throws before the request is dispatched', async () => {
      // This covers the branch in the catch handler where `startTime` is
      // still null because the error was thrown before the axios call — so
      // `durationMs` falls back to 0 and `clientStartTime` falls back to
      // `endTime`.
      const requestConfig = getRequestConfig()
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      requestConfig.onBeforeRequest = async () => {
        throw new Error('before-request failure')
      }
      requestConfig.onAfterResponse = vi.fn()

      await expect(request(requestConfig)).rejects.toThrow('before-request failure')
      // convertAxiosError returns null for non-axios errors, so
      // onAfterResponse should not be invoked.
      expect(requestConfig.onAfterResponse).not.toHaveBeenCalled()
    })
  })
})

import { isRetryableError } from '../../../lib/request/index.js'

describe('isRetryableError', () => {
  describe('legacy behavior (no method provided)', () => {
    it('should return true when the error is not an axios error', async () => {
      const error = { test: 1 }

      const result = isRetryableError(error)

      expect(result).toBe(true)
    })

    it('should return true when the axios error is missing a request object', async () => {
      const error = { isAxiosError: true, response: {} }

      const result = isRetryableError(error)

      expect(result).toBe(true)
    })

    it('should return true when the axios error is missing a response object', async () => {
      const error = { isAxiosError: true, request: {} }

      const result = isRetryableError(error)

      expect(result).toBe(true)
    })

    it('should return true when the axios response status code is 500', async () => {
      const error = { isAxiosError: true, request: {}, response: { status: 500 } }

      const result = isRetryableError(error)

      expect(result).toBe(true)
    })

    it('should return true when the axios response status code is 501', async () => {
      const error = { isAxiosError: true, request: {}, response: { status: 501 } }

      const result = isRetryableError(error)

      expect(result).toBe(true)
    })

    it('should return true when the axios response status code is 502', async () => {
      const error = { isAxiosError: true, request: {}, response: { status: 502 } }

      const result = isRetryableError(error)

      expect(result).toBe(true)
    })

    it('should return true when the axios response status code is 503', async () => {
      const error = { isAxiosError: true, request: {}, response: { status: 503 } }

      const result = isRetryableError(error)

      expect(result).toBe(true)
    })

    it('should return true when the axios response status code is 504', async () => {
      const error = { isAxiosError: true, request: {}, response: { status: 504 } }

      const result = isRetryableError(error)

      expect(result).toBe(true)
    })

    it('should return false when the axios response status code is 400', async () => {
      const error = { isAxiosError: true, request: {}, response: { status: 400 } }

      const result = isRetryableError(error)

      expect(result).toBe(false)
    })

    it('should preserve legacy behavior when method is omitted — backward compat for unupdated callers', () => {
      const error = { isAxiosError: true, request: {}, code: 'ECONNABORTED' }

      expect(isRetryableError(error)).toBe(true)
    })
  })

  describe('POST/PATCH mutations — CT-aligned defaults (no config required)', () => {
    it('should NOT retry POST on ECONNABORTED by default — timeout means CT may have already processed it', () => {
      const error = { isAxiosError: true, request: {}, code: 'ECONNABORTED' }

      expect(isRetryableError(error, { method: 'POST' })).toBe(false)
    })

    it('should NOT retry PATCH on ETIMEDOUT by default', () => {
      const error = { isAxiosError: true, request: {}, code: 'ETIMEDOUT' }

      expect(isRetryableError(error, { method: 'PATCH' })).toBe(false)
    })

    it('should NOT retry DELETE on ECONNABORTED by default', () => {
      const error = { isAxiosError: true, request: {}, code: 'ECONNABORTED' }

      expect(isRetryableError(error, { method: 'DELETE' })).toBe(false)
    })

    it('should NOT retry POST on 500 by default — CT may have already completed the mutation', () => {
      const error = { isAxiosError: true, request: {}, response: { status: 500 } }

      expect(isRetryableError(error, { method: 'POST' })).toBe(false)
    })

    it('should NOT retry PATCH on 501 by default', () => {
      const error = { isAxiosError: true, request: {}, response: { status: 501 } }

      expect(isRetryableError(error, { method: 'PATCH' })).toBe(false)
    })

    it('should retry POST on 502 — gateway error, CT never received the request', () => {
      const error = { isAxiosError: true, request: {}, response: { status: 502 } }

      expect(isRetryableError(error, { method: 'POST' })).toBe(true)
    })

    it('should retry PATCH on 503', () => {
      const error = { isAxiosError: true, request: {}, response: { status: 503 } }

      expect(isRetryableError(error, { method: 'PATCH' })).toBe(true)
    })

    it('should retry DELETE on 504', () => {
      const error = { isAxiosError: true, request: {}, response: { status: 504 } }

      expect(isRetryableError(error, { method: 'DELETE' })).toBe(true)
    })

    it('should ALWAYS retry POST when request was never sent — server never received it', () => {
      const error = { isAxiosError: true }

      expect(isRetryableError(error, { method: 'POST' })).toBe(true)
    })

    it('should ALWAYS retry PATCH when request was never sent', () => {
      const error = { isAxiosError: true }

      expect(isRetryableError(error, { method: 'PATCH' })).toBe(true)
    })
  })

  describe('GET/HEAD/OPTIONS — safe read-only methods', () => {
    it('should retry GET on ECONNABORTED — safe read-only method', () => {
      const error = { isAxiosError: true, request: {}, code: 'ECONNABORTED' }

      expect(isRetryableError(error, { method: 'GET' })).toBe(true)
    })

    it('should retry GET on ETIMEDOUT', () => {
      const error = { isAxiosError: true, request: {}, code: 'ETIMEDOUT' }

      expect(isRetryableError(error, { method: 'GET' })).toBe(true)
    })

    it('should retry GET on 500', () => {
      const error = { isAxiosError: true, request: {}, response: { status: 500 } }

      expect(isRetryableError(error, { method: 'GET' })).toBe(true)
    })

    it('should not retry GET on unknown error code', () => {
      const error = { isAxiosError: true, request: {}, code: 'UNKNOWN_ERROR' }

      expect(isRetryableError(error, { method: 'GET' })).toBe(false)
    })
  })

  describe('methodPolicies override', () => {
    it('should override POST to retry on timeout via methodPolicies for explicitly idempotent flows', () => {
      const error = { isAxiosError: true, request: {}, code: 'ECONNABORTED' }
      const methodPolicies = { POST: { retryableErrorCodes: ['ECONNABORTED', 'ETIMEDOUT'] } }

      expect(isRetryableError(error, { method: 'POST', methodPolicies })).toBe(true)
    })

    it('should override PATCH to retry on 500 via methodPolicies', () => {
      const error = { isAxiosError: true, request: {}, response: { status: 500 } }
      const methodPolicies = { PATCH: { retryableStatusCodes: [500, 502, 503, 504] } }

      expect(isRetryableError(error, { method: 'PATCH', methodPolicies })).toBe(true)
    })

    it('should apply override only to the matching method — other methods use defaults', () => {
      const error = { isAxiosError: true, request: {}, code: 'ECONNABORTED' }
      const methodPolicies = { POST: { retryableErrorCodes: ['ECONNABORTED'] } }

      expect(isRetryableError(error, { method: 'PATCH', methodPolicies })).toBe(false)
    })

    it('should treat method lookup as case-insensitive', () => {
      const error = { isAxiosError: true, request: {}, code: 'ECONNABORTED' }

      expect(isRetryableError(error, { method: 'post' })).toBe(false)
    })
  })
})

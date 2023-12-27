import { isRetryableError } from '../../../lib/request/index.js'

describe('isRetryableError', () => {
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
})

import { retryOnConflict } from '../../lib/utils/retry-on-conflict'
import { CommercetoolsError } from '../../lib'
import { calculateDelay } from '../../lib/utils/calculate-delay'
import { mocked } from 'jest-mock'

jest.mock('../../lib/utils/calculate-delay')

describe('retryOnConflict', () => {
  beforeEach(() => {
    mocked(calculateDelay).mockReset().mockReturnValue(10)
  })

  it('should retry 3 times when no specific configuration is passed in', async () => {
    const error = new CommercetoolsError('test error', {}, 409)
    const mockExecuteFn = jest.fn()
    mockExecuteFn.mockRejectedValueOnce(error)
    mockExecuteFn.mockRejectedValueOnce(error)
    mockExecuteFn.mockResolvedValue(true)

    const result = await retryOnConflict({
      executeFn: mockExecuteFn,
    })

    expect(result).toBe(true)
    expect(mockExecuteFn).toBeCalledTimes(3)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(1, 1)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(2, 2)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(3, 3)
    expect(calculateDelay).toBeCalledTimes(2)
    expect(calculateDelay).toHaveBeenNthCalledWith(1, 1, { delayMs: 100, jitter: false, maxRetries: 3 })
    expect(calculateDelay).toHaveBeenNthCalledWith(2, 2, { delayMs: 100, jitter: false, maxRetries: 3 })
  })

  it('should throw an error if a 409 status is still returned after the default 3 attempts', async () => {
    const error = new CommercetoolsError('test error', {}, 409)
    const mockExecuteFn = jest.fn()
    mockExecuteFn.mockRejectedValue(error)

    await expect(
      retryOnConflict({
        executeFn: mockExecuteFn,
      }),
    ).rejects.toThrow(error)

    expect(mockExecuteFn).toBeCalledTimes(3)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(1, 1)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(2, 2)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(3, 3)
    expect(calculateDelay).toBeCalledTimes(2)
    expect(calculateDelay).toHaveBeenNthCalledWith(1, 1, { delayMs: 100, jitter: false, maxRetries: 3 })
    expect(calculateDelay).toHaveBeenNthCalledWith(2, 2, { delayMs: 100, jitter: false, maxRetries: 3 })
  })

  it('should retry 5 times when configuration dictates', async () => {
    const error = new CommercetoolsError('test error', {}, 409)
    const mockExecuteFn = jest.fn()
    mockExecuteFn.mockRejectedValueOnce(error)
    mockExecuteFn.mockRejectedValueOnce(error)
    mockExecuteFn.mockRejectedValueOnce(error)
    mockExecuteFn.mockRejectedValueOnce(error)
    mockExecuteFn.mockResolvedValue(true)

    const result = await retryOnConflict({
      executeFn: mockExecuteFn,
      maxRetries: 5,
    })

    expect(result).toBe(true)
    expect(mockExecuteFn).toBeCalledTimes(5)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(1, 1)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(2, 2)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(3, 3)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(4, 4)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(5, 5)
    expect(calculateDelay).toBeCalledTimes(4)
    expect(calculateDelay).toHaveBeenNthCalledWith(1, 1, { delayMs: 100, jitter: false, maxRetries: 5 })
    expect(calculateDelay).toHaveBeenNthCalledWith(2, 2, { delayMs: 100, jitter: false, maxRetries: 5 })
    expect(calculateDelay).toHaveBeenNthCalledWith(3, 3, { delayMs: 100, jitter: false, maxRetries: 5 })
    expect(calculateDelay).toHaveBeenNthCalledWith(4, 4, { delayMs: 100, jitter: false, maxRetries: 5 })
  })

  it('should immediately throw an error if a non 409 error status is received', async () => {
    const error = new CommercetoolsError('test error', {}, 500)
    const mockExecuteFn = jest.fn()
    mockExecuteFn.mockRejectedValueOnce(error)

    await expect(
      retryOnConflict({
        executeFn: mockExecuteFn,
        maxRetries: 5,
      }),
    ).rejects.toThrow(error)

    expect(mockExecuteFn).toBeCalledTimes(1)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(1, 1)
    expect(calculateDelay).toBeCalledTimes(0)
  })

  it('should pass through the configured values for `delayMs`, `maxRetries` and `jitter` to `calculateDelay', async () => {
    const error = new CommercetoolsError('test error', {}, 409)
    const mockExecuteFn = jest.fn()
    mockExecuteFn.mockRejectedValueOnce(error)
    mockExecuteFn.mockResolvedValue(true)

    const result = await retryOnConflict({
      executeFn: mockExecuteFn,
      maxRetries: 2,
      delayMs: 5,
      jitter: true,
    })

    expect(result).toBe(true)
    expect(mockExecuteFn).toBeCalledTimes(2)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(1, 1)
    expect(mockExecuteFn).toHaveBeenNthCalledWith(2, 2)
    expect(calculateDelay).toBeCalledTimes(1)
    expect(calculateDelay).toHaveBeenCalledWith(1, { delayMs: 5, jitter: true, maxRetries: 2 })
  })
})

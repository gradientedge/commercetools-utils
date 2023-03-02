import { calculateDelay } from './calculate-delay'
import { Status } from '@tshttp/status'

/**
 * Default maximum number of retries
 *
 * See the {@see calculateDelay} function for more details
 */
const DEFAULT_MAX_RETRIES = 3

/**
 * Default delay (in milliseconds) before a retry attempt is made
 *
 * See the {@see calculateDelay} function for more details
 */
const DEFAULT_DELAY_MS = 100

export interface RetryOnConflictParams<T = any> {
  /**
   * Any function that returns a promise
   *
   * This function is expected to be able to throw a {@see CommercetoolsError}
   * with a status code of 409. These errors should **not** be swallowed by the
   * code in this function.
   */
  executeFn: (attemptNo: number) => Promise<T>
  /**
   * The number of milliseconds to wait before retrying a failed request.
   * This will be increased exponentially {@see CommercetoolsApi.calculateDelay}.
   * Defaults to 100.
   */
  delayMs?: number

  /**
   * The maximum number of times that we'll call the `executeFn` function
   * before returning the error caught from the last failure.
   * Defaults to 3.
   */
  maxRetries?: number

  /**
   * If enabled, adds a random element to the exponential increase
   * in retry time. See the following url for more details:
   * https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
   * We utilise the 'full' jitter + plus an additional decaying variance.
   */
  jitter?: boolean
}

/**
 * Repeatedly executes a function until we get a non-409 HTTP response code
 */
export async function retryOnConflict<T = any>(options: RetryOnConflictParams): Promise<T> {
  const maxRetries = options?.maxRetries || DEFAULT_MAX_RETRIES
  const delayMs = options?.delayMs || DEFAULT_DELAY_MS
  const jitter = !!options?.jitter
  let result: T

  for (let attemptCount = 1; attemptCount <= maxRetries; attemptCount++) {
    if (attemptCount > 1) {
      const delay = calculateDelay(attemptCount - 1, { delayMs, maxRetries, jitter })
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
    try {
      return await options.executeFn(attemptCount)
    } catch (e: any) {
      if (!e.isCommercetoolsError || e.status !== Status.Conflict || attemptCount === maxRetries) {
        throw e
      }
    }
  }

  // eslint-disable-next-line
  return result!
}

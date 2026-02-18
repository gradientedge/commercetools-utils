import { calculateDelay } from './calculate-delay.js'
import { Status } from '@tshttp/status'

/**
 * Default maximum number of retries
 *
 * See the {@link calculateDelay} function for more details
 */
const DEFAULT_MAX_RETRIES = 3

/**
 * Default delay (in milliseconds) before a retry attempt is made
 *
 * See the {@link calculateDelay} function for more details
 */
const DEFAULT_DELAY_MS = 100

export interface RetryOnConflictParams<T = any> {
  /**
   * Any function that returns a promise
   *
   * This function is expected to be able to throw a {@link CommercetoolsError}
   * with a status code of 409. These errors should **not** be swallowed by the
   * code in this function.
   */
  executeFn: (attemptNo: number) => Promise<T>
  /**
   * The number of milliseconds to wait before retrying a failed request.
   * This will be increased exponentially {@link CommercetoolsApi.calculateDelay}.
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
 * Re-executes a function if a 409 response code is returned from commercetools
 *
 * When you make a request to update a resource in commercetools, you may receive a
 * 409 response code if the resource has been updated since you last fetched it. This
 * function will re-execute the function passed in to {@link RetryOnConflictParams.executeFn}
 * in that scenario.
 *
 * You should retrieve the latest version of the resource before re-executing the function
 * that caused the 409 response in the first place.
 *
 * For example, in order to update a product, you would first need to fetch the latest
 * product (or product projection) and then post the update actions:
 *
 * ```typescript
 * import { retryOnConflict, CommercetoolsApi, Region } from '@gradientedge/commercetools-utils'
 *
 * const api = new CommercetoolsApi({
 *   projectKey: 'your-project-key',
 *   region: Region.EUROPE_GCP,
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   clientScopes: ['manage_products'],
 * })
 *
 * const updatedProduct = await retryOnConflict({
 *   executeFn: async () => {
 *     // Get the latest product projection
 *     const productProjection = await api.getProductProjectionByKey({key: 'dummy-product-id'})
 *
 *     // Attempt to update the product. If this fails with a 409, the function
 *     // will be retried, otherwise the `Product` object will be returned.
 *     return await api.updateProductById({
 *       id: productProjection.id,
 *       data: {
 *         version: productProjection.version,
 *         actions: [
 *           {
 *             action: 'setMetaTitle',
 *             metaTitle: {
 *               en: 'New meta title',
 *             },
 *           },
 *         ],
 *       },
 *     })
 *   },
 *   // The `executeFn` function will be called a maximum of 3 times (first attempt + 2 retries)
 *   maxRetries: 2,
 *   // The delay between for the first retry will be 20ms, increasing exponentially
 *   delayMs: 20,
 * })
 *
 * console.log(updatedProduct)
 *
 * ```
 *
 * By default, the function passed in to {@link RetryOnConflictParams.executeFn} will be
 * retried 3 times, though this can be altered by passing in a different value for the
 * {@link RetryOnConflictParams.maxRetries} parameter.
 *
 * There is by default a 100ms delay after the first unsuccessful attempt, which is then
 * increases exponentially for each subsequent attempt. This delay can be altered by passing
 * in a different value for the {@link RetryOnConflictParams.delayMs} parameter.
 *
 * If the {@link RetryOnConflictParams.jitter} parameter is set to `true`, then a random
 * element is added to the exponential increase in retry time.
 */
export async function retryOnConflict<T = any>(options: RetryOnConflictParams): Promise<T> {
  const maxAttempts = (options?.maxRetries || DEFAULT_MAX_RETRIES) + 1
  const delayMs = options?.delayMs || DEFAULT_DELAY_MS
  const jitter = !!options?.jitter
  let result: T

  for (let attemptCount = 1; attemptCount <= maxAttempts; attemptCount++) {
    if (attemptCount > 1) {
      const delay = calculateDelay(attemptCount - 1, { delayMs, jitter })
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
    try {
      return await options.executeFn(attemptCount)
    } catch (e: any) {
      if (!e.isCommercetoolsError || e.status !== Status.Conflict || attemptCount === maxAttempts) {
        throw e
      }
    }
  }

  return result!
}

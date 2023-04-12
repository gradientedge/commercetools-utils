import { CommercetoolsRetryConfig } from '../api'

/**
 * Calculate how long to delay before running the request.
 * For each retry attempt, we increase the time that we delay for.
 */
export function calculateDelay(retryCount: number, retryConfig?: Omit<CommercetoolsRetryConfig, 'maxRetries'>): number {
  if (!retryConfig || retryCount === 0) {
    return 0
  }
  // `retryCount` will be at least 1 at this point
  const exponentialDelay = retryConfig.delayMs * 2 ** (retryCount - 1)
  if (retryConfig.jitter) {
    // A 'full' jitter calculation usually just calculates the delay value
    // by selecting a random value between zero and the standard exponential
    // delay value (calculated above). This next line increases the exponential
    // delay by a factor that reduces for each further request. This ensures
    // more variance on earlier requests.
    const increasedDelay = exponentialDelay * (1 + 1 / (retryCount + 1))
    return Math.floor(Math.random() * increasedDelay)
  } else {
    // Assuming a `delayMs` of 500, you'd get the following responses for
    // the given `retryCount` value: 1 = 500, 2 = 1000, 3 = 2000, 4 = 4000
    return exponentialDelay
  }
}

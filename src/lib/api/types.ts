import * as https from 'https'
import { CommercetoolsAuthConfig } from '../auth/index.js'

/**
 * Configuration for constructing the {@see CommercetoolsApi} class.
 */
export interface CommercetoolsApiConfig extends CommercetoolsAuthConfig {
  httpsAgent?: https.Agent
  clientScopes: string[]
}

/**
 * Configuration for retrying a request when it fails
 */
export interface CommercetoolsRetryConfig {
  /**
   * The number of milliseconds to wait before retrying a failed request.
   * This will be increased exponentially {@see CommercetoolsApi.calculateDelay}.
   */
  delayMs: number

  /**
   * The maximum number of times that a request will be retried before
   * returning the error caught from the last failure.
   */
  maxRetries: number

  /**
   * If enabled, adds a random element to the exponential increase
   * in retry time. See the following url for more details:
   * https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
   * We utilise the 'full' jitter + plus an additional decaying variance.
   */
  jitter?: boolean
}

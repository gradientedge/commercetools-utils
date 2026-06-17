import * as https from 'https'
import { CommercetoolsAuthConfig } from '../auth/index.js'

/**
 * Configuration for constructing the {@see CommercetoolsApi} class.
 */
export interface CommercetoolsApiConfig extends CommercetoolsAuthConfig {
  httpsAgent?: https.Agent
  clientScopes?: string[]
}

/**
 * Per-HTTP-method retry policy override.
 * When not set, commercetools-aligned defaults apply automatically:
 *   - POST/PATCH/DELETE → only retry on [502, 503, 504]; never on timeout or 500
 *   - All other methods → retry on [500–504] and ECONNABORTED/ETIMEDOUT
 */
export interface MethodRetryPolicy {
  /**
   * HTTP response status codes that trigger a retry for this method.
   * Default when not set:
   *   POST/PATCH/DELETE → [502, 503, 504]  — gateway errors only (commercetools never processed)
   *   all other methods → [500, 501, 502, 503, 504]
   */
  retryableStatusCodes?: number[]
  /**
   * Axios error codes (e.g. 'ECONNABORTED', 'ETIMEDOUT') that trigger a retry.
   * Default when not set:
   *   POST/PATCH/DELETE → []  — never (timeout means commercetools may have already processed it)
   *   all other methods → ['ECONNABORTED', 'ETIMEDOUT']
   * Note: when `!error.request` (request never left the client), retry is always
   * allowed regardless — the server definitely never received the request.
   */
  retryableErrorCodes?: string[]
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

  /**
   * Per-method retry policy overrides. When omitted, commercetools-aligned defaults apply:
   * - POST/PATCH/DELETE: only retry on [502, 503, 504]; never on timeout or 500
   * - All other methods: retry on [500–504] and ECONNABORTED/ETIMEDOUT
   *
   * Example — allow POST retry for inherently idempotent operations (e.g. OAuth2):
   *   methodPolicies: { POST: { retryableErrorCodes: ['ECONNABORTED', 'ETIMEDOUT'] } }
   */
  methodPolicies?: Partial<Record<string, MethodRetryPolicy>>
}

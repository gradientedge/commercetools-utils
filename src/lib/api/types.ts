import { CommercetoolsBaseConfig } from '../types'

/**
 * Configuration for constructing the {@see CommercetoolsApi} class.
 */
export interface CommercetoolsApiConfig extends CommercetoolsBaseConfig {
  maxConcurrency?: number
  retry?: CommercetoolsRetryConfig
}

/**
 * Configuration for retrying a request when it fails
 */
export interface CommercetoolsRetryConfig {
  /**
   * The number of milliseconds to wait before retrying a failed request.
   * This will be increased for each retry, but multiplying the retry attempt
   * number by the `delayMs` value.
   */
  delayMs: number

  /**
   * The maximum number of times that a request will be retried before
   * returning the error caught from the last failure.
   */
  maxRetries: number
}

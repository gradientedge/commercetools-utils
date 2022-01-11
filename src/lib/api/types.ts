import * as https from 'https'
import { CommercetoolsAuthConfig } from '../auth'

/**
 * Configuration for constructing the {@see CommercetoolsApi} class.
 */
export interface CommercetoolsApiConfig extends CommercetoolsAuthConfig {
  retry?: CommercetoolsRetryConfig
  httpsAgent?: https.Agent
}

/**
 * Configuration for retrying a request when it fails
 */
export interface CommercetoolsRetryConfig {
  /**
   * The number of milliseconds to wait before retrying a failed request.
   * This will be increased exponentially {@see CommercetoolsApi.calculateDelay}
   */
  delayMs: number

  /**
   * The maximum number of times that a request will be retried before
   * returning the error caught from the last failure.
   */
  maxRetries: number
}

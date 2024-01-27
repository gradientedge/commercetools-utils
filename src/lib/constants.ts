import { CommercetoolsRetryConfig } from './api/index.js'

/**
 * Prefixed in the `User-Agent` header before the system identifier (if provided)
 */
export const USER_AGENT_PREFIX = '@gradientedge/commercetools-utils'

/**
 * The standard request timeout value (in milliseconds). We pass
 * this to `axios` when making the request to commercetools.
 */
export const DEFAULT_REQUEST_TIMEOUT_MS = 5000

/**
 * The maximum number of items that can be returned in a query
 */
export const MAX_ITEMS_PER_QUERY = 500

/**
 * Sane defaults for retry configuration
 */
export const DEFAULT_RETRY_CONFIG: CommercetoolsRetryConfig = {
  maxRetries: 3,
  delayMs: 50,
  jitter: true,
}

/**
 * List of status codes which are allowed to retry
 */
export const RETRYABLE_STATUS_CODES: number[] = [500, 501, 502, 503, 504]

import { MethodRetryPolicy } from '../api/index.js'

// CT docs: mutations may complete even after a 500. Gateway errors (502/503/504)
// are safe — the LB rejected before forwarding to CT.
const DEFAULT_RETRYABLE_STATUS_CODES = [500, 501, 502, 503, 504]
const DEFAULT_RETRYABLE_ERROR_CODES = ['ECONNABORTED', 'ETIMEDOUT']
const MUTATION_RETRYABLE_STATUS_CODES = [502, 503, 504]
const MUTATION_RETRYABLE_ERROR_CODES: string[] = []
const MUTATION_METHODS = new Set(['POST', 'PATCH', 'DELETE'])

export interface IsRetryableErrorOptions {
  method?: string
  methodPolicies?: Partial<Record<string, MethodRetryPolicy>>
}

/**
 * Determine whether the given error means we should allow the request
 * to be retried (assuming retry config is provided).
 *
 * When `options.method` is provided, CT-aligned per-method defaults apply:
 *   - POST/PATCH/DELETE: only retry on gateway errors (502/503/504); never on
 *     timeout (ECONNABORTED/ETIMEDOUT) or 500, since CT may have already
 *     processed the mutation.
 *   - All other methods: retry on [500–504] and network errors.
 *
 * When `options.method` is omitted, legacy behavior is preserved for
 * backward compatibility with call sites that have not yet been updated.
 */
export function isRetryableError(error: any, options?: IsRetryableErrorOptions): boolean {
  // If the error isn't an axios error, then something serious
  // went wrong. Probably a coding error in this package. We should
  // never really hit this scenario.
  if (!error.isAxiosError) {
    return true
  }
  // If the error code is 'ERR_CANCELED', it means the request was aborted.
  // This can happen if the request was cancelled by the user or due to a timeout.
  // We should not retry in this case.
  if (error.code === 'ERR_CANCELED') {
    return false
  }
  // Request never left the client — the server never received it.
  // Always safe to retry regardless of HTTP method.
  if (!error.request) {
    return true
  }

  const method = options?.method?.toUpperCase()
  const policy = method ? options?.methodPolicies?.[method] : undefined
  const isMutation = method !== undefined && MUTATION_METHODS.has(method)

  if (!error.response) {
    // No method provided → legacy call site: preserve existing behavior (retry on any
    // network error) for backward compatibility with unupdated callers.
    if (method === undefined) return true
    const retryableErrorCodes =
      policy?.retryableErrorCodes ?? (isMutation ? MUTATION_RETRYABLE_ERROR_CODES : DEFAULT_RETRYABLE_ERROR_CODES)
    return error.code != null && retryableErrorCodes.includes(error.code)
  }

  const retryableStatusCodes =
    policy?.retryableStatusCodes ?? (isMutation ? MUTATION_RETRYABLE_STATUS_CODES : DEFAULT_RETRYABLE_STATUS_CODES)
  return retryableStatusCodes.includes(error.response.status)
}

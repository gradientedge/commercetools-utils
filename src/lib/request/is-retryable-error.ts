import { RETRYABLE_STATUS_CODES } from '../constants.js'
import { CommercetoolsError } from '../error/index.js'

/**
 * Determine whether the given error means we should allow the request
 * to be retried (assuming retry config is provided).
 */
export function isRetryableError(error: any): boolean {
  if (error instanceof CommercetoolsError) {

  }
  // If axios makes a request successfully, the `request` property will
  // be defined. Equally, if it received a response, the `response` property
  // will be defined. If either is not defined then we assume there was
  // a serious connectivity issue and allow the request to be retried.
  if (!error.request || !error.response) {
    return true
  }
  // Finally we only allow requests to be retried if the status code
  // returned is in the given list
  return RETRYABLE_STATUS_CODES.includes(error.response.status)
}

import { CommercetoolsError } from '../error/index.js'

/**
 * Transform an unknown error in to a {@see CommercetoolsError}
 * if the error we receive is from axios.
 */
export function transformError(lastError: any, messageOverride?: string): Error | CommercetoolsError {
  if (lastError.isAxiosError) {
    return CommercetoolsError.fromAxiosError(lastError, messageOverride)
  }
  return lastError
}

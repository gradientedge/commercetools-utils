import { CommercetoolsError } from '../error/index.js'

/**
 * Options interface for {@see ensureNonEmptyString}
 */
export interface EnsureNonEmptyStringParams {
  /** string value to be checked */
  value: string
  /** name of property to be checked */
  name: string
}

/**
 * Ensure the string value passed in will not result in an empty value once trimmed.
 *
 * @throws CommercetoolsError
 */
export function ensureNonEmptyString(options: EnsureNonEmptyStringParams): void {
  if (!options.value.trim()) {
    throw new CommercetoolsError(`The string parameter '${options.name}' cannot be empty`)
  }
}

/**
 * Build a string suitable for sending as the `User-Agent` HTTP header.
 * This should contain information that allows commercetools to easily
 * identify the source of the request. The `systemIdentifier` comes from
 * {@see CommercetoolsApiConfig.systemIdentifier} and should be a string
 * that uniquely identifies the application where this package is being
 * used.
 */
import { CommercetoolsError } from '../error'

export function buildUserAgent(systemIdentifier?: string) {
  let userAgent = `@gradientedge/commercetools-utils`
  if (systemIdentifier) {
    userAgent = `${userAgent} (${systemIdentifier})`
  }
  return userAgent
}

/**
 * Format a string for use as a key.
 *
 * Keys may only contain alphanumeric characters, underscores and hyphens
 * and must have a minimum length of 2 characters and maximum length of
 * 256 characters.
 *
 * @param {string} input The string that you want to format as a key
 */
export function formatAsKey(input: string) {
  let output = ''

  if (typeof input !== 'string') {
    throw new CommercetoolsError(`The [input] parameter must be a string`)
  }

  // Trim and make lowercase
  output = input.trim().toLowerCase()
  // Replace any instance of more than one space, with a single space
  output = output.replace(/ {2,}/g, '')
  // Replacing '&' for 'and'
  output = output.replace(/&/g, 'and')
  // Replace spaces for hyphen or underscore
  output = output.replace(/[ _]/g, '-')
  // Remove any non-alphanumeric characters (except for hyphens)
  output = output.replace(/[^0-9a-z-]+/g, '')
  // Replace any instance of more than one hyphen, with a single hyphen
  output = output.replace(/-{2,}/g, '-')
  // Remove any leading hyphen
  if (output.length && output[0] === '-') {
    output = output.slice(1)
  }
  // Remove any trailing hyphen
  if (output.length && output[output.length - 1] === '-') {
    output = output.slice(0, -1)
  }

  if (output.length < 2) {
    throw new CommercetoolsError(`Formatted key did not meet minimum length of 2 characters: ${output}`)
  }
  if (output.length > 256) {
    throw new CommercetoolsError(`Formatted key exceeds the maximum length of 256 characters: ${output}`)
  }

  return output
}

/**
 * Build a string suitable for sending as the `User-Agent` HTTP header.
 * This should contain information that allows commercetools to easily
 * identify the source of the request. The `systemIdentifier` comes from
 * {@see CommercetoolsApiConfig.systemIdentifier} and should be a string
 * that uniquely identifies the application where this package is being
 * used.
 */
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
 */
export function formatAsKey(input: any, options: { spaceIsHyphen: true }) {
  let output = ''

  if (typeof input !== 'string') {
    throw new Error(`Input is not a string`)
  }

  // Trim and make lowercase
  output = input.trim().toLowerCase()
  // Replace any instance of more than one space, with a single space
  output = output.replace(/ +(?= )/g, '')
  // Replacing '&' for 'and'
  output = output.replace(/&/g, 'and')
  // Replace spaces for hyphen or underscore
  output = output.replace(/ /g, options.spaceIsHyphen ? '-' : '_')
  // Remove any non-alphanumeric characters (except for underscores)
  output = output.replace(/[^0-9a-z_]/g, '')

  if (output.length < 2) {
    throw new Error(`Formatted key did not meet minimum length of 2 characters: ${output}`)
  }
  if (output.length > 256) {
    throw new Error(`Formatted key exceeds the maximum length of 256 characters: ${output}`)
  }

  return output
}

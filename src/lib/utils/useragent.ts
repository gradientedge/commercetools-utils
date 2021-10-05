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

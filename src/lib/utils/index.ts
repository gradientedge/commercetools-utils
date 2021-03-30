// The path to the package.json file should be based on the built code, i.e.
// the code that's compiled to the `build` directory. However, we also need
// to cater for when the code is run using `ts-node`, in which case the
// package.json file will be in a different location.
let packageJson
try {
  packageJson = require('../../../package.json')
} catch (e) {
  packageJson = require('../../package.json')
}
const packageName = packageJson?.name.replace('@gradientedge/', '')
const packageVersion = packageJson?.version

/**
 * Build a string suitable for sending as the `User-Agent` HTTP header.
 * This should contain information that allows commercetools to easily
 * identify the source of the request. The `systemIdentifier` comes from
 * {@see CommercetoolsApiConfig.systemIdentifier} and should be a string
 * that uniquely identifies the application where this package is being
 * used.
 */
export function buildUserAgent(systemIdentifier?: string) {
  let userAgent = `${packageName}/${packageVersion}`
  if (systemIdentifier) {
    userAgent = `${userAgent} (${systemIdentifier})`
  }
  return userAgent
}

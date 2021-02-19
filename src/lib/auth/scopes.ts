import { INVALID_SCOPES } from './constants'

/**
 * Take an array of scope strings and form them in to a string
 * that is appropriate for the `scope` parameter in requests to commercetools.
 */
export function scopeArrayToRequestString(scopes: string[], projectKey: string) {
  if (!scopes) {
    return ''
  }
  return scopes.map((scope) => `${scope}:${projectKey}`).join(' ')
}

/**
 * Take the scopes string returned by commercetools and parse it in to an
 * array of scope strings.
 */
export function scopeRequestStringToArray(scopes: string) {
  if (!scopes) {
    return []
  }
  return scopes
    .split(' ')
    .map((scope) => scope.split(':')[0])
    .filter((scope) => !INVALID_SCOPES.includes(scope))
}

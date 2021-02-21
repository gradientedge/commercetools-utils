import { CommercetoolsGrantResponse } from './types'
import { scopeRequestStringToArray } from './scopes'

/**
 * Holds the details of the grant returned from commercetools in response
 * to an authorisation API related request:
 * https://docs.commercetools.com/api/authorization
 */
export class CommercetoolsGrant {
  public accessToken = ''
  public refreshToken?: string
  public expiresIn = 0
  public expiresAt = new Date()
  public scopes: string[] = []

  /**
   * Create a new grant from grant data received back from commercetools.
   */
  constructor(data: CommercetoolsGrantResponse) {
    this.accessToken = data.access_token
    this.expiresIn = data.expires_in
    this.scopes = scopeRequestStringToArray(data.scope)

    // This sets the `expiresAt` property to the calculated Date when the grant is due to expire.
    this.expiresAt = new Date(new Date().getTime() + 1000 * data.expires_in)

    // When a grant is refreshed, we don't get back a new token,
    // so we keep hold of the old one unless one is explicitly provided.
    if ('refresh_token' in data && data.refresh_token) {
      this.refreshToken = data.refresh_token
    }
  }

  /**
   * Calculates whether the grant is due to expire within a given number of
   * seconds. This is useful when deciding if the expiry date/time is close
   * enough to warrant pro-active renewal, rather than waiting for expiry.
   */
  public expiresWithin(refreshIfWithinSecs: number) {
    const cutoff = new Date().getTime() + refreshIfWithinSecs * 1000
    return this.expiresAt.getTime() < cutoff
  }
}

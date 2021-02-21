import { CommercetoolsGrantResponse, CommercetoolsRefreshGrantResponse } from './types'
import { scopeRequestStringToArray } from './scopes'

/**
 * Holds the details of the grant returned from commercetools in response
 * to an authorisation API related request:
 * https://docs.commercetools.com/api/authorization
 */
export class CommercetoolsGrant {
  public accessToken = ''
  public refreshToken = ''
  public expiresIn = 0
  public expiresAt = new Date()
  public scopes: string[] = []

  /**
   * Create a new grant from grant data received back from commercetools.
   */
  constructor(data: CommercetoolsGrantResponse) {
    this.initialise(data)

    // When a grant is refreshed, we don't get back a new token,
    // so we keep hold of the old one unless one is explicitly provided.
    if ('refresh_token' in data) {
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

  /**
   * Updates the grant's details. As can be seen on the {@see CommercetoolsRefreshGrantResponse}
   * type, no `refresh_token` is passed in here.
   */
  public refresh(data: CommercetoolsRefreshGrantResponse) {
    this.initialise(data)
  }

  /**
   * Common functionality for setting the properties of a grant, regardless
   * of whether the data being passed in is from a refresh request or not.
   */
  private initialise(data: CommercetoolsGrantResponse | CommercetoolsRefreshGrantResponse) {
    this.accessToken = data.access_token
    this.expiresIn = data.expires_in
    this.scopes = scopeRequestStringToArray(data.scope)

    // This sets the `expiresAt` property to the calculated Date when the grant is due to expire.
    this.expiresAt = new Date(new Date().getTime() + 1000 * data.expires_in)
  }
}

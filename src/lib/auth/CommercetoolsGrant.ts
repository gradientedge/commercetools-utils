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
   * When this grant came from a call to {@see CommercetoolsAuth.getAnonymousGrant}
   * or {@see CommercetoolsApi.getAnonymousGrant} then the value will be populated
   * with the id of the anonymous customer to which this grant relates.
   */
  public anonymousId?: string

  /**
   * When this grant is generated from a call to {@see CommercetoolsAuth.login}
   * or {@see CommercetoolsApi.login} then this value will be populated with the
   * id of the customer to which this grant relates.
   */
  public customerId?: string

  /**
   * Create a new grant from grant data received back from commercetools.
   */
  constructor(data: CommercetoolsGrantResponse) {
    this.accessToken = data.access_token
    this.expiresIn = data.expires_in
    this.scopes = scopeRequestStringToArray(data.scope)
    this.anonymousId = this.extractKeyFromScope('anonymous_id', data.scope)
    this.customerId = this.extractKeyFromScope('customer_id', data.scope)

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

  /**
   * Given a scope string (as returned from commercetools), this method
   * extracts the value of the associated with the given key. Used for
   * retrieving the anonymous id and customer id from the scope string.
   */
  public extractKeyFromScope(key: string, scope: string): string | undefined {
    if (!scope || !key) {
      return undefined
    }
    const parts = scope?.split(' ')
    if (!Array.isArray(parts) || parts.length === 0) {
      return undefined
    }
    const item = parts.find((part) => part.slice(0, key.length + 1) === `${key}:`)
    if (item) {
      return item.slice(key.length + 1)
    }
    return undefined
  }
}

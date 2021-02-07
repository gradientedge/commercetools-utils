/**
 * Configuration for constructing the CommercetoolsAuth class.
 *
 *
 */
export interface CommercetoolsAuthConfig {
  projectKey: string
  clientId: string
  clientSecret: string
  region: Region
  clientScopes?: string[]
  customerScopes?: string[]
  timeout?: number
  refreshIfWithinSecs?: number
  logger?: {
    debug: (...args: any) => void
    info: (...args: any) => void
    error: (...args: any) => void
  }
}

/**
 * The object structure that we receive back from commercetools
 * on a successful call to get a new token.
 */
export interface CommercetoolsAccessTokenResponse extends CommercetoolsRefreshTokenResponse {
  refresh_token: string
}

export interface CommercetoolsRefreshTokenResponse {
  access_token: string
  expires_in: number
  scope: string
}

/**
 * The structure of an object transformed from the data that we receive back
 * from commercetools when hitting the `/oauth/token` endpoint with the `grant_type`
 * set to {@link GrantType.REFRESH_TOKEN}.
 */
export interface RefreshedAccessToken {
  accessToken: string
  expiresIn: number
  expiresAt: Date
  scopes: string[]
}

/**
 * The structure of an object transformed from the data that we receive back
 * from commercetools when hitting the `/oauth/token` endpoint with the `grant_type`
 * set to {@link GrantType.CLIENT_CREDENTIALS} or {@link GrantType.PASSWORD}.
 */
export interface AccessToken extends RefreshedAccessToken {
  refreshToken: string
}

/**
 * This is the LoginOptions description
 */
export interface LoginOptions {
  /**
   * The customer's username (email address)
   */
  username: string

  /**
   * The customer's password
   */
  password: string

  /**
   * The scopes to which you want to restrict the customer token. Note that
   * these must be a subset of the scopes associated with the client id/secret.
   */
  scopes?: string[]
}

export interface AnonymousTokenOptions {
  /**
   * The scopes of the anonymous customer must be less than or equal to
   * the scopes of the client API key (ideally, less). If you don't specify
   * the scopes using this property, then the code will check for the scopes
   * defined on {@link CommercetoolsAuthConfig.customerScopes}. If scopes
   * aren't defined there either, than an error will be thrown when a call
   * is made to {@link CommercetoolsAuth.getAnonymousToken}
   */
  scopes?: string[]
  /**
   * If you specify this, you need to be sure that the value does not
   * already exist as an anonymous customer id in the commercetools system
   * under your project key. If it does, an error will be thrown when
   * trying to create the access token.
   */
  anonymousId?: string
}

/**
 * Authentication grant types.
 * These are used when populating the 'grant_type' parameter.
 */
export enum GrantType {
  /**
   * Used when either requesting a client access token or an
   * anonymous customer access token:
   * https://docs.commercetools.com/api/authorization#client-credentials-flow
   * https://docs.commercetools.com/api/authorization#tokens-for-anonymous-sessions
   */
  CLIENT_CREDENTIALS = 'client_credentials',
  /**
   * Used when refreshing any existing access token (whether client or customer):
   * https://docs.commercetools.com/api/authorization#refresh-token-flow
   */
  REFRESH_TOKEN = 'refresh_token',
  /**
   * Used when attempting to login a customer:
   * https://docs.commercetools.com/api/authorization#password-flow
   */
  PASSWORD = 'password'
}

/**
 * The commercetools region that your API client id/secret relate to.
 * This is used to determine the authentication endpoint.
 */
export enum Region {
  US_CENTRAL = 'us_central',
  US_EAST = 'us_east',
  EUROPE_WEST = 'europe_west',
  EUROPE_CENTRAL = 'europe_central',
  AUSTRALIA = 'australia'
}

/**
 * The Authentication and API endpoints for a particular region
 */
export interface RegionEndpoints {
  /**
   * The url to the commercetools auth endpoint for the region
   */
  auth: string
  /**
   * The url to the commercetools API endpoint for the region
   */
  api: string
}

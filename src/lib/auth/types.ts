import { CommercetoolsBaseConfig } from '../types.js'
import https from 'https'

/**
 * Configuration for {@see CommercetoolsAuth}
 */
export interface CommercetoolsAuthConfig extends CommercetoolsBaseConfig {
  refreshIfWithinSecs?: number
  customerScopes?: string[]
  clientScopes: string[]
}

/**
 * Configuration for {@see CommercetoolsAuthApi}
 */
export interface CommercetoolsAuthApiConfig extends CommercetoolsBaseConfig {
  clientScopes?: string[] | undefined
  httpsAgent?: https.Agent
}

/**
 * The object structure that we receive back from commercetools
 * on a successful call to get a new grant, or refresh an existing one.
 */
export interface CommercetoolsGrantResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  scope: string
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
   * The scopes to which you want to restrict the customer grant. Note that
   * these must be a subset of the scopes associated with the client grant.
   */
  scopes?: string[]

  /**
   * The key of the store to login to
   */
  storeKey?: string
}

/**
 * RevokeTokenOptions
 */
export interface RevokeTokenOptions {
  /**
   * The type of token to be revoked
   */
  tokenType: 'access_token' | 'refresh_token'

  /**
   * The value of the token to be revoked
   */
  tokenValue: string
}

/**
 * LogoutOptions
 */
export interface LogoutOptions {
  /**
   * The customer's access token
   */
  accessToken: string

  /**
   * The customer's refresh token
   */
  refreshToken: string
}

export interface AnonymousGrantOptions {
  /**
   * The scopes of the anonymous customer must be less than or equal to
   * the scopes of the client API key (ideally, less). If you don't specify
   * the scopes using this property, then the code will check for the scopes
   * defined on {@link CommercetoolsAuthConfig.customerScopes}. If scopes
   * aren't defined there either, than an error will be thrown when a call
   * is made to {@link CommercetoolsAuth.getAnonymousGrant}
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
   * Used when either requesting a client grant or an
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
  PASSWORD = 'password',
}

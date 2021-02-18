import fetch, { RequestInit, Response } from 'node-fetch'
import {
  AnonymousTokenOptions,
  CommercetoolsAccessTokenResponse,
  CommercetoolsAuthApiConfig,
  CommercetoolsAuthConfig,
  CommercetoolsRefreshTokenResponse,
  GrantType,
  LoginOptions,
  RegionEndpoints
} from './types'
import { CommercetoolsAuthError } from './CommercetoolsAuthError'
import { CommercetoolsGrant } from './CommercetoolsGrant'
import { scopeArrayToRequestString } from './scopes'
import { REGION_URLS } from './constants'
import { basic } from './utils'

/**
 * CommercetoolsBaseAuth
 *
 * Authentication functionality required for the generating and
 * refreshing of access tokens for both client and customers.
 */

/*
 * When the user requests the access token through `getAccessToken`,
 * if a token already exists, we check to see if the token expires
 * within a certain number of seconds, and if it does, we refresh the
 * token. This constant represents the aforementioned number of seconds.
 *
 */

const configDefaults = {
  refreshIfWithinSecs: 1800,
  timeout: 5,
  fetch
}

interface Config extends CommercetoolsAuthConfig {
  clientScopes: string[]
  customerScopes?: string[]
  refreshIfWithinSecs: number
  timeout: number
  fetch: any
}

/**
 * Provides an easy to use set of methods for communicating with the commercetools
 * HTTP Authorization API: https://docs.commercetools.com/api/authorization
 *
 * To create an instance of the class and get an access token:
 * ```typescript
 * import { Region, CommercetoolsAuth } from '@gradientedge/commercetools-utils'
 *
 * async function example() {
 *   const auth = new CommercetoolsAuth({
 *     projectKey: 'your-project-key',
 *     clientId: 'your-client-id',
 *     clientSecret: 'your-client-secret',
 *     region: Region.EUROPE_WEST
 *   })
 *
 *   const grant = await auth.getClientGrant()
 *
 *   console.log('Grant:', grant)
 * }
 *
 * example()
 * ```
 *
 * An instance of this class is designed to be stored as a global, long-lived
 * object. If you're using a serverless environment such as AWS Lambda or an
 * Azure Function App, you can safely instantiate this class outside of your
 * function handler and have it exist for as long the serverless environment
 * allows.
 */
export class CommercetoolsAuthApi {
  /**
   * The internal configuration. This is a combination of the `CommercetoolsAuthConfig`
   * type passed in to the constructor and the default values specified in the
   * `configDefaults` object.
   */
  private readonly config: Config

  /**
   * Whenever we either refresh the client access token, or request a new one,
   * we don't want to allow any other requests to be initiated until that
   * request has completed. This promise is used to determine whether incoming
   * requests need to wait on an existing client access token request to complete
   * before they can start to be processed.
   */
  private tokenPromise: Promise<any> = Promise.resolve()

  /**
   * The Auth and API endpoints driven by the user's setting of {@link CommercetoolsAuthConfig.region}
   */
  private endpoints: RegionEndpoints

  constructor(config: CommercetoolsAuthApiConfig) {
    this.config = { ...configDefaults, ...config }
    this.endpoints = REGION_URLS[this.config.region]

    if (!this.config.clientScopes.length) {
      throw new CommercetoolsAuthError('`config.clientScopes` must contain at least one scope')
    }
  }

  /**
   * Refresh an access token given a refresh token.
   * This method must be passed a refresh token parameter, and therefore
   * can be used to refresh either a client access token or a customer
   * access token.
   */
  public async refreshGrant(refreshToken: string): Promise<CommercetoolsRefreshTokenResponse> {
    return await this.post('/token', {
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: refreshToken
    })
  }

  /**
   * Get a new token
   *
   * Requests a new token from the remote authorisation server.
   * Does not check on the expiry time of the existing token,
   * and does not attempt to use any existing refresh token.
   */
  public async getClientGrant(): Promise<CommercetoolsAccessTokenResponse> {
    return this.post('/token', {
      grant_type: GrantType.CLIENT_CREDENTIALS,
      scope: scopeArrayToRequestString(this.config.clientScopes, this.config.projectKey)
    })
  }

  /**
   * Login the customer using the given options.
   *
   * If the {@link LoginOptions.scopes} property isn't set on the `options`
   * parameter then we'll use the scopes set on {@link CommercetoolsAuthConfig.customerScopes}.
   * If this doesn't contain any values either, then this method will throw
   * an error due to the security risk of the customer having an access token
   * with the same privileges as the client API key.
   *
   * Example login code:
   * ```typescript
   * import { Region, CommercetoolsAuth } from '@gradientedge/commercetools-utils'
   *
   * async function example() {
   *   const auth = new CommercetoolsAuth({
   *     projectKey: 'your-project-key',
   *     clientId: 'your-client-id',
   *     clientSecret: 'your-client-secret',
   *     region: Region.EUROPE_WEST
   *   })
   *
   *   const accessToken = await auth.login({
   *     username: 'test@gradientedge.com',
   *     password: 'testing123'
   *   })
   *
   *   console.log('Customer access token:', accessToken)
   * }
   *
   * example()
   * ```
   *
   * Note that there is no need to call {@link getClientGrant} in order to
   * generate a client access token. The class internally requests one if it
   * doesn't have a cached local token.
   */
  public async login(options: LoginOptions): Promise<CommercetoolsAccessTokenResponse> {
    return this.post(`/${this.config.projectKey}/customers/token`, {
      username: options.username,
      password: options.password,
      grant_type: GrantType.PASSWORD,
      scope: scopeArrayToRequestString(options.scopes, this.config.projectKey)
    })
  }

  /**
   * Get an access token for an anonymous customer.
   *
   * If you pass a value to the {@link AnonymousTokenOptions.anonymousId}
   * `options` parameter property then this must not exist within the commercetools
   * system for your project key, otherwise an error will be thrown. Typically
   * this property would be left undefined and commercetools will then create
   * a unique id for the anonymous user automatically.
   *
   * Example code to generate an anonymous customer token:
   * ```typescript
   * import { Region, CommercetoolsAuth } from '@gradientedge/commercetools-utils'
   *
   * async function example() {
   *   const auth = new CommercetoolsAuth({
   *     projectKey: 'your-project-key',
   *     clientId: 'your-client-id',
   *     clientSecret: 'your-client-secret',
   *     region: Region.EUROPE_WEST
   *   })
   *
   *   const accessToken = await auth.getAnonymousToken()
   *
   *   console.log('Anonymous customer access token:', accessToken)
   * }
   *
   * example()
   * ```
   */
  public async getAnonymousGrant(
    options?: AnonymousTokenOptions
  ): Promise<CommercetoolsAccessTokenResponse> {
    const anonymousId = options?.anonymousId

    const postOptions: Record<string, any> = {
      grant_type: GrantType.CLIENT_CREDENTIALS,
      scope: scopeArrayToRequestString(options?.scopes, this.config.projectKey)
    }

    if (anonymousId) {
      postOptions.anonymous_id = anonymousId
    }

    return this.post(`/${this.config.projectKey}/anonymous/token`, postOptions)
  }

  /**
   * Construct and send a request to the commercetools auth endpoint.
   *
   * Note that for all calls to the commercetools auth server, we send a
   * POST request with a 'Basic' Authorization header.
   */
  private async post(path: string, body: any): Promise<CommercetoolsAccessTokenResponse> {
    let encodedBody = body
    if (typeof encodedBody === 'object') {
      encodedBody = new URLSearchParams(body).toString()
    }
    const options: RequestInit = {
      method: 'post',
      body: encodedBody,
      headers: {
        Authorization: `Basic ${basic(this.config.clientId, this.config.clientSecret)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const url = `${this.endpoints.auth}/oauth${path}`
    try {
      return await this.fetch(url, options)
    } catch (e) {
      throw new CommercetoolsAuthError(e)
    }
  }

  /**
   * Make a request using `fetch`. If `fetch` throws an error then we convert
   * the error in to a new error with as many request/response details as possible.
   *
   * We also consider any status code equal to or above 400 to be an error.
   */
  private async fetch(url: string, options: RequestInit) {
    let response

    try {
      response = await this.config.fetch(url, options)
    } catch (e) {
      await this.throwResponseError(url, options, response, e)
    }

    if (response.status >= 400) {
      await this.throwResponseError(url, options, response)
    }

    return response.json()
  }

  private async throwResponseError(
    url: string,
    options: RequestInit,
    response: Response,
    error?: Error
  ) {
    let bodyJson
    let bodyText
    try {
      bodyText = await response.text()
      bodyJson = await response.json()
    } catch (e) {}
    throw new CommercetoolsAuthError(`Response error POSTing to ${url}`, {
      request: {
        url,
        options
      },
      response: {
        status: response.status,
        headers: response.headers,
        bodyText,
        bodyJson,
        error
      }
    })
  }
}

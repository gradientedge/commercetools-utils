import axios, { AxiosRequestConfig } from 'axios'
import {
  AccessToken,
  AnonymousTokenOptions,
  CommercetoolsAuthConfig,
  CommercetoolsAccessTokenResponse,
  RegionEndpoints,
  GrantType,
  LoginOptions,
  RefreshedAccessToken,
  CommercetoolsRefreshTokenResponse
} from './types'
import { CommercetoolsAuthError } from './CommercetoolsAuthError'
import { INVALID_SCOPES, REGION_URLS } from './constants'

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
  timeout: 5
}

interface Config extends CommercetoolsAuthConfig {
  clientScopes?: string[]
  customerScopes?: string[]
  refreshIfWithinSecs: number
  timeout: number
}

/**
 * Provides an easy to use API for obtaining an access token for use with the commercetools HTTP API:
 * https://docs.commercetools.com/api/
 *
 * To create an instance of the class and get an access token:
 * ```typescript
 * import { Region, CommercetoolsAuth } from '@gradientedge/commercetools-sdk'
 *
 * async function example() {
 *   const auth = new CommercetoolsAuth({
 *     projectKey: 'your-project-key',
 *     clientId: 'your-client-id',
 *     clientSecret: 'your-client-secret',
 *     region: Region.EUROPE_WEST
 *   })
 *
 *   const accessToken = await auth.getClientAccessToken()
 *
 *   console.log('Access token:', accessToken)
 * }
 *
 * example()
 * ```
 *
 * An instance of this class is designed to be stored as a global, long-lived
 * object. If you are using a serverless environment such as AWS Lambda or an
 * Azure Function App, you can safely instantiate this class outside of your
 * function handler and have it exist for as long the serverless environment
 * allows.
 */
export class CommercetoolsAuth {
  /**
   * The internal configuration. This is a combination of the `CommercetoolsAuthConfig`
   * type passed in to the constructor and the default values specified in the
   * `configDefaults` object.
   */
  private readonly config: Config

  /**
   * This holds the client access token, once one has been generated.
   */
  private clientAccessToken?: AccessToken

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

  constructor(config: CommercetoolsAuthConfig) {
    this.config = { ...configDefaults, ...config }
    this.endpoints = REGION_URLS[this.config.region]
  }

  /**
   * Get a client access token
   *
   * If we don't already have a client access token stored locally, then
   * we make a call to commercetools to generate one. Once we have a token,
   * we store it locally and then return that cached version up until it needs
   * to be renewed.
   */
  public async getClientAccessToken(): Promise<AccessToken> {
    const timeInSeconds = new Date().getTime() / 1000

    await this.tokenPromise

    if (this.clientAccessToken) {
      if (
        timeInSeconds + this.config.refreshIfWithinSecs <
        this.clientAccessToken.expiresAt.getTime()
      ) {
        return this.clientAccessToken
      }

      try {
        this.tokenPromise = this.refreshClientAccessToken()
        await this.tokenPromise
        return this.clientAccessToken
      } catch (e) {
        // Log that there was an error refreshing
      }
    }

    this.tokenPromise = this.getNewClientAccessToken()
    return this.tokenPromise
  }

  /**
   * Refresh the client access token
   *
   * This method should only be called when we specifically want to force
   * the fetching of a new token using our current refresh token, in other
   * words, when the {@link CommercetoolsAuth.getClientAccessToken} method
   * determines that the current token is either expired or very close to
   * expiry.
   */
  private async refreshClientAccessToken(): Promise<RefreshedAccessToken> {
    if (!this.clientAccessToken) {
      throw new Error('No current access token to refresh')
    }

    const data = await this.refreshAccessToken(this.clientAccessToken.refreshToken)

    this.clientAccessToken = {
      ...this.clientAccessToken,
      ...data
    }

    return this.clientAccessToken
  }

  /**
   * Refresh the customer access token given a refresh token
   */
  public async refreshCustomerAccessToken(refreshToken: string): Promise<RefreshedAccessToken> {
    return this.refreshAccessToken(refreshToken)
  }

  /**
   * Refresh an access token given a refresh token.
   * This method must be passed a refresh token parameter, and therefore
   * can be used to refresh either a client access token or a customer
   * access token.
   */
  private async refreshAccessToken(refreshToken: string): Promise<RefreshedAccessToken> {
    const data = await this.post('/oauth/token', {
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: refreshToken
    })

    return this.responseToAccessToken(data)
  }

  /**
   * Get a new token
   *
   * Requests a new token from the remote authorisation server.
   * Does not check on the expiry time of the existing token,
   * and does not attempt to use any existing refresh token.
   *
   * @returns {Promise<{expiresIn: null, accessToken: string, refreshToken: (string|null)}>}
   */
  private async getNewClientAccessToken(): Promise<AccessToken> {
    const data = await this.post('/oauth/token', {
      grant_type: GrantType.CLIENT_CREDENTIALS,
      scope: this.scopesToRequestString(this.config.clientScopes)
    })

    this.clientAccessToken = this.responseToAccessToken(data)

    return this.clientAccessToken
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
   * import { Region, CommercetoolsAuth } from '@gradientedge/commercetools-sdk'
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
   * Note that there is no need to call {@link getClientAccessToken} in order to
   * generate a client access token. The class internally requests one if it
   * doesn't have a cached local token.
   */
  public async login(options: LoginOptions): Promise<AccessToken> {
    await this.getClientAccessToken()
    const scopes = options.scopes || this.config.customerScopes

    if (!scopes) {
      throw new CommercetoolsAuthError(
        'Customer scopes must be set on either the `options` ' +
          'parameter of this `login` method, or on the `customerScopes` ' +
          'property of the `CommercetoolsAuth` constructor'
      )
    }

    const data = await this.post('/customers/token', {
      username: options.username,
      password: options.password,
      grant_type: GrantType.PASSWORD,
      scope: this.scopesToRequestString(scopes)
    })

    return this.responseToAccessToken(data)
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
   * import { Region, CommercetoolsAuth } from '@gradientedge/commercetools-sdk'
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
  public async getAnonymousToken(options?: AnonymousTokenOptions): Promise<AccessToken> {
    await this.getClientAccessToken()

    const opts = {
      scopes: this.config.customerScopes,
      anonymousId: undefined,
      ...options
    }

    const data = await this.post(`/${this.config.projectKey}/anonymous/token`, {
      grant_type: GrantType.CLIENT_CREDENTIALS,
      scope: opts.scopes,
      anonymous_id: opts.anonymousId
    })

    return this.responseToAccessToken(data)
  }

  /**
   * Construct and send a request to the commercetools auth endpoint.
   *
   * Note that for all calls to the commercetools auth server, we send a
   * POST request with a 'Basic' Authorization header.
   */
  private async post(path: string, data: any): Promise<CommercetoolsAccessTokenResponse> {
    const options: AxiosRequestConfig = {
      method: 'post',
      data,
      headers: {
        Authorization: `Basic ${this.getBasicAuthToken()}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    if (typeof options.data === 'object') {
      options.data = new URLSearchParams(options.data).toString()
    }

    try {
      const response = await this.fetch(this.endpoints.auth + path, options)
      return response.data
    } catch (e) {
      throw new CommercetoolsAuthError(e)
    }
  }

  /**
   * Make a request using Axios. This method primarily exists as a convenience
   * for integration testing, so that we don't need to mock the axios package.
   */
  private fetch(url: string, options: AxiosRequestConfig) {
    return axios(url, options)
  }

  /**
   * Generate a basic auth token for use in the Authorization HTTP header:
   * https://tools.ietf.org/html/rfc7617#section-2
   */
  private getBasicAuthToken(): string {
    return Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')
  }

  /**
   * Take an array of scope strings and form them in to a string
   * that is appropriate for the `scope` parameter in requests to commercetools.
   */
  private scopesToRequestString(scopes?: string[]) {
    if (!scopes) {
      return ''
    }
    return scopes.map((scope) => `${scope}:${this.config.projectKey}`).join(' ')
  }

  /**
   * Take the scopes string returned by commercetools and parse it in to an
   * array of scope strings.
   */
  private scopesStringToArray(scopes: string) {
    return scopes
      .split(' ')
      .map((scope) => scope.split(':')[0])
      .filter((scope) => !INVALID_SCOPES.includes(scope))
  }

  /**
   * Takes a commercetools response and converts it to an {@link AccessToken}
   * This should be used to convert to an access token when the `refresh_token`
   * property is expected to be present in the response.
   */
  private responseToAccessToken(data: CommercetoolsAccessTokenResponse): AccessToken {
    return {
      refreshToken: data.refresh_token,
      ...this.responseToRefreshToken(data)
    }
  }

  /**
   * Takes a commercetools response and converts it to an {@link RefreshedAccessToken}
   * The response is NOT expected to have a `refresh_token` property within it.
   */
  private responseToRefreshToken(data: CommercetoolsRefreshTokenResponse): RefreshedAccessToken {
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      expiresAt: new Date(new Date().getTime() + 1000 * data.expires_in),
      scopes: this.scopesStringToArray(data.scope)
    }
  }
}

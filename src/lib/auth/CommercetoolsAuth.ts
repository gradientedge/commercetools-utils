import axios, { AxiosRequestConfig } from 'axios'
import {
  AnonymousTokenOptions,
  CommercetoolsAccessTokenResponse,
  CommercetoolsAuthConfig,
  CommercetoolsRefreshTokenResponse,
  GrantType,
  LoginOptions,
  RegionEndpoints
} from './types'
import { CommercetoolsAuthError } from './CommercetoolsAuthError'
import { scopeArrayToRequestString } from './scopes'
import { Grant } from './Grant'
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
 *   const grant = await auth.getClientGrant()
 *
 *   console.log('Grant:', grant)
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
  private grant?: Grant

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
  public async getClientGrant(): Promise<Grant> {
    await this.tokenPromise

    if (this.grant) {
      if (!this.grant.expiresWithin(this.config.refreshIfWithinSecs)) {
        return this.grant
      }

      try {
        this.tokenPromise = this.refreshClientGrant()
        await this.tokenPromise
        return this.grant
      } catch (e) {
        // Log that there was an error refreshing
      }
    }

    this.tokenPromise = this.getNewClientGrant()
    return this.tokenPromise
  }

  /**
   * Refresh the client access token
   *
   * This method should only be called when we specifically want to force
   * the fetching of a new token using our current refresh token, in other
   * words, when the {@link CommercetoolsAuth.getClientGrant} method
   * determines that the current token is either expired or very close to
   * expiry.
   */
  private async refreshClientGrant(): Promise<Grant> {
    if (!this.grant) {
      throw new Error('No current access token to refresh')
    }

    const data = await this.refreshGrant(this.grant.refreshToken)

    this.grant.refresh(data)

    return this.grant
  }

  /**
   * Refresh the customer access token given a refresh token
   */
  public async refreshCustomerGrant(refreshToken: string): Promise<Grant> {
    const data = await this.refreshGrant(refreshToken)
    return new Grant({ ...data, refresh_token: refreshToken })
  }

  /**
   * Refresh an access token given a refresh token.
   * This method must be passed a refresh token parameter, and therefore
   * can be used to refresh either a client access token or a customer
   * access token.
   */
  private async refreshGrant(refreshToken: string): Promise<CommercetoolsRefreshTokenResponse> {
    return await this.post('/oauth/token', {
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
  private async getNewClientGrant(): Promise<Grant> {
    const data = await this.post('/oauth/token', {
      grant_type: GrantType.CLIENT_CREDENTIALS,
      scope: scopeArrayToRequestString(this.config.clientScopes, this.config.projectKey)
    })

    this.grant = new Grant(data)

    return this.grant
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
   * Note that there is no need to call {@link getClientGrant} in order to
   * generate a client access token. The class internally requests one if it
   * doesn't have a cached local token.
   */
  public async login(options: LoginOptions): Promise<Grant> {
    await this.getClientGrant()
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
      scope: scopeArrayToRequestString(scopes, this.config.projectKey)
    })

    return new Grant(data)
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
  public async getAnonymousGrant(options?: AnonymousTokenOptions): Promise<Grant> {
    await this.getClientGrant()

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

    return new Grant(data)
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
        Authorization: `Basic ${basic(this.config.clientId, this.config.clientSecret)}`,
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
}

import {
  CommercetoolsAuthApiConfig,
  CommercetoolsGrantResponse,
  GrantType,
  LoginOptions,
  LogoutOptions,
  RevokeTokenOptions,
} from './types'
import { CommercetoolsError, CommercetoolsRequest } from '../'
import { scopeArrayToRequestString } from './scopes'
import { REGION_URLS } from './constants'
import { base64EncodeForBasicAuth } from './utils'
import { RegionEndpoints, RequestExecutor } from '../types'
import { getRequestExecutor } from '../request/request-executor'

/**
 * Provides an easy to use set of methods for communicating with the commercetools
 * HTTP Authorization API
 */
export class CommercetoolsAuthApi {
  /**
   * The internal configuration. This is a combination of the `CommercetoolsAuthConfig`
   * type passed in to the constructor and the default values specified in the
   * `configDefaults` object.
   */
  public readonly config: CommercetoolsAuthApiConfig

  /**
   * The Auth and API endpoints driven by the user's setting of {@link CommercetoolsAuthApiConfig.region}
   * https://docs.commercetools.com/api/general-concepts#regions
   */
  public readonly endpoints: RegionEndpoints

  /**
   * The request executor that's responsible for making the request to commercetools
   */
  private readonly requestExecutor: RequestExecutor

  constructor(config: CommercetoolsAuthApiConfig) {
    this.config = config
    this.endpoints = REGION_URLS[this.config.region]
    this.requestExecutor = getRequestExecutor({
      timeoutMs: config.timeoutMs,
      httpsAgent: config.httpsAgent,
      systemIdentifier: config.systemIdentifier,
    })
  }

  /**
   * Get a new client grant:
   * https://docs.commercetools.com/api/authorization#client-credentials-flow
   */
  public async getClientGrant(scopes: string[]): Promise<CommercetoolsGrantResponse> {
    return this.post('/token', {
      grant_type: GrantType.CLIENT_CREDENTIALS,
      scope: scopeArrayToRequestString(scopes, this.config.projectKey),
    })
  }

  /**
   * Refresh a customer or client grant given a refresh token:
   * https://docs.commercetools.com/api/authorization#refresh-token-flow
   */
  public async refreshGrant(refreshToken: string): Promise<CommercetoolsGrantResponse> {
    return await this.post('/token', {
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: refreshToken,
    })
  }

  /**
   * Login the customer using the given options:
   * https://docs.commercetools.com/api/authorization#password-flow
   */
  public async login(options: LoginOptions & { scopes: string[] }): Promise<CommercetoolsGrantResponse> {
    return this.post(`/${this.config.projectKey}${this.applyStore('/customers/token', options.storeKey)}`, {
      username: options.username,
      password: options.password,
      grant_type: GrantType.PASSWORD,
      scope: scopeArrayToRequestString(options.scopes, this.config.projectKey),
    })
  }

  /**
   * Revoke a refresh or access token:
   * https://docs.commercetools.com/api/authorization#revoking-tokens
   *
   * If you're logging out a customer, you will likely want to call this method twice;
   * once with the access token and once with the refresh token (you can call these in parallel).
   */
  public async revokeToken(options: RevokeTokenOptions): Promise<void> {
    await this.post('/token/revoke', {
      token: options.tokenValue,
      token_type_hint: options.tokenType,
    })
  }

  /**
   * Log the customer out
   *
   * This is a convenience mechanism which makes 2 calls to the `revokeToken` method under
   * the hood (in parallel). One with the access token and one with the refresh token.
   */
  public async logout(options: LogoutOptions): Promise<void> {
    const settlements = await Promise.allSettled([
      this.revokeToken({ tokenType: 'access_token', tokenValue: options.accessToken }),
      this.revokeToken({ tokenType: 'refresh_token', tokenValue: options.refreshToken }),
    ])
    const errors = settlements.reduce((errors: any[], settlement) => {
      if (settlement.status === 'rejected') {
        errors.push(settlement.reason)
      }
      return errors
    }, [])
    if (errors.length) {
      throw new CommercetoolsError(`Logout failed in one or more calls to the token revocation endpoint`, errors)
    }
  }

  /**
   * Get a grant an anonymous customer:
   * https://docs.commercetools.com/api/authorization#tokens-for-anonymous-sessions
   */
  public async getAnonymousGrant(options?: {
    anonymousId?: string
    scopes: string[]
  }): Promise<CommercetoolsGrantResponse> {
    const postOptions: Record<string, any> = {
      grant_type: GrantType.CLIENT_CREDENTIALS,
    }
    if (options?.scopes?.length) {
      postOptions.scope = scopeArrayToRequestString(options.scopes, this.config.projectKey)
    }
    if (options?.anonymousId) {
      postOptions.anonymous_id = options.anonymousId
    }
    return this.post(`/${this.config.projectKey}/anonymous/token`, postOptions)
  }

  /**
   * Construct and send a request to the commercetools auth endpoint.
   */
  public async post(path: string, body: Record<string, any>): Promise<CommercetoolsGrantResponse> {
    return await this.requestExecutor(this.getRequestOptions({ path, body }))
  }

  /**
   * Generate request options. These are then fed in to axios when
   * making the request to commercetools.
   */
  getRequestOptions(options: {
    path: string
    correlationId?: string | undefined
    body: Record<string, any>
  }): CommercetoolsRequest {
    const url = `${this.endpoints.auth}/oauth${options.path}`
    let data: any | undefined

    const headers: Record<string, string> = {
      Authorization: `Basic ${base64EncodeForBasicAuth(this.config.clientId, this.config.clientSecret)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    if (options.correlationId && options.correlationId !== '') {
      headers['X-Correlation-ID'] = options.correlationId
      delete options.correlationId
    }

    if (options.body) {
      data = new URLSearchParams(options.body).toString()
    }

    return {
      method: 'POST',
      data,
      url,
      headers,
    }
  }

  /**
   * Applies the store key to a given path
   */
  applyStore(path: string, storeKey: string | undefined | null): string {
    if (typeof storeKey === 'string' && storeKey !== '') {
      return `/in-store/key=${storeKey}${path}`
    } else if (this.config.storeKey) {
      return `/in-store/key=${this.config.storeKey}${path}`
    }
    return path
  }
}

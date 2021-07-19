import { CommercetoolsAuthApiConfig, CommercetoolsGrantResponse, GrantType } from './types'
import { CommercetoolsError } from '../'
import { scopeArrayToRequestString } from './scopes'
import { REGION_URLS } from './constants'
import { base64EncodeForBasicAuth } from './utils'
import { RegionEndpoints } from '../types'
import axios, { Method } from 'axios'
import { DEFAULT_REQUEST_TIMEOUT_MS } from '../constants'
import { buildUserAgent } from '../utils'

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
  private readonly config: CommercetoolsAuthApiConfig

  /**
   * The Auth and API endpoints driven by the user's setting of {@link CommercetoolsAuthApiConfig.region}
   * https://docs.commercetools.com/api/general-concepts#regions
   */
  private endpoints: RegionEndpoints

  /**
   * The string that's sent over in the `User-Agent` header
   * when a request is made to commercetools.
   */
  private readonly userAgent: string

  constructor(config: CommercetoolsAuthApiConfig) {
    this.config = config
    this.endpoints = REGION_URLS[this.config.region]
    this.userAgent = buildUserAgent(this.config.systemIdentifier)
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
  public async login(options: any): Promise<CommercetoolsGrantResponse> {
    return this.post(`/${this.config.projectKey}${this.applyStore('/customers/token', options.storeKey)}`, {
      username: options.username,
      password: options.password,
      grant_type: GrantType.PASSWORD,
      scope: scopeArrayToRequestString(options.scopes, this.config.projectKey),
    })
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
    const options = {
      url: `${this.endpoints.auth}/oauth${path}`,
      method: 'POST' as Method,
      data: new URLSearchParams(body).toString(),
    }
    const headers: any = {
      Authorization: `Basic ${base64EncodeForBasicAuth(this.config.clientId, this.config.clientSecret)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    if (process?.release?.name) {
      headers['User-Agent'] = this.userAgent
    }
    try {
      const response = await axios({
        ...options,
        headers,
        timeout: this.config.timeoutMs || DEFAULT_REQUEST_TIMEOUT_MS,
      })
      return response.data
    } catch (error) {
      if (error.isAxiosError) {
        throw CommercetoolsError.fromAxiosError(error)
      }
      throw error
    }
  }

  /**
   * Applies the store key to a given path
   */
  applyStore(path: string, storeKey: string | undefined | null) {
    if (typeof storeKey === 'string' && storeKey !== '') {
      return `/in-store/key=${storeKey}${path}`
    } else if (this.config.storeKey) {
      return `/in-store/key=${this.config.storeKey}${path}`
    }
    return path
  }
}

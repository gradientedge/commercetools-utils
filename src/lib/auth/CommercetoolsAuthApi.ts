import {
  CommercetoolsAuthApiConfig,
  CommercetoolsGrantResponse,
  CommercetoolsRefreshGrantResponse,
  GrantType
} from './types'
import { CommercetoolsError } from '../'
import { scopeArrayToRequestString } from './scopes'
import { REGION_URLS } from './constants'
import { base64EncodeForBasicAuth } from './utils'
import { RegionEndpoints } from '../types'
import axios, { Method } from 'axios'
import { DEFAULT_REQUEST_TIMEOUT_MS } from '../constants'

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

  constructor(config: CommercetoolsAuthApiConfig) {
    this.config = config
    this.endpoints = REGION_URLS[this.config.region]
  }

  /**
   * Get a new client grant:
   * https://docs.commercetools.com/api/authorization#client-credentials-flow
   */
  public async getClientGrant(scopes: string[]): Promise<CommercetoolsGrantResponse> {
    return this.post('/token', {
      grant_type: GrantType.CLIENT_CREDENTIALS,
      scope: scopeArrayToRequestString(scopes, this.config.projectKey)
    })
  }

  /**
   * Refresh a customer or client grant given a refresh token:
   * https://docs.commercetools.com/api/authorization#refresh-token-flow
   */
  public async refreshGrant(refreshToken: string): Promise<CommercetoolsRefreshGrantResponse> {
    return await this.post('/token', {
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: refreshToken
    })
  }

  /**
   * Login the customer using the given options:
   * https://docs.commercetools.com/api/authorization#password-flow
   */
  public async login(options: any): Promise<CommercetoolsGrantResponse> {
    return this.post(`/${this.config.projectKey}/customers/token`, {
      username: options.username,
      password: options.password,
      grant_type: GrantType.PASSWORD,
      scope: scopeArrayToRequestString(options.scopes, this.config.projectKey)
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
      grant_type: GrantType.CLIENT_CREDENTIALS
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
      data: new URLSearchParams(body).toString()
    }
    try {
      const response = await axios({
        ...options,
        headers: {
          Authorization: `Basic ${base64EncodeForBasicAuth(this.config.clientId, this.config.clientSecret)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: this.config.timeoutMs || DEFAULT_REQUEST_TIMEOUT_MS
      })
      return response.data
    } catch (error) {
      if (error.isAxiosError) {
        throw CommercetoolsError.fromAxiosError(error)
      }
      throw error
    }
  }
}

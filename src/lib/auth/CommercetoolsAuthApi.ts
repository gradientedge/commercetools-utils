import {
  CommercetoolsAuthApiConfig,
  CommercetoolsGrantResponse,
  CommercetoolsRefreshGrantResponse,
  GrantType
} from './types'
import { CommercetoolsAuthError } from './CommercetoolsAuthError'
import { scopeArrayToRequestString } from './scopes'
import { REGION_URLS } from './constants'
import { basic } from './utils'
import { RegionEndpoints } from '../types'
import axios, { Method } from 'axios'

/**
 * This interface used for holding the internal config of {@see CommercetoolsAuthApi}.
 * It's only purpose currently is to make the {@see Config.timeout} property mandatory
 * after extending {@see CommercetoolsAuthApiConfig} where that property is optional.
 * A default value for {@see Config.timeout} is defined on {@see configDefaults}.
 */
interface Config extends CommercetoolsAuthApiConfig {
  timeout: number
}

/**
 * Default values for `timeout`, required by the {@see Config}
 * interface used in {@see CommercetoolsAuthApi.constructor}.
 */
const configDefaults = {
  timeout: 5
}

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
  private readonly config: Config

  /**
   * The Auth and API endpoints driven by the user's setting of {@link CommercetoolsAuthApiConfig.region}
   * https://docs.commercetools.com/api/general-concepts#regions
   */
  private endpoints: RegionEndpoints

  constructor(config: CommercetoolsAuthApiConfig) {
    this.config = { ...configDefaults, ...config }
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
          Authorization: `Basic ${basic(this.config.clientId, this.config.clientSecret)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      return response.data
    } catch (e) {
      const error: any = {
        message: e.message,
        request: options
      }
      if (e.isAxiosError) {
        error.response = {
          code: e.code,
          data: e.response?.data
        }
      }
      throw new CommercetoolsAuthError(`Error in request to: ${options.url}`, error)
    }
  }
}

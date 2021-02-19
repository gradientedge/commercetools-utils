import fetch, { RequestInit, Response } from 'node-fetch'
import {
  CommercetoolsGrantResponse,
  CommercetoolsAuthApiConfig,
  CommercetoolsRefreshGrantResponse,
  GrantType
} from './types'
import { CommercetoolsAuthError } from './CommercetoolsAuthError'
import { scopeArrayToRequestString } from './scopes'
import { REGION_URLS } from './constants'
import { basic } from './utils'
import { Region, RegionEndpoints } from '../types'

const configDefaults = {
  timeout: 5
}

interface Config {
  clientId: string
  clientSecret: string
  projectKey: string
  region: Region
  timeout: number
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
   */
  private endpoints: RegionEndpoints

  constructor(config: CommercetoolsAuthApiConfig) {
    this.config = { ...configDefaults, ...config }
    this.endpoints = REGION_URLS[this.config.region]
  }

  /**
   * Get a new token
   */
  public async getClientGrant(scopes: string[]): Promise<CommercetoolsGrantResponse> {
    return this.post('/token', {
      grant_type: GrantType.CLIENT_CREDENTIALS,
      scope: scopeArrayToRequestString(scopes, this.config.projectKey)
    })
  }

  /**
   * Refresh an access token given a refresh token.
   */
  public async refreshGrant(refreshToken: string): Promise<CommercetoolsRefreshGrantResponse> {
    return await this.post('/token', {
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: refreshToken
    })
  }

  /**
   * Login the customer using the given options.
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
   * Get an access token for an anonymous customer.
   */
  public async getAnonymousGrant(options?: {
    anonymousId?: string
    scopes: string[]
  }): Promise<CommercetoolsGrantResponse> {
    const postOptions: Record<string, any> = {
      grant_type: GrantType.CLIENT_CREDENTIALS
    }
    if (options?.scopes && options.scopes.length) {
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
  public post(path: string, body: Record<string, any>): Promise<CommercetoolsGrantResponse> {
    const url = `${this.endpoints.auth}/oauth${path}`
    const options: RequestInit = {
      method: 'post',
      body: new URLSearchParams(body).toString(),
      headers: {
        Authorization: `Basic ${basic(this.config.clientId, this.config.clientSecret)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return this.fetch(url, options)
  }

  /**
   * Make a request using `fetch`. If `fetch` throws an error then we convert
   * the error in to a new error with as many request/response details as possible.
   *
   * We also consider any status code equal to or above 400 to be an error.
   */
  public async fetch(url: string, options: RequestInit) {
    let response: Response | undefined

    try {
      response = await fetch(url, options)
    } catch (e) {
      throw new CommercetoolsAuthError(`Exception making request to: ${url}`, {
        url,
        options,
        error: e
      })
    }

    if (response.status >= 400) {
      let text: string
      try {
        text = await response.text()
      } catch (e) {
        text = ''
      }
      throw new CommercetoolsAuthError(`Unexpected status code: ${response.status}`, {
        url,
        options,
        responseText: text
      })
    }

    return await response.json()
  }
}

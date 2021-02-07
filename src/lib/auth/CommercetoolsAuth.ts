import axios, { AxiosResponse } from 'axios'
import {
  AccessToken,
  AnonymousTokenOptions,
  CommercetoolsAuthConfig,
  CommercetoolsTokenResponse,
  GrantType,
  LoginOptions,
  RefreshedAccessToken
} from './types'
import { CommercetoolsAuthError } from './CommercetoolsAuthError'

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

interface FetchOptions {
  url: string
  data: Record<string, any> | string
  headers: Record<string, any>
}

export class CommercetoolsAuth {
  protected readonly config: Config
  private clientAccessToken?: AccessToken
  private fetchPromise?: Promise<any>
  private fetching = false

  constructor(config: CommercetoolsAuthConfig) {
    this.config = { ...configDefaults, ...config }
  }

  async refreshAccessToken(): Promise<RefreshedAccessToken> {
    if (!this.clientAccessToken) {
      throw new Error('No current access token to refresh')
    }

    const { data } = await this.post('/oauth/token', {
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: this.clientAccessToken.refreshToken
    })

    this.clientAccessToken = this.responseToToken({
      ...this.clientAccessToken,
      ...data
    })

    return this.clientAccessToken
  }

  /**
   * Get an access token
   *
   * This may or may not reach out to the remote authorisation
   * server in order to get a new token, depending on the time
   * remaining on the existing token.
   *
   * @returns {Promise<string>}
   */
  async getAccessToken(): Promise<AccessToken> {
    const timeInSeconds = new Date().getTime() / 1000

    if (this.clientAccessToken) {
      if (this.clientAccessToken.accessToken && this.clientAccessToken.expiresAt) {
        if (
          timeInSeconds + this.config.refreshIfWithinSecs <
          this.clientAccessToken.expiresAt.getTime()
        ) {
          return this.clientAccessToken
        }
        try {
          await this.refreshAccessToken()
          return this.clientAccessToken
        } catch (e) {
          // Log that there was an error refreshing
        }
      }
    }

    try {
      return this.getNewAccessToken()
    } catch (e) {
      // Convert axios error to something nicer
      throw new Error(e)
    }
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
  async getNewAccessToken(): Promise<AccessToken> {
    const { data } = await this.post<CommercetoolsTokenResponse>('/oauth/token', {
      grant_type: GrantType.CLIENT_CREDENTIALS,
      scope: this.scopesToRequestString()
    })

    this.clientAccessToken = this.responseToToken(data)

    return this.clientAccessToken
  }

  async post<T = any>(path: string, data: any): Promise<AxiosResponse<T>> {
    if (this.fetchPromise) {
      return this.fetchPromise
    }

    this.fetchPromise = new Promise((resolve, reject) => {
      this.fetch({
        url: this.config.baseAuthUrl + path,
        data,
        headers: {
          Authorization: `Basic ${this.getBasicAuthToken()}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then((data) => resolve(data))
        .catch((reason) => reject(reason))
        .finally(() => {
          this.fetchPromise = undefined
        })
    })

    return this.fetchPromise
  }

  async login(options: LoginOptions): Promise<AccessToken> {
    const { data } = await this.post('/customers/token', {
      username: options.username,
      password: options.password,
      grant_type: GrantType.PASSWORD,
      scope: options.scopes || this.config.customerScopes
    })

    return this.responseToToken(data)
  }

  async getAnonymousToken(options: AnonymousTokenOptions): Promise<AccessToken> {
    const { data } = await this.post('/anonymous/token', {
      grant_type: GrantType.CLIENT_CREDENTIALS,
      scope: options.scopes || this.config.customerScopes
    })

    return this.responseToToken(data)
  }

  getBasicAuthToken(): string {
    return Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')
  }

  async fetch<T = any>(options: FetchOptions): Promise<T> {
    const axiosOptions = { ...options }
    if (typeof axiosOptions.data === 'object') {
      axiosOptions.data = new URLSearchParams(options.data).toString()
    }
    try {
      const response = await axios({
        ...options,
        method: 'post'
      })
      return response.data
    } catch (e) {
      throw new CommercetoolsAuthError(e)
    }
  }

  private scopesToRequestString() {
    if (!this.config.clientScopes) {
      return ''
    }
    return this.config.clientScopes.map((scope) => `${scope}:${this.config.projectKey}`).join(' ')
  }

  private scopesStringToArray(scopes: string) {
    return scopes.split(' ').map((scope) => scope.split(':')[0])
  }

  private responseToToken(data: CommercetoolsTokenResponse) {
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      expiresAt: new Date(new Date().getTime() / 1000 + data.expires_in),
      scopes: this.scopesStringToArray(data.scope)
    }
  }
}

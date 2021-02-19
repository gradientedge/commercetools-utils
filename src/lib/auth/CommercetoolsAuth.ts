import fetch from 'node-fetch'
import { AnonymousTokenOptions, CommercetoolsAuthConfig, LoginOptions } from './types'
import { CommercetoolsAuthError } from './CommercetoolsAuthError'
import { CommercetoolsGrant } from './CommercetoolsGrant'
import { CommercetoolsAuthApi } from './CommercetoolsAuthApi'

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
  private grant?: CommercetoolsGrant

  /**
   * Whenever we either refresh the client access token, or request a new one,
   * we don't want to allow any other requests to be initiated until that
   * request has completed. This promise is used to determine whether incoming
   * requests need to wait on an existing client access token request to complete
   * before they can start to be processed.
   */
  private tokenPromise: Promise<any> = Promise.resolve()
  private api: CommercetoolsAuthApi

  constructor(config: CommercetoolsAuthConfig) {
    this.config = { ...configDefaults, ...config }

    if (!this.config.clientScopes.length) {
      throw new CommercetoolsAuthError('`config.clientScopes` must contain at least one scope')
    }

    this.api = new CommercetoolsAuthApi(config)
  }

  /**
   * Get a client access token
   *
   * If we don't already have a client access token stored locally, then
   * we make a call to commercetools to generate one. Once we have a token,
   * we store it locally and then return that cached version up until it needs
   * to be renewed.
   */
  public async getClientGrant(): Promise<CommercetoolsGrant> {
    await this.tokenPromise

    if (this.grant) {
      if (!this.grant.expiresWithin(this.config.refreshIfWithinSecs)) {
        return this.grant
      }

      try {
        const data = await this.api.refreshGrant(this.grant.refreshToken)
        this.grant.refresh(data)
        return this.grant
      } catch (e) {
        // Log that there was an error refreshing
      }
    }

    this.tokenPromise = this.api.getClientGrant(this.config.clientScopes)
    this.grant = new CommercetoolsGrant(await this.tokenPromise)

    return this.grant
  }

  /**
   * Refresh the customer access token given a refresh token
   */
  public async refreshCustomerGrant(refreshToken: string): Promise<CommercetoolsGrant> {
    await this.getClientGrant()

    const data = await this.api.refreshGrant(refreshToken)
    return new CommercetoolsGrant({ ...data, refresh_token: refreshToken })
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
  public async login(options: LoginOptions): Promise<CommercetoolsGrant> {
    const scopes = options.scopes || this.config.customerScopes

    if (!scopes) {
      throw new CommercetoolsAuthError(
        'Customer scopes must be set on either the `options` ' +
          'parameter of this `login` method, or on the `customerScopes` ' +
          'property of the `CommercetoolsAuth` constructor'
      )
    }

    await this.getClientGrant()

    const data = await this.api.login({
      username: options.username,
      password: options.password,
      scopes,
      projectKey: this.config.projectKey
    })

    return new CommercetoolsGrant(data)
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
  public async getAnonymousGrant(options?: AnonymousTokenOptions): Promise<CommercetoolsGrant> {
    const scopes = options?.scopes || this.config.customerScopes
    const anonymousId = options?.anonymousId

    if (!scopes) {
      throw new CommercetoolsAuthError(
        'Customer scopes must be set on either the `options` ' +
          'parameter of this `login` method, or on the `customerScopes` ' +
          'property of the `CommercetoolsAuth` constructor'
      )
    }

    await this.getClientGrant()

    const data = await this.api.getAnonymousGrant({
      scopes,
      anonymousId
    })

    return new CommercetoolsGrant(data)
  }
}

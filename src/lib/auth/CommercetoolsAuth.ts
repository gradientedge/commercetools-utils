import {
  AnonymousGrantOptions,
  CommercetoolsAuthConfig,
  LoginOptions,
  LogoutOptions,
  RevokeTokenOptions,
} from './types'
import { CommercetoolsError } from '../'
import { CommercetoolsGrant } from './CommercetoolsGrant'
import { CommercetoolsAuthApi } from './CommercetoolsAuthApi'

/**
 * This interface used for holding the internal config of {@see CommercetoolsAuth}.
 * It's only purpose currently is to make the {@see Config.refreshIfWithinSecs} and
 * {@see Config.timeoutMs} properties mandatory after extending {@see CommercetoolsAuthConfig}
 * where those properties are optional. Default values for those properties are
 * defined on {@see configDefaults}.
 */
interface Config extends CommercetoolsAuthConfig {
  clientScopes: string[]
  refreshIfWithinSecs: number
  timeoutMs: number
  storeKey?: string
}

/**
 * Default values for a couple of the properties required by the {@see Config}
 * interface used in {@see CommercetoolsAuth.constructor}.
 */
const configDefaults = {
  refreshIfWithinSecs: 1800,
  timeoutMs: 5000,
}

/**
 * Provides an easy to use set of methods for communicating with the commercetools
 * HTTP Authorization API: https://docs.commercetools.com/api/authorization
 *
 * To create an instance of the class and get a client grant:
 * ```typescript
 * import { Region, CommercetoolsAuth } from '@gradientedge/commercetools-utils'
 *
 * async function example() {
 *   const auth = new CommercetoolsAuth({
 *     projectKey: 'your-project-key',
 *     clientId: 'your-client-id',
 *     clientSecret: 'your-client-secret',
 *     region: Region.EUROPE_GCP,
 *     clientScopes: ['create_anonymous_token']
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
  public readonly config: Config

  /**
   * This holds the client grant, once one has been generated.
   */
  private grant?: CommercetoolsGrant

  /**
   * Whenever we either refresh the client grant, or request a new one,
   * we don't want to allow any other requests to be initiated until that
   * request has completed. This promise is used to determine whether incoming
   * requests need to wait on an existing client grant request to complete
   * before they can start to be processed.
   */
  private grantPromise: Promise<any> | null = null

  /**
   * The {@see CommercetoolsAuthApi} handles the actual sending of the request
   * and any lower level outgoing or incoming transformation of data.
   */
  private api: CommercetoolsAuthApi

  /**
   * Store the configuration locally and do some light validation to ensure
   * that we have some `clientScopes` defined. We also set a `member` called
   * {@see api} to an instance of {@see CommercetoolsAuthApi}, which handles
   * the lower level commercetools request.
   */
  constructor(config: CommercetoolsAuthConfig) {
    this.config = { ...configDefaults, ...config }

    if (!this.config.clientScopes.length) {
      throw new CommercetoolsError('`config.clientScopes` must contain at least one scope')
    }

    this.api = new CommercetoolsAuthApi(config)
  }

  /**
   * Get a client grant
   *
   * If we don't already have a client grant stored locally, then we make a
   * call to commercetools to generate one. Once we have a grant, we store it
   * locally and then return that cached version up until it needs to be renewed.
   */
  public async getClientGrant(): Promise<CommercetoolsGrant> {
    if (this.grantPromise) {
      return this.grantPromise
    }

    if (this.grant && !this.grant.expiresWithin(this.config.refreshIfWithinSecs)) {
      return this.grant
    }

    this.grantPromise = this.api
      .getClientGrant(this.config.clientScopes)
      .then((grant) => {
        this.grant = new CommercetoolsGrant(grant)
        return this.grant
      })
      .finally(() => {
        this.grantPromise = null
      })
    return this.grantPromise
  }

  /**
   * Refresh the customer's grant given a refresh token
   */
  public async refreshCustomerGrant(refreshToken: string): Promise<CommercetoolsGrant> {
    const data = await this.api.refreshGrant(refreshToken)
    return new CommercetoolsGrant({ ...data, refresh_token: refreshToken })
  }

  /**
   * Login the customer using the given options.
   *
   * If the {@link LoginOptions.scopes} property isn't set on the `options`
   * parameter then we'll use the scopes set on {@link CommercetoolsAuthConfig.customerScopes}.
   * If this doesn't contain any values either, then this method will throw
   * an error due to the security risk of the customer having a grant with
   * the same privileges as the client API key.
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
   *     region: Region.EUROPE_GCP,
   *     clientScopes: [
   *       'view_published_products',
   *       'view_categories',
   *       'manage_customers',
   *       'create_anonymous_token'
   *     ]
   *   })
   *
   *   const grant = await auth.login({
   *     username: 'test@gradientedge.com',
   *     password: 'testing123'
   *   })
   *
   *   console.log('Customer grant:', grant)
   * }
   *
   * example()
   * ```
   *
   * Note that there is no need to call {@link getClientGrant} in order to
   * generate a client grant. The class internally requests one if it
   * doesn't have a non-expired grant already cached locally.
   */
  public async login(options: LoginOptions): Promise<CommercetoolsGrant> {
    const scopes = options.scopes || this.config.customerScopes

    if (!scopes) {
      throw new CommercetoolsError(
        'Customer scopes must be set on either the `options` ' +
          'parameter of this `login` method, or on the `customerScopes` ' +
          'property of the `CommercetoolsAuth` constructor',
      )
    }

    await this.getClientGrant()

    const data = await this.api.login({
      ...options,
      scopes,
    })

    return new CommercetoolsGrant(data)
  }

  /**
   * Get a grant for an anonymous customer.
   *
   * If you pass a value to the {@link AnonymousGrantOptions.anonymousId}
   * `options` parameter property then this must not exist within the commercetools
   * system for your project key, otherwise an error will be thrown. Typically
   * this property would be left undefined and commercetools will then create
   * a unique id for the anonymous user automatically.
   *
   * Example code to generate an anonymous customer grant:
   * ```typescript
   * import { Region, CommercetoolsAuth } from '@gradientedge/commercetools-utils'
   *
   * async function example() {
   *   const auth = new CommercetoolsAuth({
   *     projectKey: 'your-project-key',
   *     clientId: 'your-client-id',
   *     clientSecret: 'your-client-secret',
   *     region: Region.EUROPE_GCP,
   *     clientScopes: [
   *       'view_published_products',
   *       'view_categories',
   *       'manage_customers',
   *       'create_anonymous_token'
   *     ]
   *   })
   *
   *   const grant = await auth.getAnonymousGrant()
   *
   *   console.log('Anonymous customer grant:', grant)
   * }
   *
   * example()
   * ```
   */
  public async getAnonymousGrant(options?: AnonymousGrantOptions): Promise<CommercetoolsGrant> {
    const scopes = options?.scopes || this.config.customerScopes
    const anonymousId = options?.anonymousId

    if (!scopes) {
      throw new CommercetoolsError(
        'Customer scopes must be set on either the `options` ' +
          'parameter of this `login` method, or on the `customerScopes` ' +
          'property of the `CommercetoolsAuth` constructor',
      )
    }

    await this.getClientGrant()

    const data = await this.api.getAnonymousGrant({
      scopes,
      anonymousId,
    })

    return new CommercetoolsGrant(data)
  }

  /**
   * Logout the customer
   */
  public async logout(options: LogoutOptions): Promise<void> {
    await this.api.logout(options)
  }

  /**
   * Revoke the given access/refresh token
   *
   * Remember that you can only revoke tokens that were generated using
   * this client access token.
   */
  public async revokeToken(options: RevokeTokenOptions): Promise<void> {
    await this.api.revokeToken(options)
  }
}

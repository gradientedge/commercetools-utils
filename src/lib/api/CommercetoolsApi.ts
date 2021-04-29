import axios from 'axios'
import { CommercetoolsApiConfig } from './types'
import { CommercetoolsAuth } from '../'
import { CommercetoolsError } from '../error'
import { REGION_URLS } from '../auth/constants'
import { RegionEndpoints } from '../types'
import { DEFAULT_REQUEST_TIMEOUT_MS } from '../constants'
import { buildUserAgent } from '../utils'
import { ProductDraft, ProductUpdate } from '@commercetools/platform-sdk'

interface FetchOptions {
  path: string
  headers?: Record<string, string>
  method: 'GET' | 'POST' | 'DELETE'
  params?: Record<string, any>
  data?: Record<string, any>
  accessToken?: string
  correlationId?: string
}

/**
 * Options that are available to all requests.
 */
export interface CommonRequestOptions {
  /**
   * A unique id used to track the source of a request.
   */
  correlationId?: string

  /**
   * Query string parameters.
   */
  params?: Record<string, any>
}

/**
 * A collection of convenience methods for interacting with the
 * commercetools API.
 */
export class CommercetoolsApi {
  /**
   * This is the instance of the {@see CommercetoolsAuth} class that
   * this class uses internally. It's exposed publicly so that it can
   * be used by consumer's of this class in order to access authorization
   * API related functionality.
   */
  public readonly auth: CommercetoolsAuth

  /**
   * The configuration passed in to the constructor.
   */
  private readonly config: CommercetoolsApiConfig

  /**
   * The Auth and API endpoints driven by the user's setting of {@link CommercetoolsApiConfig.region}
   * https://docs.commercetools.com/api/general-concepts#regions
   */
  private readonly endpoints: RegionEndpoints

  /**
   * The string that's sent over in the `User-Agent` header
   * when a request is made to commercetools.
   */
  private readonly userAgent: string

  constructor(config: CommercetoolsApiConfig) {
    this.config = config
    this.auth = new CommercetoolsAuth(config)
    this.endpoints = REGION_URLS[this.config.region]
    this.userAgent = buildUserAgent(this.config.systemIdentifier)
  }

  /**
   * Get an individual category by id:
   * https://docs.commercetools.com/api/projects/categories#get-category-by-id
   */
  getCategoryById(id: string, params = {}): Promise<any> {
    return this.request({
      path: `/categories/${id}`,
      method: 'GET',
      params
    })
  }

  /**
   * Get a category projection by slug and locale
   */
  async getCategoryBySlug(slug: string, languageCode: string, params = {}): Promise<any> {
    const data = await this.request({
      path: `/categories`,
      method: 'GET',
      params: {
        ...params,
        where: `slug(${languageCode}="${slug}")`
      }
    })
    return data.count ? data.results[0] : null
  }

  /**
   * Query categories
   * https://docs.commercetools.com/api/projects/categories#query-categories
   */
  queryCategories(params = {}): Promise<any> {
    return this.request({
      path: `/categories`,
      method: 'GET',
      params
    })
  }

  /**
   * Get an individual product by id:
   * https://docs.commercetools.com/api/projects/products#get-product-by-id
   */
  getProductById(id: string, params = {}): Promise<any> {
    return this.request({
      path: `/products/${id}`,
      method: 'GET',
      params
    })
  }

  /**
   * Get a product projection by id
   * https://docs.commercetools.com/api/projects/productProjections#get-productprojection-by-id
   */
  getProductProjectionById(id: string, params = {}): Promise<any> {
    return this.request({
      path: `/product-projections/${id}`,
      method: 'GET',
      params
    })
  }

  /**
   * Get a product projection by slug and locale
   */
  async getProductProjectionBySlug(slug: string, languageCode: string, params = {}): Promise<any> {
    const data = await this.request({
      path: `/product-projections`,
      method: 'GET',
      params: {
        ...params,
        where: `slug(${languageCode}="${slug}")`
      }
    })
    return data.count ? data.results[0] : null
  }

  /**
   * Query product projections
   * https://docs.commercetools.com/api/projects/productProjections#query-productprojections
   */
  queryProductProjections(params = {}): Promise<any> {
    return this.request({
      path: `/product-projections`,
      method: 'GET',
      params
    })
  }

  /**
   * Query product projections
   * https://docs.commercetools.com/api/projects/products-search#search-productprojections
   */
  searchProductProjections(params = {}): Promise<any> {
    return this.request({
      path: `/product-projections/search`,
      method: 'GET',
      params
    })
  }

  /**
   * Get the active cart. Requires a logged in or anonymous customer access token.
   */
  async getActiveCart(accessToken: string, params = {}) {
    return this.request({
      path: `/me/active-cart`,
      method: 'GET',
      params,
      accessToken
    })
  }

  /**
   * Create a new cart for the customer associated with the given `accessToken` parameter.
   */
  async createCart(accessToken: string, data: any, params = {}) {
    return this.request({
      path: `/me/carts`,
      method: 'POST',
      data,
      params,
      accessToken
    })
  }

  /**
   * Delete the active cart, if one exists, of the customer associated with the
   * given `accessToken` parameter. This method uses {@see getActiveCart} to first
   * get the active cart, in order to discover the id and version of the active cart.
   */
  async deleteActiveCart(accessToken: string) {
    let cart
    try {
      cart = await this.getActiveCart(accessToken)
    } catch (e) {}
    if (cart) {
      await this.request({
        path: `/me/carts/${cart.id}`,
        method: 'DELETE',
        params: { version: cart.version },
        accessToken
      })
    }
  }

  /**
   * Update a customer's cart with the given actions.
   */
  updateMyCart(accessToken: string, cartId: string, cartVersion: number, actions: any[], params = {}) {
    return this.request({
      path: `/me/carts/${cartId}`,
      method: 'POST',
      data: {
        version: cartVersion,
        actions
      },
      params,
      accessToken
    })
  }

  /**
   * Set the shipping address on the active cart.
   */
  async setActiveCartShippingAddress(accessToken: string, address: any, params = {}) {
    const cart = await this.getActiveCart(accessToken)
    const actions = [{ action: 'setShippingAddress', address }]
    return this.updateMyCart(accessToken, cart.id, cart.version, actions, params)
  }

  /**
   * Create an order from the given cart id
   */
  createMyOrderFromCart(accessToken: string, cartId: string, cartVersion: number, params = {}) {
    return this.request({
      path: '/me/orders',
      method: 'POST',
      data: {
        id: cartId,
        version: cartVersion
      },
      params,
      accessToken
    })
  }

  /**
   * Create a payment object using the customer's access token
   */
  createMyPayment(accessToken: string, data: any, params = {}) {
    return this.request({
      path: '/me/payments',
      method: 'POST',
      data,
      params,
      accessToken
    })
  }

  /**
   * Get an order by id using the customer's access token
   */
  getMyOrderById(accessToken: string, id: string, params = {}) {
    return this.request({
      path: `/me/orders/${id}`,
      method: 'GET',
      params,
      accessToken
    })
  }

  /**
   * Create a product:
   * https://docs.commercetools.com/api/projects/products#create-a-product
   */
  createProduct(options: CommonRequestOptions & { data: ProductDraft }) {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products`,
      method: 'POST',
      data: options.data
    })
  }

  /**
   * Update a product by key:
   * https://docs.commercetools.com/api/projects/products#update-product-by-key
   */
  updateProductByKey(options: CommonRequestOptions & { key: string; data: ProductUpdate }) {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/key=${options.key}`,
      method: 'POST',
      data: options.data
    })
  }

  /**
   * Update a product by id:
   * https://docs.commercetools.com/api/projects/products#update-product-by-id
   */
  updateProductById(options: CommonRequestOptions & { id: string; data: ProductUpdate }) {
    return this.request({
      ...this.extractCommonRequestOptions(options),
      path: `/products/${options.id}`,
      method: 'POST',
      data: options.data
    })
  }

  /**
   * Create a category:
   * https://docs.commercetools.com/api/projects/categories#create-a-category
   */
  createCategory(key: string, data: any) {
    return this.request({
      path: `/categories`,
      method: 'POST',
      data
    })
  }

  /**
   * Update a category by key:
   * https://docs.commercetools.com/api/projects/categories#update-category-by-key
   */
  updateCategoryByKey(key: string, data: any) {
    return this.request({
      path: `/categories/key=${key}`,
      method: 'POST',
      data
    })
  }

  /**
   * Update a category by id:
   * https://docs.commercetools.com/api/projects/categories#update-category-by-id
   */
  updateCategoryById(id: string, data: any) {
    return this.request({
      path: `/categories/${id}`,
      method: 'POST',
      data
    })
  }

  /**
   * Make the request to the commercetools REST API.
   */
  async request<T = any>(options: FetchOptions): Promise<T> {
    let accessToken = options.accessToken
    const url = `${this.endpoints.api}/${this.config.projectKey}${options.path}`
    const opts: any = { ...options }
    opts.path && delete opts.path
    opts.accessToken && delete opts.accessToken

    if (!accessToken) {
      const grant = await this.auth.getClientGrant()
      accessToken = grant.accessToken
    }
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      ...opts.headers
    }
    if (process?.release?.name) {
      headers['User-Agent'] = this.userAgent
    }
    if (typeof options.correlationId === 'string' && options.correlationId !== '') {
      headers['X-Correlation-ID'] = options.correlationId
      delete options.correlationId
    }
    try {
      const response = await axios({
        ...opts,
        url,
        headers,
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

  /**
   * Type-guard against any additional unexpected properties being passed in.
   */
  private extractCommonRequestOptions(options: CommonRequestOptions): CommonRequestOptions {
    return {
      correlationId: options.correlationId,
      params: options.params
    }
  }
}

import axios from 'axios'
import { CommercetoolsApiConfig } from './types'
import { CommercetoolsAuth } from '../'
import { CommercetoolsError } from '../error'
import { REGION_URLS } from '../auth/constants'
import { RegionEndpoints } from '../types'
import { DEFAULT_REQUEST_TIMEOUT_MS } from '../constants'

interface FetchOptions {
  path: string
  headers?: Record<string, string>
  method: 'GET' | 'POST'
  params?: Record<string, any>
}

/**
 * Doc comment
 */
export class CommercetoolsApi {
  /**
   * This is the instance of the {@see CommercetoolsAuth} class that
   * this class uses internally. It's exposed publicly so that it can
   * be used by consumer's of this class in order to access authorization
   * API related functionality.
   */
  public readonly auth: CommercetoolsAuth
  private readonly config: CommercetoolsApiConfig
  private readonly endpoints: RegionEndpoints

  constructor(config: CommercetoolsApiConfig) {
    this.config = config
    this.auth = new CommercetoolsAuth(config)
    this.endpoints = REGION_URLS[this.config.region]
  }

  /**
   * Get an individual category by id:
   * https://docs.commercetools.com/api/projects/categories#get-category-by-id
   */
  getCategoryById(id: string): Promise<any> {
    return this.request({
      path: `/categories/${id}`,
      method: 'GET'
    })
  }

  /**
   * Get a category projection by slug and locale
   */
  async getCategoryBySlug(slug: string, languageCode: string): Promise<any> {
    const data = await this.request({
      path: `/categories`,
      method: 'GET',
      params: {
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
  getProductById(id: string): Promise<any> {
    return this.request({
      path: `/products/${id}`,
      method: 'GET'
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
  async getProductProjectionBySlug(slug: string, languageCode: string): Promise<any> {
    const data = await this.request({
      path: `/product-projections`,
      method: 'GET',
      params: {
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
   * Make the request to the commercetools REST API.
   */
  async request<T = any>(options: FetchOptions): Promise<T> {
    const grant = await this.auth.getClientGrant()
    const url = `${this.endpoints.api}/${this.config.projectKey}${options.path}`
    const opts: any = { ...options }
    opts.path && delete opts.path

    try {
      const response = await axios({
        ...opts,
        url,
        headers: {
          Authorization: `Bearer ${grant.accessToken}`,
          ...opts.headers
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

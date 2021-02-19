import axios from 'axios'
import { CommercetoolsApiConfig } from './types'
import { CommercetoolsAuth } from '../auth/CommercetoolsAuth'
import { CommercetoolsApiError } from './CommercetoolsApiError'
import { REGION_URLS } from '../auth/constants'
import { RegionEndpoints } from '../types'

interface FetchOptions {
  path: string
  headers?: Record<string, string>
  method: 'GET' | 'POST'
}

export class CommercetoolsApi {
  private auth: CommercetoolsAuth
  private config: CommercetoolsApiConfig
  private endpoints: RegionEndpoints

  constructor(config: CommercetoolsApiConfig) {
    this.config = config
    this.auth = new CommercetoolsAuth(config)
    this.endpoints = REGION_URLS[this.config.region]
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
        }
      })
      return response.data
    } catch (e) {
      const error: any = {
        message: e.message,
        request: opts
      }
      if (e.isAxiosError) {
        error.response = {
          code: e.code,
          data: e.response?.data
        }
      }
      throw new CommercetoolsApiError(`Error in request to: ${url}`, error)
    }
  }
}

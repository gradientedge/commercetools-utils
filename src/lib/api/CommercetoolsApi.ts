import { CommercetoolsApiConfig } from './types'
import { CommercetoolsAuth } from '../auth/CommercetoolsAuth'
import fetch, { RequestInit, Response } from 'node-fetch'
import { CommercetoolsAuthError } from '../auth/CommercetoolsAuthError'
import { REGION_URLS } from '../auth/constants'
import { RegionEndpoints } from '../types'

export class CommercetoolsApi {
  private auth: CommercetoolsAuth
  private config: CommercetoolsApiConfig
  private endpoints: RegionEndpoints

  constructor(config: CommercetoolsApiConfig) {
    this.config = config
    this.auth = new CommercetoolsAuth(config)
    this.endpoints = REGION_URLS[this.config.region]
  }

  getProduct(id: string) {
    return this.request(`/${this.config.projectKey}/products/${id}`)
  }

  async request(path: string, options?: any) {
    const grant = await this.auth.getClientGrant()
    return this.fetch(`${this.endpoints.api}${path}`, {
      headers: {
        Authorization: `Bearer ${grant.accessToken}`
      }
    })
  }

  /**
   * Make a request using `fetch`. If `fetch` throws an error then we convert
   * the error in to a new error with as many request/response details as possible.
   *
   * We also consider any status code equal to or above 400 to be an error.
   */
  public async fetch(url: string, options: RequestInit) {
    let response: Response | undefined

    console.log('URL', url)
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

import { Region } from '../types'

/**
 * Configuration for constructing the CommercetoolsApi class.
 *
 *
 */
export interface CommercetoolsApiConfig {
  projectKey: string
  clientId: string
  clientSecret: string
  region: Region
  refreshIfWithinSecs?: number
  clientScopes: string[]
  customerScopes?: string[]
  timeout?: number
  logger?: {
    debug: (...args: any) => void
    info: (...args: any) => void
    error: (...args: any) => void
  }
}

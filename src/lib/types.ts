/**
 * The commercetools region that your API client id/secret relate to.
 * This is used to determine the authentication endpoint.
 */
import { CommercetoolsLogger } from './logger/CommercetoolsLogger'

export enum Region {
  NORTH_AMERICA_GCP = 'north_america_gcp',
  NORTH_AMERICA_AWS = 'north_america_aws',
  EUROPE_GCP = 'europe_gcp',
  EUROPE_AWS = 'europe_aws',
  AUSTRALIA_GCP = 'australia_gcp',
}

/**
 * The Authentication and API endpoints for a particular region
 */
export interface RegionEndpoints {
  /**
   * The url to the commercetools auth endpoint for the region
   */
  auth: string
  /**
   * The url to the commercetools API endpoint for the region
   */
  api: string
}

/**
 * Provides a base configuration definition from which other class
 * specific configurations can be extended.
 */
export interface CommercetoolsBaseConfig {
  projectKey: string
  storeKey?: string
  clientId: string
  clientSecret: string
  region: Region
  clientScopes: string[]
  timeoutMs?: number
  logger?: CommercetoolsLoggerConfig

  /**
   * If provided, will be passed across to commercetools in the
   * 'User-Agent' HTTP header, in order to help commercetools
   * identify the source of incoming requests.
   */
  systemIdentifier?: string
}

/**
 * Logger options
 *
 * If either the debug, warn or error fields are assigned a function,
 * then that function will be called when the API logs a message of
 * the corresponding level.
 */
export interface CommercetoolsLoggerConfig {
  /** Function for receiving debug messages */
  debug: CommercetoolsLoggerFunction
  /** Function for receiving warning messages */
  warn: CommercetoolsLoggerFunction
  /** Function for receiving error messages */
  error?: CommercetoolsLoggerFunction
  /** Log level to output (defaults to 'warn') */
  level?: CommercetoolsLoggerLevel
}

/**
 * Log function signature
 */
export type CommercetoolsLoggerFunction = (message: string, data?: Record<string, unknown>) => any

/**
 * Log level enum
 */
export type CommercetoolsLoggerLevel = 'silent' | 'debug' | 'warn' | 'error'

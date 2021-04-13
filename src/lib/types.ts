/**
 * The commercetools region that your API client id/secret relate to.
 * This is used to determine the authentication endpoint.
 */
export enum Region {
  NORTH_AMERICA_GCP = 'north_america_gcp',
  NORTH_AMERICA_AWS = 'north_america_aws',
  EUROPE_GCP = 'europe_gcp',
  EUROPE_AWS = 'europe_aws',
  AUSTRALIA_GCP = 'australia_gcp'
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
  clientId: string
  clientSecret: string
  region: Region
  clientScopes: string[]
  timeoutMs?: number

  /**
   * If provided, will be passed across to commercetools in the
   * 'User-Agent' HTTP header, in order to help commercetools
   * identify the source of incoming requests.
   */
  systemIdentifier?: string
}

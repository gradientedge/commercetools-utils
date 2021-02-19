/**
 * The commercetools region that your API client id/secret relate to.
 * This is used to determine the authentication endpoint.
 */
export enum Region {
  US_CENTRAL = 'us_central',
  US_EAST = 'us_east',
  EUROPE_WEST = 'europe_west',
  EUROPE_CENTRAL = 'europe_central',
  AUSTRALIA = 'australia'
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

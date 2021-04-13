import { Region, RegionEndpoints } from '../types'

/**
 * Commercetools regions and cloud providers - https://docs.commercetools.com/api/general-concepts#hosts
 */
export const REGION_URLS: Record<Region, RegionEndpoints> = {
  [Region.EUROPE_GCP]: {
    auth: 'https://auth.europe-west1.gcp.commercetools.com',
    api: 'https://api.europe-west1.gcp.commercetools.com'
  },
  [Region.EUROPE_AWS]: {
    auth: 'https://auth.eu-central-1.aws.commercetools.com',
    api: 'https://api.eu-central-1.aws.commercetools.com'
  },
  [Region.NORTH_AMERICA_GCP]: {
    auth: 'https://auth.us-central1.gcp.commercetools.com',
    api: 'https://api.us-central1.gcp.commercetools.com'
  },
  [Region.NORTH_AMERICA_AWS]: {
    auth: 'https://auth.us-east-2.aws.commercetools.com',
    api: 'https://api.us-east-2.aws.commercetools.com'
  },
  [Region.AUSTRALIA_GCP]: {
    auth: 'https://auth.australia-southeast1.gcp.commercetools.com',
    api: 'https://api.australia-southeast1.gcp.commercetools.com'
  }
}

export const INVALID_SCOPES = ['anonymous_id', 'customer_id']

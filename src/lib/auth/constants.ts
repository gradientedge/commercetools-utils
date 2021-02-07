import { RegionEndpoints, Region } from './types'

export const REGION_URLS: Record<Region, RegionEndpoints> = {
  [Region.EUROPE_WEST]: {
    auth: 'https://auth.europe-west1.gcp.commercetools.com',
    api: 'https://api.europe-west1.gcp.commercetools.com'
  },
  [Region.EUROPE_CENTRAL]: {
    auth: 'https://auth.eu-central-1.aws.commercetools.com',
    api: 'https://api.eu-central-1.aws.commercetools.com'
  },
  [Region.US_CENTRAL]: {
    auth: 'https://auth.us-central1.gcp.commercetools.com',
    api: 'https://api.us-central1.gcp.commercetools.com'
  },
  [Region.US_EAST]: {
    auth: 'https://auth.us-east-2.aws.commercetools.com',
    api: 'https://api.us-east-2.aws.commercetools.com'
  },
  [Region.AUSTRALIA]: {
    auth: 'https://auth.australia-southeast1.gcp.commercetools.com',
    api: 'https://api.australia-southeast1.gcp.commercetools.com'
  }
}

export const INVALID_SCOPES = ['anonymous_id', 'customer_id']

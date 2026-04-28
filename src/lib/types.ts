import { CommercetoolsRetryConfig } from './api/index.js'

/**
 * The commercetools region that your API client id/secret relate to.
 * This is used to determine the authentication endpoint.
 */
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
export interface CommercetoolsBaseConfig extends CommercetoolsHooks {
  projectKey: string
  storeKey?: string
  clientId: string
  clientSecret: string
  region: Region
  timeoutMs?: number
  retry?: Partial<CommercetoolsRetryConfig>

  /**
   * If provided, will be passed across to commercetools in the
   * 'User-Agent' HTTP header, in order to help commercetools
   * identify the source of incoming requests.
   */
  systemIdentifier?: string

  /**
   * Optional custom authentication endpoint URL.
   * If provided, this will be used instead of the region-based auth URL.
   * Useful for pointing to mock servers during integration tests.
   * @example 'http://localhost:3000/auth'
   */
  authUrl?: string

  /**
   * Optional custom API endpoint URL.
   * If provided, this will be used instead of the region-based API URL.
   * Useful for pointing to mock servers during integration tests.
   * @example 'http://localhost:3000/api'
   */
  apiUrl?: string
}

export interface CommercetoolsHooks {
  /**
   * If passed in, will be called before sending a request to commercetools.
   * The {@see requestConfig} parameter can be manipulated if you wish to
   * modify/add headers or any other request data.
   */
  onBeforeRequest?: (
    requestConfig: CommercetoolsRequest,
  ) =>
    | Promise<Omit<CommercetoolsRequest, 'aggregateTimeoutMs' | 'timeoutMs' | 'abortController' | 'retry'>>
    | Omit<CommercetoolsRequest, 'aggregateTimeoutMs' | 'timeoutMs' | 'abortController' | 'retry'>

  /**
   * If passed in, will be called once a request has been made and the
   * response received (or error thrown).
   */
  onAfterResponse?: (response: CommercetoolsRequestResponse) => void
}

/**
 * Represents a request about to be made to commercetools
 */
export interface CommercetoolsRequest {
  url: string
  method: string
  params?: Record<string, string | number | boolean>
  headers: Record<string, string>
  data?: any
  retry?: Partial<CommercetoolsRetryConfig>
  aggregateTimeoutMs?: number
  timeoutMs?: number
  abortController?: AbortController
}

/**
 * Represents the request and response for a request made to commercetools
 */
export interface CommercetoolsRequestResponse {
  request: {
    url: string
    method: string
    params?: Record<string, string | number | boolean> | undefined
    headers?: Record<string, string> | undefined
    data?: any
  }
  response: {
    code?: string | undefined
    message?: string | undefined
    status?: number
    headers?: Record<string, string> | undefined
    data?: any
    /**
     * The TLS protocol version negotiated for the request (e.g. `TLSv1.3`).
     * Will be `undefined` if the request was not made over TLS or the
     * negotiated protocol could not be determined.
     */
    tlsVersion?: string
  }
  stats: CommercetoolsRequestResponseStats
}

export interface CommercetoolsRequestResponseStats {
  /**
   * The cumulative time (in milliseconds) spent across all attempts for this
   * request, including retries. Equal to `durationMs` when no retries occurred.
   */
  accumulativeDurationMs: number
  /**
   * The time (in milliseconds) taken by the final attempt of this request —
   * measured from just before the HTTP call was dispatched to when the
   * response (or error) was received.
   */
  durationMs: number
  /**
   * The number of retries performed before this response was received.
   * `0` indicates the request succeeded (or failed terminally) on the first
   * attempt.
   */
  retries: number
  /**
   * The number of sockets currently in use by the underlying HTTPS agent at
   * the point the request was dispatched. `-1` if socket stats were unavailable.
   */
  activeSockets: number
  /**
   * The number of idle (keep-alive) sockets available in the underlying
   * HTTPS agent's free pool at the point the request was dispatched.
   * `-1` if socket stats were unavailable.
   */
  freeSocketCount: number
  /**
   * The number of requests queued and waiting for a free socket in the
   * underlying HTTPS agent at the point the request was dispatched.
   * `-1` if socket stats were unavailable.
   */
  queuedRequests: number
  /**
   * Unix epoch timestamp (in milliseconds) captured immediately before
   * the HTTP request was dispatched by the client.
   */
  clientStartTime: number
  /**
   * Unix epoch timestamp (in milliseconds) captured as soon as the
   * response (or error) was received by the client.
   */
  clientEndTime: number
}

export interface RequestExecutor<T = any> {
  (options: CommercetoolsRequest): Promise<T>
}

export * from './types/models/index.js'

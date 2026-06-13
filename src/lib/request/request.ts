import {
  buildUserAgent,
  calculateDelay,
  convertAxiosError,
  convertAxiosResponse,
  getSocketStats,
} from '../utils/index.js'
import { AxiosInstance } from 'axios'
import { CommercetoolsRetryConfig } from '../api/index.js'
import { CommercetoolsHooks, CommercetoolsRequest } from '../types.js'
import { isRetryableError } from './is-retryable-error.js'
import { transformError } from './transform-error.js'
import { DEFAULT_REQUEST_TIMEOUT_MS } from '../constants.js'
import { plainClone } from '../utils/plain-clone.js'

export interface RequestOptions extends CommercetoolsHooks {
  axiosInstance: AxiosInstance
  retry: CommercetoolsRetryConfig
  request: CommercetoolsRequest
  aggregateTimeoutMs?: number
  timeoutMs?: number
  abortController?: AbortController
}

/**
 * Map of in-flight GET requests, keyed by URL + serialized query string.
 * When a second GET request arrives with the same key while one is already
 * in flight, it will await the existing promise instead of making a new
 * network call.
 */
const inflightGetRequests = new Map<string, Promise<any>>()

/**
 * Build a stable cache key from a request's URL, its querystring params, and
 * a small set of identity-affecting headers.
 *
 * We delegate the actual URL/querystring serialization to axios itself (via
 * `getUri`) so that the key matches however axios would serialize the
 * querystring (including any configured `paramsSerializer`). Params keys are
 * sorted first so that the same logical params produce the same cache key
 * regardless of property order.
 *
 * Identity-affecting headers (`Authorization` and `X-External-User-ID`) are
 * included in the key so that requests made with different credentials or on
 * behalf of different users (e.g. different customer access tokens, or
 * different impersonated users) are not accidentally de-duplicated together.
 * Headers that do not affect the response body are deliberately excluded —
 * notably `X-Correlation-ID` (a new UUID per request, which would defeat
 * de-duplication entirely) and `User-Agent`.
 *
 * Parts are joined with the NUL character (`\u0000`) since it cannot legally
 * appear in HTTP header values or URIs, which guarantees there is no way for
 * two different inputs to collide on the same key.
 */
function buildInflightGetKey(axiosInstance: AxiosInstance, req: CommercetoolsRequest): string {
  const params = req.params ?? {}
  const sortedParams: Record<string, unknown> = {}
  for (const key of Object.keys(params).sort()) {
    sortedParams[key] = params[key]
  }
  const uri = axiosInstance.getUri({ url: req.url, params: sortedParams })
  const identityHeaders = ['authorization', 'x-external-user-id']
  const headers = req.headers ?? {}
  const headerParts: string[] = []
  const lowerCasedHeaders: Record<string, string> = {}
  for (const headerName of Object.keys(headers)) {
    lowerCasedHeaders[headerName.toLowerCase()] = String(headers[headerName] ?? '')
  }
  for (const name of identityHeaders) {
    headerParts.push(`${name}=${lowerCasedHeaders[name] ?? ''}`)
  }
  return `${headerParts.join('\u0000')}\u0000${uri}`
}

export function request<T = any>(options: RequestOptions): Promise<T> {
  const method = options.request.method?.toString().toLowerCase()
  if (method === 'get') {
    const key = buildInflightGetKey(options.axiosInstance, options.request)
    const existing = inflightGetRequests.get(key) as Promise<T> | undefined
    if (existing) {
      return existing
    }
    const promise = executeRequest<T>(options).finally(() => {
      inflightGetRequests.delete(key)
    })
    inflightGetRequests.set(key, promise)
    return promise
  }
  return executeRequest<T>(options)
}

async function executeRequest<T = any>(options: RequestOptions): Promise<T> {
  const { retry: retryConfig, onBeforeRequest, onAfterResponse, axiosInstance, aggregateTimeoutMs } = options
  const timeout = options.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS
  const additionalHeaders: Record<string, string> = {}
  const requestConfig: CommercetoolsRequest = plainClone(options.request)
  let retryCount = 0
  let lastError: any
  let aggregateTimeoutId: NodeJS.Timeout | undefined
  let abortController: AbortController | undefined = options.abortController
  let isAbortedDueToAggregateTimeout = false

  // We only need to create an AbortController if we have an aggregate timeout
  if (aggregateTimeoutMs && !abortController) {
    abortController = new AbortController()
  }

  // If we have an aggregate timeout, we set up a timeout to abort the request.
  // This timeout gets cleared if the request completes before the timeout.
  if (aggregateTimeoutMs && abortController) {
    aggregateTimeoutId = setTimeout(() => {
      isAbortedDueToAggregateTimeout = true
      abortController.abort()
    }, aggregateTimeoutMs)
  }

  const headerNames = Object.keys(requestConfig.headers ?? {}).map((headerName) => headerName.toLowerCase())
  if (!headerNames.includes('user-agent')) {
    requestConfig.headers ??= {}
    requestConfig.headers['User-Agent'] = buildUserAgent()
  }

  let totalDurationMs = 0
  let startTime
  let endTime

  do {
    startTime = null
    endTime = null

    if (retryCount > 0) {
      additionalHeaders['X-Retry-Count'] = `${retryCount}`
      const delay = calculateDelay(retryCount, retryConfig)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    const preRequestSocketStats = getSocketStats(axiosInstance.defaults.httpsAgent)

    try {
      if (onBeforeRequest) {
        const customRequestConfig = await onBeforeRequest(requestConfig)
        if (customRequestConfig) {
          requestConfig.url = customRequestConfig.url
          requestConfig.method = customRequestConfig.method
          requestConfig.params = customRequestConfig.params
          requestConfig.headers = customRequestConfig.headers
        }
      }

      startTime = Date.now()

      const response = await axiosInstance({
        ...requestConfig,
        headers: {
          ...requestConfig.headers,
          ...additionalHeaders,
        },
        timeout,
        signal: abortController?.signal,
      })

      endTime = Date.now()
      totalDurationMs += endTime - startTime

      if (onAfterResponse) {
        onAfterResponse(
          convertAxiosResponse(response, {
            accumulativeDurationMs: totalDurationMs,
            durationMs: endTime - startTime,
            retries: retryCount,
            clientStartTime: startTime,
            clientEndTime: endTime,
            ...preRequestSocketStats,
          }),
        )
      }
      return response.data
    } catch (error: any) {
      endTime = Date.now()
      totalDurationMs += startTime ? endTime - startTime : 0
      if (onAfterResponse) {
        const convertedError = convertAxiosError(error, {
          accumulativeDurationMs: totalDurationMs,
          durationMs: startTime ? endTime - startTime : 0,
          retries: retryCount,
          clientStartTime: startTime ?? endTime,
          clientEndTime: endTime,
          ...preRequestSocketStats,
        })
        if (convertedError) {
          onAfterResponse(convertedError)
        }
      }
      if (isRetryableError(error)) {
        lastError = error
      } else {
        if (aggregateTimeoutId) {
          clearTimeout(aggregateTimeoutId)
        }
        if (isAbortedDueToAggregateTimeout) {
          throw transformError(error, 'Request aborted due to aggregate timeout')
        } else if (error.code === 'ERR_CANCELED' && abortController?.signal.aborted) {
          throw transformError(error, 'Request aborted')
        }
        throw transformError(error)
      }
    }
    retryCount++
  } while (retryCount <= retryConfig.maxRetries)

  throw transformError(lastError)
}

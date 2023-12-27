import { buildUserAgent, calculateDelay, convertAxiosError, convertAxiosResponse } from '../utils/index.js'
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
  timeoutMs?: number
}

export async function request<T = any>(options: RequestOptions): Promise<T> {
  const { retry: retryConfig, onBeforeRequest, onAfterResponse, axiosInstance } = options
  const timeout = options.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS
  const additionalHeaders: Record<string, string> = {}
  let requestConfig = plainClone(options.request)
  let retryCount = 0
  let lastError: any

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

    try {
      if (onBeforeRequest) {
        const customRequestConfig = await onBeforeRequest(requestConfig)
        if (customRequestConfig) {
          requestConfig = customRequestConfig
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
      })

      endTime = Date.now()
      totalDurationMs += endTime - startTime

      if (onAfterResponse) {
        onAfterResponse(
          convertAxiosResponse(response, {
            accumulativeDurationMs: totalDurationMs,
            durationMs: endTime - startTime,
            retries: retryCount,
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
        })
        if (convertedError) {
          onAfterResponse(convertedError)
        }
      }
      if (isRetryableError(error)) {
        lastError = error
      } else {
        throw transformError(error)
      }
    }
    retryCount++
  } while (retryCount <= retryConfig.maxRetries)

  throw transformError(lastError)
}

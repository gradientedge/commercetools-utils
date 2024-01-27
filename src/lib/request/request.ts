import { buildUserAgent, calculateDelay, convertFetchError, convertResponse } from '../utils/index.js'
import { CommercetoolsRetryConfig } from '../api/index.js'
import { CommercetoolsHooks, CommercetoolsRequest } from '../types.js'
import { isRetryableError } from './is-retryable-error.js'
import { transformError } from './transform-error.js'
import { DEFAULT_REQUEST_TIMEOUT_MS } from '../constants.js'
import { plainClone } from '../utils/plain-clone.js'
import { CommercetoolsError } from '../error/index.js'

export interface RequestOptions extends CommercetoolsHooks {
  retry: CommercetoolsRetryConfig
  request: CommercetoolsRequest
  timeoutMs?: number
}

export async function request<T = any>(options: RequestOptions): Promise<T> {
  const { retry: retryConfig, onBeforeRequest, onAfterResponse } = options
  const timeout = options.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS
  const additionalHeaders: Record<string, string> = {}
  let requestConfig = plainClone(options.request)
  let retryCount = 0
  let lastError: any
  let totalDurationMs = 0
  let startTime
  let endTime
  const failedAttempts: any[] = []

  if (onBeforeRequest) {
    const customRequestConfig = await onBeforeRequest(requestConfig)
    if (customRequestConfig) {
      requestConfig = customRequestConfig
    }
  }

  const headerNames = Object.keys(requestConfig.headers ?? {}).map((headerName) => headerName.toLowerCase())

  if (!headerNames.includes('content-type')) {
    if (['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(requestConfig.data))) {
      requestConfig.headers ??= {}
      requestConfig.headers['Content-Type'] = 'application/json'
      requestConfig.data = JSON.stringify(requestConfig.data)
    } else if (requestConfig.data) {
      throw new CommercetoolsError(
        'Content-Type header must be provided when the data property contains data but is not an object or array',
      )
    }
  }

  do {
    startTime = null
    endTime = null

    if (retryCount > 0) {
      additionalHeaders['X-Retry-Count'] = `${retryCount}`
      const delay = calculateDelay(retryCount, retryConfig)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    try {
      startTime = Date.now()

      const abortController = new AbortController()
      const timeoutHandle = setTimeout(() => abortController.abort(), timeout)

      let response: Response | undefined
      let responseData: T

      try {
        response = await fetch(requestConfig.url, {
          headers: {
            ...requestConfig.headers,
            ...additionalHeaders,
          },
          method: requestConfig.method,
          body: requestConfig.data,
          signal: abortController.signal,
          keepalive: true,
          cache: 'no-cache',
        })
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timed out after ${timeout}ms`)
        }
        throw error
      } finally {
        clearTimeout(timeoutHandle)
      }

      endTime = Date.now()
      totalDurationMs += endTime - startTime

      const contentType = response.headers.get('Content-Type') || response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        throw new CommercetoolsError("Expected JSON response but content type header was '${contentType}'")
      }

      responseData = await response.json()

      if (onAfterResponse) {
        onAfterResponse(
          convertResponse(requestConfig, response, responseData, {
            accumulativeDurationMs: totalDurationMs,
            durationMs: endTime - startTime,
            retries: retryCount,
          }),
        )
      }

      return responseData
    } catch (error: any) {
      endTime = Date.now()
      totalDurationMs += startTime ? endTime - startTime : 0
      failedAttempts.push(
        convertFetchError(error, {
          accumulativeDurationMs: totalDurationMs,
          durationMs: startTime ? endTime - startTime : 0,
          retries: retryCount,
          failedAttempts,
        }),
      )

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

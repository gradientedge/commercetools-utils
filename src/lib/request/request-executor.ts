import https from 'node:https'
import { CommercetoolsRetryConfig } from '../api/index.js'
import {
  CommercetoolsHooks,
  CommercetoolsOperationMiddleware,
  CommercetoolsRequest,
  RequestExecutor,
} from '../types.js'
import { request } from './index.js'
import { buildUserAgent, createAxiosInstance } from '../utils/index.js'
import { DEFAULT_RETRY_CONFIG } from '../constants.js'

export interface GetRequestExecutorProps extends CommercetoolsHooks {
  httpsAgent?: https.Agent
  aggregateTimeoutMs?: number
  timeoutMs?: number
  retry?: Partial<CommercetoolsRetryConfig>
  systemIdentifier?: string
  operationMiddlewares?: CommercetoolsOperationMiddleware[]
}

export function getRequestExecutor(props: GetRequestExecutorProps): RequestExecutor {
  const axiosInstance = createAxiosInstance({ httpsAgent: props.httpsAgent })
  const instanceHeaders = { 'User-Agent': buildUserAgent(props.systemIdentifier) }

  const baseExecutor: RequestExecutor = (requestConfig: CommercetoolsRequest) => {
    const headers = { ...instanceHeaders, ...requestConfig.headers }
    return request({
      axiosInstance,
      onBeforeRequest: props.onBeforeRequest,
      onAfterResponse: props.onAfterResponse,
      request: {
        ...requestConfig,
        headers,
      },
      retry: {
        ...DEFAULT_RETRY_CONFIG,
        ...props.retry,
        ...requestConfig.retry,
      },
      aggregateTimeoutMs: requestConfig.aggregateTimeoutMs ?? props.aggregateTimeoutMs,
      timeoutMs: requestConfig.timeoutMs ?? props.timeoutMs,
      abortController: requestConfig.abortController,
    })
  }

  const middlewares = props.operationMiddlewares ?? []
  if (!middlewares.length) {
    return baseExecutor
  }

  const composedExecutor = middlewares.reduceRight<RequestExecutor>((next, middleware) => {
    return (requestConfig: CommercetoolsRequest): Promise<any> => middleware(next, requestConfig)
  }, baseExecutor)

  return composedExecutor
}
